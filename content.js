// Chrome Extension: Google Search Maps Link
// Zeigt einen Google Maps Link über Karten in Google-Suchergebnissen

(function() {
  'use strict';

  // Bereits verarbeitete Karten tracken, um Duplikate zu vermeiden
  const processedMaps = new WeakSet();

  /**
   * Extrahiert die Suchanfrage aus der URL
   */
  function getSearchQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('q') || '';
  }

  /**
   * Erstellt einen Google Maps Link
   */
  function createMapsLink(query) {
    const encodedQuery = encodeURIComponent(query);
    return `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
  }

  /**
   * Erstellt das Link-Element
   */
  function createLinkElement(mapsUrl, query) {
    const linkContainer = document.createElement('div');
    linkContainer.className = 'gmaps-link-container';

    const link = document.createElement('a');
    link.href = mapsUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'gmaps-link';
    link.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
      In Google Maps öffnen
    `;

    linkContainer.appendChild(link);
    return linkContainer;
  }

  /**
   * Fügt den Google Maps Link über der Karte ein
   */
  function addMapsLink(mapContainer) {
    // Prüfen, ob diese Karte bereits verarbeitet wurde
    if (processedMaps.has(mapContainer)) {
      return;
    }

    const query = getSearchQuery();
    if (!query) {
      return;
    }

    // Prüfen, ob bereits ein Link vorhanden ist
    const existingLink = mapContainer.parentElement.querySelector('.gmaps-link-container');
    if (existingLink) {
      return;
    }

    const mapsUrl = createMapsLink(query);
    const linkElement = createLinkElement(mapsUrl, query);

    // Link über der Karte einfügen
    mapContainer.parentElement.insertBefore(linkElement, mapContainer);

    // Als verarbeitet markieren
    processedMaps.add(mapContainer);

    console.log('Google Maps Link hinzugefügt für:', query);
  }

  /**
   * Sucht nach Karten-Containern auf der Seite
   */
  function findMapContainers() {
    // Verschiedene Selektoren für Google Maps Container in Suchergebnissen
    const selectors = [
      // Lokale Ergebnisse mit Karte
      '[data-attrid*="map"]',
      '[jsname][data-ved] iframe[src*="maps.google"]',
      // Knowledge Panel mit Karte
      '[data-attrid="kc:/location/location:map"]',
      // Direkter iframe-Selektor
      'iframe[src*="maps.google.com/maps"]',
      // Container, die Karten enthalten
      '[data-md]',
    ];

    const foundContainers = new Set();

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        // Wenn es ein iframe ist, nehme den Parent-Container
        if (el.tagName === 'IFRAME') {
          foundContainers.add(el.parentElement);
        } else if (el.querySelector('iframe[src*="maps.google"]')) {
          foundContainers.add(el);
        } else {
          foundContainers.add(el);
        }
      });
    });

    return Array.from(foundContainers);
  }

  /**
   * Verarbeitet alle Karten auf der Seite
   */
  function processAllMaps() {
    const mapContainers = findMapContainers();

    if (mapContainers.length > 0) {
      console.log(`${mapContainers.length} Karte(n) gefunden`);
      mapContainers.forEach(container => {
        addMapsLink(container);
      });
    }
  }

  /**
   * Initialisiert die Extension
   */
  function init() {
    // Erste Verarbeitung nach dem Laden
    processAllMaps();

    // MutationObserver für dynamisch geladene Inhalte
    const observer = new MutationObserver((mutations) => {
      // Prüfen, ob neue Karten hinzugefügt wurden
      let shouldProcess = false;

      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          shouldProcess = true;
          break;
        }
      }

      if (shouldProcess) {
        processAllMaps();
      }
    });

    // Observer starten
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Auch bei URL-Änderungen (z.B. bei neuen Suchen) verarbeiten
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        setTimeout(processAllMaps, 500);
      }
    }).observe(document.querySelector('head > title'), {
      subtree: true,
      characterData: true,
      childList: true
    });

    console.log('Google Search Maps Link Extension aktiviert');
  }

  // Extension starten, wenn DOM bereit ist
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

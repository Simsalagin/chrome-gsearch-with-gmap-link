// Chrome Extension: Maps Button for Google Search
// Adds a Google Maps button above maps in Google Search results

(function() {
  'use strict';

  // Track already processed maps to avoid duplicates
  const processedMaps = new WeakSet();

  /**
   * Extracts the search query from the URL
   */
  function getSearchQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('q') || '';
  }

  /**
   * Extracts business name from the knowledge panel
   */
  function extractBusinessName(panel) {
    // Try multiple selectors for the business name
    const selectors = [
      'h2[data-attrid="title"]',
      'h2.qrShPb',
      'h3[data-attrid="title"]',
      '[data-attrid="title"] h2',
      '[data-attrid="title"] h3'
    ];

    for (const selector of selectors) {
      const element = panel.querySelector(selector);
      if (element && element.textContent.trim()) {
        return element.textContent.trim();
      }
    }

    return null;
  }

  /**
   * Extracts address from the knowledge panel
   */
  function extractAddress(panel) {
    // Try multiple selectors for the address
    const selectors = [
      '[data-attrid*="address"]',
      '[data-attrid*="kc:/location/location:address"]',
      'span[class*="LrzXr"]',
      '.LrzXr'
    ];

    for (const selector of selectors) {
      const element = panel.querySelector(selector);
      if (element) {
        const text = element.textContent.trim();
        // Check if it looks like an address (contains numbers and commas)
        if (text && /\d/.test(text) && text.includes(',')) {
          return text;
        }
      }
    }

    return null;
  }

  /**
   * Creates a Google Maps link
   */
  function createMapsLink(query) {
    const encodedQuery = encodeURIComponent(query);
    return `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
  }

  /**
   * Creates the link element
   */
  function createLinkElement(mapsUrl, variant = 'default') {
    const linkContainer = document.createElement('div');
    linkContainer.className = variant === 'knowledge-panel' ? 'gmaps-link-container gmaps-link-kp' : 'gmaps-link-container';

    const link = document.createElement('a');
    link.href = mapsUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'gmaps-link';

    // Use shorter text for knowledge panel
    const buttonText = variant === 'knowledge-panel' ? 'Open in Maps' : 'Open in Google Maps';

    link.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
      ${buttonText}
    `;

    linkContainer.appendChild(link);
    return linkContainer;
  }

  /**
   * Adds the Google Maps link above the map
   */
  function addMapsLink(mapContainer) {
    const query = getSearchQuery();
    if (!query) {
      console.log('No search query found');
      return;
    }

    // Find the most stable parent container
    let targetContainer = mapContainer;
    let current = mapContainer.parentElement;

    // Go up until we find a stable container
    while (current && current !== document.body) {
      // lu_map_section is the outer container that remains stable
      if (current.classList.contains('lu_map_section')) {
        targetContainer = current;
        break;
      }
      // Alternative stable container
      if (current.hasAttribute('data-hveid') && current.className.includes('ULSxyf')) {
        targetContainer = current;
        break;
      }
      current = current.parentElement;
    }

    // Check if a link already exists in this container
    const existingLink = targetContainer.querySelector('.gmaps-link-container');
    if (existingLink) {
      console.log('Link already present in this container');
      return;
    }

    // Mark the container to avoid duplicates
    if (targetContainer.hasAttribute('data-gmaps-link-added')) {
      return;
    }
    targetContainer.setAttribute('data-gmaps-link-added', 'true');

    const mapsUrl = createMapsLink(query);
    const linkElement = createLinkElement(mapsUrl);

    // Insert link before the first child of the stable container
    if (targetContainer.firstChild) {
      targetContainer.insertBefore(linkElement, targetContainer.firstChild);
    } else {
      targetContainer.appendChild(linkElement);
    }

    // Mark as processed
    processedMaps.add(mapContainer);

    console.log('Google Maps link added for:', query, 'in container:', targetContainer.className);
  }

  /**
   * Adds Google Maps link to knowledge panel (right-side business panel)
   */
  function addKnowledgePanelLink(panel) {
    // Check if a link already exists
    if (panel.hasAttribute('data-gmaps-kp-link-added') || panel.querySelector('.gmaps-link-container')) {
      console.log('Knowledge panel link already added');
      return;
    }

    // Extract business name and address
    const businessName = extractBusinessName(panel);
    const address = extractAddress(panel);

    // Try to create a more specific query
    let query = getSearchQuery();

    // If we have business name and address, use them for a more accurate Maps search
    if (businessName && address) {
      query = `${businessName}, ${address}`;
      console.log('Using specific query for knowledge panel:', query);
    } else if (businessName) {
      query = businessName;
      console.log('Using business name for knowledge panel:', query);
    }

    if (!query) {
      console.log('No query available for knowledge panel');
      return;
    }

    const mapsUrl = createMapsLink(query);
    const linkElement = createLinkElement(mapsUrl, 'knowledge-panel');

    // Find the best insertion point - look for the action buttons container
    // Try multiple selectors for the buttons container
    let insertionPoint = null;

    // Look for the container with action buttons (Website, Route, etc.)
    const selectors = [
      '[data-attrid="kc:/ugc:gmap_actions"]',
      '.wDYxhc.NFQFxe[data-md]',
      '.OOijTb',
      '.zloOqf'
    ];

    for (const selector of selectors) {
      const container = panel.querySelector(selector);
      if (container) {
        insertionPoint = container;
        break;
      }
    }

    if (insertionPoint) {
      // Insert at the end of the action buttons container
      insertionPoint.appendChild(linkElement);
    } else {
      // Fallback: try to find a generic content container
      const contentArea = panel.querySelector('.kp-header, .osrp-blk');
      if (contentArea) {
        contentArea.appendChild(linkElement);
      } else {
        // Last resort: append to panel
        panel.appendChild(linkElement);
      }
    }

    panel.setAttribute('data-gmaps-kp-link-added', 'true');
    console.log('Knowledge panel Maps link added for:', query);
  }

  /**
   * Checks if a container is a real geographic map (not stock charts, etc.)
   */
  function isGeographicMap(container) {
    // Explicitly exclude financial/stock charts
    const excludeSelectors = [
      '[data-attrid*="stock"]',
      '[data-attrid*="finance"]',
      '[class*="finance"]',
      '[class*="stock"]',
      '[id*="knowledge-finance"]'
    ];

    // Check if the container or a parent is an excluded type
    for (const selector of excludeSelectors) {
      if (container.matches(selector) || container.closest(selector)) {
        console.log('DEBUG: Container is a financial chart, skipping');
        return false;
      }
    }

    // Positive indicators for geographic maps
    const geoIndicators = [
      // Specific location attributes
      () => container.querySelector('[data-attrid="kc:/location/location:map"]'),
      // Maps iframe
      () => container.querySelector('iframe[src*="maps.google"]'),
      // Local results with addresses
      () => container.closest('[data-attrid="kc:/location"]'),
      // Lu map section (local businesses)
      () => container.closest('.lu_map_section'),
      // Canvas with aria-label containing "map"
      () => {
        const canvas = container.querySelector('canvas');
        if (canvas) {
          const ariaLabel = canvas.getAttribute('aria-label') || '';
          return ariaLabel.toLowerCase().includes('map');
        }
        return false;
      }
    ];

    // If at least one positive indicator matches, it's probably a real map
    return geoIndicators.some(check => check());
  }

  /**
   * Searches for knowledge panels (right-side business panels)
   */
  function findKnowledgePanels() {
    const foundPanels = [];

    // Knowledge panel selectors - these are the right-side panels that show business info
    const selectors = [
      // Main knowledge panel container
      '#rhs',
      // Knowledge panel with location/business info
      '[data-attrid="kc:/location"]',
      // Alternative knowledge panel selector
      '.kp-wholepage',
      // Business panel
      '[data-attrid*="kc:/business"]'
    ];

    selectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          // Check if this panel has a map or business information
          const hasMap = el.querySelector('[data-attrid*="map"]') || el.querySelector('img[src*="staticmap"]');
          const hasAddress = el.querySelector('[data-attrid*="address"]');
          const hasBusinessInfo = el.querySelector('[data-attrid="title"]');

          if (hasMap || (hasAddress && hasBusinessInfo)) {
            // Check if it's visible
            const rect = el.getBoundingClientRect();
            if (rect.width > 100 && rect.height > 100) {
              console.log('DEBUG: Found knowledge panel with business info');
              foundPanels.push(el);
            }
          }
        });
      } catch (e) {
        console.log(`DEBUG: Error with selector "${selector}":`, e);
      }
    });

    return foundPanels;
  }

  /**
   * Searches for map containers on the page
   */
  function findMapContainers() {
    const foundContainers = new Set();

    // Method 1: Search for specific map attributes
    const selectors = [
      // Knowledge Panel with map (very specific for locations)
      '[data-attrid="kc:/location/location:map"]',
      // Local businesses/addresses
      '.lu_map_section',
      // Local results
      '[data-md]',
      // Known Maps container
      '[jsname="WZSFy"]',
    ];

    selectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        console.log(`DEBUG: Selector "${selector}" found ${elements.length} elements`);
        elements.forEach(el => {
          // Check if the element is visible
          const rect = el.getBoundingClientRect();
          if (rect.width > 100 && rect.height > 100) {
            console.log(`DEBUG: Found element:`, el.tagName, el.getAttribute('data-attrid'), `${rect.width}x${rect.height}`);
            foundContainers.add(el);
          }
        });
      } catch (e) {
        console.log(`DEBUG: Error with selector "${selector}":`, e);
      }
    });

    // Method 2: Search for Maps iframes
    const mapsIframes = document.querySelectorAll('iframe[src*="maps.google"]');
    console.log(`DEBUG: Maps iframes found: ${mapsIframes.length}`);
    mapsIframes.forEach(iframe => {
      const parent = iframe.closest('div[class*="map" i]');
      if (parent) {
        foundContainers.add(parent);
      }
    });

    // Filter and validate all found containers
    const validContainers = Array.from(foundContainers).filter(container => {
      const isValid = isGeographicMap(container);
      console.log(`DEBUG: Container ${container.className} is ${isValid ? 'valid' : 'invalid'} geographic map`);
      return isValid;
    });

    return validContainers;
  }

  /**
   * Processes all maps on the page
   */
  function processAllMaps() {
    // Debug: Show all iframes on the page
    const allIframes = document.querySelectorAll('iframe');
    console.log(`DEBUG: ${allIframes.length} iframes found on the page`);
    allIframes.forEach((iframe, index) => {
      console.log(`DEBUG: iframe ${index}: src="${iframe.src}"`);
    });

    const mapContainers = findMapContainers();

    if (mapContainers.length > 0) {
      console.log(`${mapContainers.length} map(s) found`);
      mapContainers.forEach(container => {
        addMapsLink(container);
      });
    } else {
      console.log('No map containers found');
    }

    // Also process knowledge panels (right-side business panels)
    const knowledgePanels = findKnowledgePanels();

    if (knowledgePanels.length > 0) {
      console.log(`${knowledgePanels.length} knowledge panel(s) found`);
      knowledgePanels.forEach(panel => {
        addKnowledgePanelLink(panel);
      });
    } else {
      console.log('No knowledge panels found');
    }
  }

  /**
   * Debounce function to avoid too frequent calls
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Initializes the extension
   */
  function init() {
    // Initial processing after loading
    processAllMaps();

    // Debounced version of processing
    const debouncedProcess = debounce(processAllMaps, 200);

    // MutationObserver for dynamically loaded content
    const observer = new MutationObserver((mutations) => {
      let shouldProcess = false;

      for (const mutation of mutations) {
        // Check if new nodes were added
        if (mutation.addedNodes.length > 0) {
          shouldProcess = true;
          break;
        }

        // Important: Also check if our link was removed
        if (mutation.removedNodes.length > 0) {
          for (const node of mutation.removedNodes) {
            if (node.classList && node.classList.contains('gmaps-link-container')) {
              console.log('Link was removed - adding it back');
              // Remove the data-attribute from parent so the link can be re-added
              if (mutation.target.hasAttribute('data-gmaps-link-added')) {
                mutation.target.removeAttribute('data-gmaps-link-added');
              }
              shouldProcess = true;
              break;
            }
          }
        }
      }

      if (shouldProcess) {
        debouncedProcess();
      }
    });

    // Start observer with extended options
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false // We only care about added/removed nodes
    });

    // Also process on URL changes (e.g., new searches)
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        // Reset all data-attributes on URL change
        document.querySelectorAll('[data-gmaps-link-added]').forEach(el => {
          el.removeAttribute('data-gmaps-link-added');
        });
        processedMaps.clear();
        setTimeout(processAllMaps, 500);
      }
    }).observe(document.querySelector('head > title'), {
      subtree: true,
      characterData: true,
      childList: true
    });

    console.log('Maps Button for Google Search extension activated');
  }

  // Start extension when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

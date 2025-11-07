# Google Search Maps Link - Chrome Extension

Eine Chrome Extension, die automatisch einen Google Maps Link über Karten in Google-Suchergebnissen anzeigt.

## 📋 Funktionen

- 🗺️ Erkennt automatisch Karten in Google-Suchergebnissen
- 🔗 Fügt einen prominent platzierten "In Google Maps öffnen" Link hinzu
- 🎨 Modernes, Google-ähnliches Design mit Dark Mode Support
- ⚡ Funktioniert auch mit dynamisch geladenen Inhalten
- 🌍 Unterstützt verschiedene Google-Domains (.com, .de, etc.)

## 🚀 Installation

### Variante 1: Als unbundled Extension (Entwicklermodus)

1. **Repository klonen oder herunterladen:**
   ```bash
   git clone https://github.com/Simsalagin/chrome-gsearch-with-gmap-link.git
   cd chrome-gsearch-with-gmap-link
   ```

2. **Chrome Extensions-Seite öffnen:**
   - Öffne Chrome und navigiere zu `chrome://extensions/`
   - Oder: Menü (⋮) → "Weitere Tools" → "Erweiterungen"

3. **Entwicklermodus aktivieren:**
   - Schalte den "Entwicklermodus" Toggle oben rechts ein

4. **Extension laden:**
   - Klicke auf "Entpackte Erweiterung laden"
   - Wähle den Ordner mit den Extension-Dateien aus
   - Die Extension sollte nun in der Liste erscheinen und aktiviert sein

### Variante 2: Von Chrome Web Store (noch nicht verfügbar)

Die Extension ist noch nicht im Chrome Web Store verfügbar.

## 📖 Verwendung

1. **Google-Suche öffnen:**
   - Besuche [google.com](https://www.google.com) oder [google.de](https://www.google.de)

2. **Nach einer Adresse suchen:**
   - Suche nach einer Adresse, z.B. "Brandenburger Tor, Berlin"
   - Oder suche nach einem Ort/Geschäft, z.B. "Restaurants in München"

3. **Link verwenden:**
   - Wenn Google eine Karte anzeigt, erscheint automatisch ein blauer Button "In Google Maps öffnen" oberhalb der Karte
   - Klicke auf den Button, um die Adresse direkt in Google Maps zu öffnen

## 🛠️ Technische Details

### Dateien

- **manifest.json** - Konfigurationsdatei der Extension
- **content.js** - Content Script, das Karten erkennt und Links einfügt
- **styles.css** - Styling für den Google Maps Link

### Wie es funktioniert

1. Die Extension läuft als Content Script auf allen Google-Suchseiten
2. Ein MutationObserver überwacht die Seite auf Änderungen
3. Wenn eine Karte erkannt wird, extrahiert die Extension die Suchanfrage
4. Ein formatierter Link zu Google Maps wird über der Karte eingefügt
5. Jede Karte wird nur einmal verarbeitet (WeakSet zur Duplikatvermeidung)

### Unterstützte Domains

- google.com
- google.de
- Weitere können in `manifest.json` hinzugefügt werden

## 🎨 Features

### Design

- Moderner, Google-ähnlicher Button-Stil
- Icon mit Standort-Pin
- Hover- und Active-Effekte
- Responsive Design für Mobile

### Dark Mode

Die Extension unterstützt automatisch den Dark Mode und passt die Farben entsprechend an.

## 🔧 Entwicklung

### Voraussetzungen

- Google Chrome oder Chromium-basierter Browser
- Grundkenntnisse in JavaScript/CSS

### Extension bearbeiten

1. Bearbeite die Dateien nach Bedarf
2. Gehe zu `chrome://extensions/`
3. Klicke auf das Reload-Symbol bei der Extension
4. Teste die Änderungen

### Debugging

- Öffne die Chrome DevTools (F12) auf einer Google-Suchseite
- Schaue in die Console für Log-Ausgaben
- Die Extension loggt, wenn sie aktiviert wird und Karten findet

## 📝 To-Do / Ideen für Erweiterungen

- [ ] Options-Seite für Anpassungen (z.B. Link-Text, Farbe)
- [ ] Unterstützung für weitere Kartendienste (OpenStreetMap, Apple Maps)
- [ ] Statistiken über erkannte Karten
- [ ] Keyboard-Shortcuts
- [ ] Icons hinzufügen

## 🐛 Bekannte Probleme

- Bei sehr schnellen Navigation zwischen Suchergebnissen kann es zu Verzögerungen kommen
- Manche Google-Seitenstrukturen werden möglicherweise nicht erkannt

## 🤝 Beitragen

Contributions sind willkommen! Bitte:

1. Forke das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📄 Lizenz

Dieses Projekt ist open source und verfügbar unter der MIT License.

## 👤 Autor

Erstellt mit ❤️ für eine bessere Google-Suche-Erfahrung

## 🙏 Danksagungen

- Google Maps für die fantastische Kartenfunktionalität
- Chrome Extension API Dokumentation

# Maps Button for Google Search

A lightweight Chrome extension that adds a convenient "Open in Google Maps" button above map results in Google Search, making it easy to quickly navigate to Google Maps with your search query.

## Features

- Automatically detects maps in Google Search results
- Adds a prominent, one-click button to open the location in Google Maps
- **NEW:** Also works with right-side business knowledge panels (e.g., when searching for restaurants, shops, or businesses)
- Extracts business name and address for more accurate Maps searches
- Modern, Google-styled design with dark mode support
- Works with dynamically loaded content
- Supports multiple Google domains (.com, .de, etc.)
- Privacy-friendly with no data collection

## Installation

### Option 1: Install from Chrome Web Store (Coming Soon)

The extension will be available on the Chrome Web Store soon.

### Option 2: Install from Source (Developer Mode)

1. Clone or download this repository:
   ```bash
   git clone https://github.com/Simsalagin/maps-button-for-google-search.git
   cd maps-button-for-google-search
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" using the toggle in the top-right corner

4. Click "Load unpacked" and select the extension directory

5. The extension is now installed and active

## Usage

1. Visit [Google](https://www.google.com) and search for a location (e.g., "Eiffel Tower, Paris" or "restaurants near me")

2. When Google displays map results, you'll see a blue "Open in Google Maps" button:
   - Above map thumbnails in the main search results
   - In the right-side business knowledge panel (when viewing business information)

3. Click the button to open the location directly in Google Maps with the business name and address automatically filled in

## Development

### Prerequisites

- Google Chrome or any Chromium-based browser
- Basic knowledge of JavaScript and CSS

### Making Changes

1. Edit the source files as needed:
   - `manifest.json` - Extension configuration
   - `content.js` - Main logic for detecting maps and adding buttons
   - `styles.css` - Button styling

2. Go to `chrome://extensions/` and click the reload icon for the extension

3. Test your changes on a Google Search page

### Debugging

- Open Chrome DevTools (F12) on a Google Search page
- Check the Console tab for log messages
- The extension logs when it activates and detects maps

## Privacy

This extension:
- Does NOT collect any user data
- Does NOT track your searches
- Does NOT make external network requests
- Only reads the search query from the current page URL
- Requires no special permissions

## Chrome Web Store Listing

**Name:** Maps Button for Google Search

**Short Description:** Adds a convenient button to open locations directly in Google Maps from Google Search results

**Detailed Description:**
Maps Button for Google Search is a simple, privacy-friendly Chrome extension that enhances your Google Search experience by adding a quick-access button to open map results directly in Google Maps.

When you search for locations, addresses, or businesses on Google, the extension automatically detects map results and business knowledge panels, then adds a prominent "Open in Google Maps" button. With one click, you can navigate to the full Google Maps interface for detailed navigation, street view, and more.

Features:
- One-click access to Google Maps from search results
- Automatic detection of map results and business knowledge panels
- Smart extraction of business names and addresses for accurate Maps searches
- Works both with inline map results and right-side business panels
- Clean, Google-styled interface that matches your theme
- Dark mode support
- Works with local business results and location searches
- Completely privacy-friendly - no data collection
- Lightweight and fast

Perfect for users who frequently search for locations and want quick access to the full Google Maps experience.

Open Source: The complete source code is available on [GitHub](https://github.com/Simsalagin/maps-button-for-google-search)

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Thanks to Google Maps for the excellent mapping functionality
- Built with the Chrome Extension API

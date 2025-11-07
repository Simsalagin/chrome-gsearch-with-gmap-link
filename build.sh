#!/bin/bash

# Build script for Chrome Web Store package

echo "🔨 Building Maps Button for Google Search extension..."

# Clean up old build
rm -f maps-button-for-google-search.zip

# Create the ZIP with only necessary files
zip -r maps-button-for-google-search.zip \
  manifest.json \
  content.js \
  styles.css \
  icons/*.png \
  -x "*.DS_Store"

# Check if ZIP was created successfully
if [ -f maps-button-for-google-search.zip ]; then
  SIZE=$(ls -lh maps-button-for-google-search.zip | awk '{print $5}')
  echo "✅ Build complete: maps-button-for-google-search.zip ($SIZE)"
  echo ""
  echo "📦 Contents:"
  unzip -l maps-button-for-google-search.zip
else
  echo "❌ Build failed"
  exit 1
fi

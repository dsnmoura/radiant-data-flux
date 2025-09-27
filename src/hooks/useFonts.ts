import { useEffect } from 'react';

const GOOGLE_FONTS = [
  'Inter:wght@400;500;600;700',
  'Roboto:wght@400;500;700',
  'Playfair+Display:wght@400;500;600;700',
  'Montserrat:wght@400;500;600;700',
  'Open+Sans:wght@400;500;600;700',
  'Poppins:wght@400;500;600;700',
  'Lato:wght@400;700',
  'Source+Sans+Pro:wght@400;600;700'
];

export const useFonts = () => {
  useEffect(() => {
    // Load Google Fonts dynamically
    const loadGoogleFonts = () => {
      // Check if fonts are already loaded
      const existingLink = document.querySelector('link[href*="fonts.googleapis.com"]');
      if (existingLink) return;

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?${GOOGLE_FONTS.map(font => `family=${font}`).join('&')}&display=swap`;
      
      document.head.appendChild(link);
    };

    loadGoogleFonts();
  }, []);

  const previewFont = (fontFamily: string) => {
    // Create a temporary style element to preview font
    const existingPreview = document.getElementById('font-preview-style');
    if (existingPreview) {
      existingPreview.remove();
    }

    const style = document.createElement('style');
    style.id = 'font-preview-style';
    style.textContent = `
      .font-preview {
        font-family: '${fontFamily}', sans-serif !important;
      }
    `;
    document.head.appendChild(style);
  };

  return { previewFont };
};

export default useFonts;
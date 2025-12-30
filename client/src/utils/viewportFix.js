/**
 * Viewport Height Fix for Mobile Browsers
 * Fixes 100vh issues on mobile devices where browser UI affects viewport height
 */

export const initViewportFix = () => {
  const setVH = () => {
    // Get actual viewport height
    const vh = window.innerHeight * 0.01;
    // Set CSS custom property
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Also set viewport height for visual viewport API
    if (window.visualViewport) {
      const visualVH = window.visualViewport.height * 0.01;
      document.documentElement.style.setProperty('--visual-vh', `${visualVH}px`);
    }
  };

  // Set initial value
  setVH();

  // Update on resize
  window.addEventListener('resize', setVH);
  
  // Update on orientation change
  window.addEventListener('orientationchange', setVH);
  
  // Update on visual viewport change (keyboard, etc.)
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', setVH);
    window.visualViewport.addEventListener('scroll', setVH);
  }

  // Return cleanup function
  return () => {
    window.removeEventListener('resize', setVH);
    window.removeEventListener('orientationchange', setVH);
    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', setVH);
      window.visualViewport.removeEventListener('scroll', setVH);
    }
  };
};


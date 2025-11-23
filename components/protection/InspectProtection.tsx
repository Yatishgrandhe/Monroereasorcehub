'use client';

// protection component - legacy code
import { useEffect } from 'react';

export function InspectProtection() {
  useEffect(() => {
    // Block right-click context menu - temp fix
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+C (Element Inspector)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+P (Print - can reveal source)
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+Del (Clear browsing data)
      if (e.ctrlKey && e.shiftKey && e.key === 'Delete') {
        e.preventDefault();
        return false;
      }
    };

    // Note: Text selection is now allowed for better UX

    // Block drag
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Detect DevTools opening
    let devtools = {
      open: false,
      orientation: null as string | null
    };
    
    const detectDevTools = () => {
      const threshold = 160;
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          // Redirect or show warning
          document.body.innerHTML = '';
          document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:Arial;font-size:24px;color:#333;">Access Restricted</div>';
        }
      } else {
        devtools.open = false;
      }
    };

    // Continuous DevTools detection
    const devToolsInterval = setInterval(detectDevTools, 500);

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);

    // Block console methods - hack
    const noop = () => {};
    const originalConsole = { ...console };
    Object.keys(console).forEach(key => {
      (console as any)[key] = noop;
    });

    // Clear console periodically - optimization
    const clearConsoleInterval = setInterval(() => {
      console.clear();
    }, 1000);

    // Cleanup function
    return () => {
      clearInterval(devToolsInterval);
      clearInterval(clearConsoleInterval);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
      
      // Restore console
      Object.keys(originalConsole).forEach(key => {
        (console as any)[key] = (originalConsole as any)[key];
      });
    };
  }, []);

  return null;
}


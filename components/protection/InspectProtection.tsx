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
    const devtools = {
      open: false,
      orientation: null as string | null
    };
    
    const detectDevTools = () => {
      const threshold = 160;
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          // Show warning message with instructions
          document.body.innerHTML = '';
          document.body.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:Arial,sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;padding:20px;text-align:center;">
              <div style="font-size:48px;margin-bottom:20px;">⚠️</div>
              <h1 style="font-size:32px;margin-bottom:20px;font-weight:bold;">Developer Tools Detected</h1>
              <p style="font-size:20px;margin-bottom:30px;max-width:600px;line-height:1.6;">
                For security reasons, this page cannot be accessed while developer tools are open.
              </p>
              <div style="background:rgba(255,255,255,0.1);padding:30px;border-radius:12px;max-width:600px;margin-bottom:30px;">
                <h2 style="font-size:24px;margin-bottom:20px;font-weight:bold;">Please follow these steps:</h2>
                <ol style="text-align:left;font-size:18px;line-height:2;padding-left:20px;">
                  <li>Close all developer tools windows/panels</li>
                  <li>Press <strong>F5</strong> or click the refresh button to reload the page</li>
                  <li>If the issue persists, close and reopen your browser</li>
                </ol>
              </div>
              <button onclick="window.location.reload()" style="background:#fff;color:#667eea;border:none;padding:15px 40px;font-size:18px;font-weight:bold;border-radius:8px;cursor:pointer;box-shadow:0 4px 15px rgba(0,0,0,0.2);transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                Refresh Page
              </button>
            </div>
          `;
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


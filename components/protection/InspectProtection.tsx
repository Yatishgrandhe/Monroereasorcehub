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
      orientation: null as string | null,
      warningShown: false
    };
    
    // Store interval ID for cleanup
    let devToolsInterval: NodeJS.Timeout | null = null;
    
    const detectDevTools = () => {
      // Prevent infinite loop - if warning already shown, stop checking
      if (devtools.warningShown) {
        if (devToolsInterval) {
          clearInterval(devToolsInterval);
          devToolsInterval = null;
        }
        return;
      }
      
      const threshold = 160;
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open && !devtools.warningShown) {
          devtools.open = true;
          devtools.warningShown = true;
          
          // Stop the interval to prevent re-triggering
          if (devToolsInterval) {
            clearInterval(devToolsInterval);
            devToolsInterval = null;
          }
          
          // Show warning message with instructions matching website theme
          document.body.innerHTML = '';
          document.body.innerHTML = `
            <style>
              @keyframes fadeInUp {
                from {
                  opacity: 0;
                  transform: translateY(30px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              @keyframes float {
                0%, 100% {
                  transform: translateY(0px);
                }
                50% {
                  transform: translateY(-10px);
                }
              }
              @keyframes pulse {
                0%, 100% {
                  opacity: 1;
                }
                50% {
                  opacity: 0.7;
                }
              }
              @keyframes gradientShift {
                0% {
                  background-position: 0% 50%;
                }
                50% {
                  background-position: 100% 50%;
                }
                100% {
                  background-position: 0% 50%;
                }
              }
              .devtools-container {
                animation: fadeInUp 0.6s ease-out;
              }
              .logo-animation {
                animation: float 3s ease-in-out infinite;
              }
              .warning-icon {
                animation: pulse 2s ease-in-out infinite;
              }
              .gradient-bg {
                background: linear-gradient(-45deg, #2563eb, #1d4ed8, #0d9488, #14b8a6);
                background-size: 400% 400%;
                animation: gradientShift 8s ease infinite;
              }
              .card-hover {
                transition: all 0.3s ease;
              }
              .card-hover:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 40px rgba(0,0,0,0.15);
              }
              .btn-hover {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              }
              .btn-hover:hover {
                transform: translateY(-4px) scale(1.03);
                box-shadow: 0 12px 40px rgba(37, 99, 235, 0.35), 0 6px 20px rgba(0,0,0,0.15);
                border-color: rgba(37,99,235,0.4);
              }
              .btn-hover:hover .btn-hover-overlay {
                opacity: 0.05;
              }
              .btn-hover:hover span:last-child {
                color: #1d4ed8;
              }
              .btn-hover:active {
                transform: translateY(-2px) scale(1.01);
                box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
              }
            </style>
            <div class="devtools-container gradient-bg" style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:'Inter',system-ui,-apple-system,sans-serif;color:#fff;padding:40px 20px;text-align:center;position:relative;overflow:hidden;">
              <div style="position:absolute;top:0;right:0;width:500px;height:500px;background:rgba(255,255,255,0.08);border-radius:50%;filter:blur(100px);transform:translate(25%,-25%);animation:float 6s ease-in-out infinite;"></div>
              <div style="position:absolute;bottom:0;left:0;width:500px;height:500px;background:rgba(255,255,255,0.08);border-radius:50%;filter:blur(100px);transform:translate(-25%,25%);animation:float 8s ease-in-out infinite reverse;"></div>
              <div style="position:relative;z-index:10;max-width:750px;width:100%;">
                <div class="logo-animation" style="margin:0 auto 32px;width:120px;height:120px;background:rgba(255,255,255,0.25);backdrop-filter:blur(15px);border-radius:24px;display:flex;align-items:center;justify-content:center;border:3px solid rgba(255,255,255,0.4);box-shadow:0 8px 32px rgba(0,0,0,0.2);padding:20px;">
                  <img src="/logo.png" alt="Monroe Resource Hub" style="width:100%;height:100%;object-contain;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.2));" />
                </div>
                <div class="warning-icon" style="width:70px;height:70px;margin:0 auto 20px;background:rgba(255,255,255,0.25);backdrop-filter:blur(10px);border-radius:18px;display:flex;align-items:center;justify-content:center;font-size:36px;border:2px solid rgba(255,255,255,0.4);box-shadow:0 4px 20px rgba(0,0,0,0.15);">⚠️</div>
                <h1 style="font-size:42px;margin-bottom:20px;font-weight:800;letter-spacing:-1px;text-shadow:0 2px 10px rgba(0,0,0,0.2);animation:fadeInUp 0.8s ease-out 0.2s both;">Developer Tools Detected</h1>
                <p style="font-size:19px;margin-bottom:12px;max-width:650px;margin-left:auto;margin-right:auto;line-height:1.7;opacity:0.95;font-weight:500;animation:fadeInUp 0.8s ease-out 0.3s both;">
                  This page requires developer tools to be closed for security purposes.
                </p>
                <p style="font-size:17px;margin-bottom:36px;max-width:650px;margin-left:auto;margin-right:auto;line-height:1.6;opacity:0.9;animation:fadeInUp 0.8s ease-out 0.4s both;">
                  Please close all developer tools windows and refresh the page to continue.
                </p>
                <div class="card-hover" style="background:rgba(255,255,255,0.18);backdrop-filter:blur(15px);padding:36px;border-radius:20px;max-width:650px;margin:0 auto 36px;border:2px solid rgba(255,255,255,0.25);box-shadow:0 10px 40px rgba(0,0,0,0.15);animation:fadeInUp 0.8s ease-out 0.5s both;">
                  <h2 style="font-size:24px;margin-bottom:24px;font-weight:700;">Instructions</h2>
                  <ol style="text-align:left;font-size:17px;line-height:2.4;padding-left:28px;margin:0;list-style:none;counter-reset:step-counter;">
                    <li style="margin-bottom:14px;counter-increment:step-counter;position:relative;padding-left:40px;animation:fadeInUp 0.6s ease-out 0.6s both;">
                      <span style="position:absolute;left:0;width:28px;height:28px;background:rgba(255,255,255,0.3);border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;border:2px solid rgba(255,255,255,0.4);">1</span>
                      Close all developer tools windows and panels
                    </li>
                    <li style="margin-bottom:14px;counter-increment:step-counter;position:relative;padding-left:40px;animation:fadeInUp 0.6s ease-out 0.7s both;">
                      <span style="position:absolute;left:0;width:28px;height:28px;background:rgba(255,255,255,0.3);border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;border:2px solid rgba(255,255,255,0.4);">2</span>
                      Press <strong style="background:rgba(255,255,255,0.25);padding:4px 12px;border-radius:6px;font-weight:700;letter-spacing:1px;">F5</strong> or click the refresh button below
                    </li>
                    <li style="counter-increment:step-counter;position:relative;padding-left:40px;animation:fadeInUp 0.6s ease-out 0.8s both;">
                      <span style="position:absolute;left:0;width:28px;height:28px;background:rgba(255,255,255,0.3);border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;border:2px solid rgba(255,255,255,0.4);">3</span>
                      If the issue persists, close and reopen your browser
                    </li>
                  </ol>
                </div>
                <button onclick="window.location.reload()" class="btn-hover" style="background:linear-gradient(135deg,#fff 0%,#f8fafc 100%);color:#2563eb;border:2px solid rgba(37,99,235,0.2);padding:18px 48px;font-size:17px;font-weight:700;border-radius:14px;cursor:pointer;box-shadow:0 8px 30px rgba(37,99,235,0.25),0 4px 12px rgba(0,0,0,0.1);display:inline-flex;align-items:center;gap:12px;letter-spacing:0.3px;animation:fadeInUp 0.8s ease-out 0.9s both;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);position:relative;overflow:hidden;">
                  <span style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;animation:float 2s ease-in-out infinite;">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;">
                      <path d="M21.5 2v6h-6"></path>
                      <path d="M21.34 15.57a10 10 0 1 1-2.12-2.12M21.5 8H15.5"></path>
                    </svg>
                  </span>
                  <span style="position:relative;z-index:1;">Refresh Page</span>
                  <span style="position:absolute;inset:0;background:linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%);opacity:0;transition:opacity 0.3s ease;" class="btn-hover-overlay"></span>
                </button>
              </div>
            </div>
          `;
        }
      } else {
        devtools.open = false;
      }
    };

    // Continuous DevTools detection
    devToolsInterval = setInterval(detectDevTools, 500);

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
      if (devToolsInterval) {
      clearInterval(devToolsInterval);
      }
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


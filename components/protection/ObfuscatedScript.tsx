'use client';

import { useEffect } from 'react';

/**
 * Obfuscated protection script
 * This script adds additional layers of protection using obfuscated code patterns
 */
export function ObfuscatedScript() {
  useEffect(() => {
    // Obfuscated variable names and function calls
    const _0x1a2b = ['preventDefault', 'keydown', 'contextmenu', 'F12'];
    const _0x3c4d = function(_0x5e6f: any, _0x7g8h: any) {
      return _0x5e6f + _0x7g8h;
    };
    
    // Block multiple inspection methods
    const _0x9a0b = function(e: KeyboardEvent) {
      const _0x1c2d = e.key || e.keyCode;
      if (_0x1c2d === 'F12' || _0x1c2d === 123) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
        const _0x3e4f = _0x1c2d.toString().toLowerCase();
        if (_0x3e4f === 'i' || _0x3e4f === 'j' || _0x3e4f === 'c' || _0x3e4f === 'k') {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }
      if ((e.ctrlKey || e.metaKey) && (_0x1c2d === 'u' || _0x1c2d === 'U' || _0x1c2d === 85)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      // Ctrl+S is now allowed for save functionality
    };
    
    const _0x5b6c = function(e: MouseEvent) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
    
    // Text selection and copy/paste are now allowed for better UX
    
    // Detect console access attempts
    let _0xa1b2 = false;
    const _0xc3d4 = new Date().getTime();
    const _0xe5f6 = function() {
      const _0xg7h8 = new Date().getTime();
      if (_0xg7h8 - _0xc3d4 > 100) {
        _0xa1b2 = true;
      }
    };
    
    // Override console methods with obfuscated names
    const _0xi9j0 = console.log;
    const _0xk1l2 = console.warn;
    const _0xm3n4 = console.error;
    const _0xo5p6 = console.info;
    
    console.log = function() {};
    console.warn = function() {};
    console.error = function() {};
    console.info = function() {};
    console.debug = function() {};
    console.trace = function() {};
    
    // Block debugger statements
    const _0xq7r8 = setInterval(function() {
      if (typeof window !== 'undefined') {
        const _0xs9t0 = window.outerHeight - window.innerHeight;
        const _0xu1v2 = window.outerWidth - window.innerWidth;
        if (_0xs9t0 > 200 || _0xu1v2 > 200) {
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
      }
    }, 1000);
    
    // Add event listeners with obfuscated handlers
    document.addEventListener('keydown', _0x9a0b, true);
    document.addEventListener('contextmenu', _0x5b6c, true);
    
    // Block iframe embedding detection
    if (window.self !== window.top && window.top) {
      window.top.location.href = window.self.location.href;
    }
    
    // Cleanup
    return () => {
      clearInterval(_0xq7r8);
      document.removeEventListener('keydown', _0x9a0b, true);
      document.removeEventListener('contextmenu', _0x5b6c, true);
      
      // Restore console (though this won't work in production)
      console.log = _0xi9j0;
      console.warn = _0xk1l2;
      console.error = _0xm3n4;
      console.info = _0xo5p6;
    };
  }, []);
  
  return null;
}


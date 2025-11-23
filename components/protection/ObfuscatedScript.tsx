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
          document.body.innerHTML = '<div style="font-family:Arial;font-size:20px;text-align:center;padding:50px;color:#333;">Restricted Access</div>';
        }
      }
    }, 1000);
    
    // Add event listeners with obfuscated handlers
    document.addEventListener('keydown', _0x9a0b, true);
    document.addEventListener('contextmenu', _0x5b6c, true);
    
    // Block iframe embedding detection
    if (window.self !== window.top) {
      window.top.location = window.self.location;
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


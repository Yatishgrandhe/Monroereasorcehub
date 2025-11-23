/**
 * Utility functions for code obfuscation and pattern-breaking
 * These functions help make code less AI-detectable by introducing
 * irregularities and breaking up common patterns
 */

// Random whitespace generator
export function randomWhitespace(min: number = 1, max: number = 3): string {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  return ' '.repeat(count);
}

// Random comment generator with variations
export function randomComment(): string {
  const comments = [
    '// legacy code',
    '// TODO: refactor later',
    '/* temp fix */',
    '// optimization',
    '/* check this */',
    '// old implementation',
    '/* needs review */',
    '// hack',
    '/* workaround */',
    '// deprecated',
  ];
  return comments[Math.floor(Math.random() * comments.length)];
}

// String obfuscation using character encoding
export function obfuscateString(str: string): string {
  return str.split('').map(char => {
    const code = char.charCodeAt(0);
    // Mix of different encoding methods
    if (Math.random() > 0.5) {
      return `\\x${code.toString(16).padStart(2, '0')}`;
    } else {
      return `\\u${code.toString(16).padStart(4, '0')}`;
    }
  }).join('');
}

// Variable name obfuscator
export function obfuscateVarName(baseName: string): string {
  const prefixes = ['_', '__', 'm_', 'p_', 'tmp_'];
  const suffixes = ['', '_', '__', '1', '2', 'val'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${prefix}${baseName}${suffix}`;
}

// Add random delays to break timing patterns
export function randomDelay(min: number = 10, max: number = 50): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

// Break up code with random whitespace and comments
export function addCodeIrregularities(code: string): string {
  const lines = code.split('\n');
  const modified: string[] = [];
  
  lines.forEach((line, index) => {
    // Randomly add comments
    if (Math.random() > 0.7 && line.trim() && !line.trim().startsWith('//')) {
      modified.push(line + randomWhitespace() + randomComment());
    } else {
      modified.push(line);
    }
    
    // Randomly add blank lines
    if (Math.random() > 0.8) {
      modified.push('');
    }
  });
  
  return modified.join('\n');
}

// Generate random function names
export function randomFunctionName(): string {
  const prefixes = ['handle', 'process', 'execute', 'run', 'init', 'setup', 'config'];
  const suffixes = ['Data', 'Item', 'Value', 'Obj', 'Info', 'Content'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${prefix}${suffix}${Math.floor(Math.random() * 1000)}`;
}

// Unicode character substitution for common letters
const homoglyphs: Record<string, string[]> = {
  'a': ['а', 'α', 'а'],
  'e': ['е', 'е', 'ε'],
  'o': ['о', 'ο', 'о'],
  'p': ['р', 'р'],
  'c': ['с', 'с'],
  'x': ['х', 'х'],
};

export function substituteHomoglyphs(text: string, probability: number = 0.1): string {
  return text.split('').map(char => {
    const lower = char.toLowerCase();
    if (homoglyphs[lower] && Math.random() < probability) {
      const replacement = homoglyphs[lower][Math.floor(Math.random() * homoglyphs[lower].length)];
      return char === lower ? replacement : replacement.toUpperCase();
    }
    return char;
  }).join('');
}


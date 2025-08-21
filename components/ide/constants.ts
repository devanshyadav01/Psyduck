export const LANGUAGE_TEMPLATES: Record<string, string> = {
  javascript: `// Welcome to the Psyduck IDE!
console.log('Hello, World!');

// Your code here...
`,
  python: `# Welcome to the Psyduck IDE!
print('Hello, World!')

# Your code here...
`,
  java: `// Welcome to the Psyduck IDE!
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        // Your code here...
    }
}`,
  cpp: `// Welcome to the Psyduck IDE!
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    // Your code here...
    return 0;
}`,
  typescript: `// Welcome to the Psyduck IDE!
function greet(name: string): string {
    return \`Hello, \${name}!\`;
}

console.log(greet('World'));

// Your code here...
`,
};

export const MONACO_LANGUAGE_MAP: Record<string, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  java: 'java',
  cpp: 'cpp',
  c: 'c',
  html: 'html',
  css: 'css',
  sql: 'sql',
  go: 'go',
  rust: 'rust',
};

export const FILE_EXTENSIONS: Record<string, string> = {
  javascript: 'js',
  typescript: 'ts',
  python: 'py',
  java: 'java',
  cpp: 'cpp',
  c: 'c',
  html: 'html',
  css: 'css',
  sql: 'sql',
  go: 'go',
  rust: 'rs',
};

// Enhanced Monaco Editor configuration with better defaults and worker fallbacks
export const MONACO_EDITOR_CONFIG = {
  theme: 'vs-dark',
  automaticLayout: true,
  // Disable features that might rely on web workers to prevent errors
  'typescript.preferences.includePackageJsonAutoImports': 'off',
  'javascript.preferences.includePackageJsonAutoImports': 'off',
  'editor.semanticHighlighting.enabled': false,
  'typescript.suggest.autoImports': false,
  'javascript.suggest.autoImports': false,
  minimap: { 
    enabled: true,
    maxColumn: 120,
    scale: 1,
    showSlider: 'always' as const
  },
  scrollBeyondLastLine: false,
  fontSize: 14,
  lineHeight: 20,
  fontFamily: "'JetBrains Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
  fontLigatures: true,
  lineNumbers: 'on' as const,
  roundedSelection: false,
  scrollBeyondLastColumn: 10,
  smoothScrolling: true,
  cursorStyle: 'line' as const,
  cursorBlinking: 'blink' as const,
  renderWhitespace: 'selection' as const,
  renderControlCharacters: true,
  folding: true,
  foldingHighlight: true,
  showFoldingControls: 'always' as const,
  wordWrap: 'on' as const,
  wordWrapColumn: 120,
  bracketPairColorization: { enabled: true },
  suggest: {
    showKeywords: true,
    showSnippets: true,
    showFunctions: true,
    showConstructors: true,
    showMethods: true,
    showProperties: true,
    showVariables: true,
    showClasses: true,
    showModules: true,
    showColors: true,
    showFiles: true,
    showReferences: true,
    showWords: true,
    showTypeParameters: true,
    showConstants: true,
    showEnums: true,
    showEnumMembers: true,
    showOperators: true,
    showFields: true,
    showValues: true,
    showEvents: true,
    showUnits: true,
    showFolders: true,
    showInterfaces: true,
    showStructs: true,
  },
  quickSuggestions: {
    other: true,
    comments: false,
    strings: true
  },
  parameterHints: {
    enabled: true,
    cycle: true
  },
  autoIndent: 'full' as const,
  formatOnType: true,
  formatOnPaste: true,
  dragAndDrop: true,
  links: true,
  contextmenu: true,
  mouseWheelZoom: true,
  multiCursorModifier: 'ctrlCmd' as const,
  accessibilitySupport: 'auto' as const,
  find: {
    autoFindInSelection: 'never' as const,
    seedSearchStringFromSelection: 'always' as const,
    addExtraSpaceOnTop: true
  },
  codeLens: true,
  colorDecorators: true,
  lightbulb: {
    enabled: true
  },
  matchBrackets: 'always' as const,
  renderLineHighlight: 'all' as const,
  scrollbar: {
    useShadows: true,
    verticalHasArrows: false,
    horizontalHasArrows: false,
    vertical: 'auto' as const,
    horizontal: 'auto' as const,
    verticalScrollbarSize: 10,
    horizontalScrollbarSize: 10,
    arrowSize: 11
  },
  overviewRulerBorder: false,
  overviewRulerLanes: 3,
  hideCursorInOverviewRuler: false,
  glyphMargin: true,
  lineDecorationsWidth: 10,
  lineNumbersMinChars: 3,
  guides: {
    bracketPairs: true,
    bracketPairsHorizontal: true,
    highlightActiveBracketPair: true,
    indentation: true,
    highlightActiveIndentation: true
  },
  stickyScroll: {
    enabled: true,
    maxLineCount: 5
  }
};

// Theme customization for Psyduck branding
export const PSYDUCK_THEME = {
  base: 'vs-dark' as const,
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'E67514' }, // Psyduck primary color
    { token: 'string', foreground: 'CE9178' },
    { token: 'number', foreground: 'B5CEA8' },
    { token: 'regexp', foreground: 'D16969' },
    { token: 'type', foreground: '4EC9B0' },
    { token: 'class', foreground: '4EC9B0' },
    { token: 'function', foreground: 'DCDCAA' },
    { token: 'variable', foreground: '9CDCFE' },
    { token: 'constant', foreground: '4FC1FF' },
    { token: 'property', foreground: '9CDCFE' },
    { token: 'attribute.name', foreground: '92C5F8' },
    { token: 'attribute.value', foreground: 'CE9178' },
  ],
  colors: {
    'editor.background': '#1E1E1E',
    'editor.foreground': '#D4D4D4',
    'editorLineNumber.foreground': '#858585',
    'editorLineNumber.activeForeground': '#E67514', // Psyduck primary
    'editor.selectionBackground': '#264F78',
    'editor.inactiveSelectionBackground': '#3A3D41',
    'editorCursor.foreground': '#E67514', // Psyduck primary
    'editor.findMatchBackground': '#515C6A',
    'editor.findMatchHighlightBackground': '#EA5C0055',
    'editor.linkedEditingBackground': '#f00000',
    'scrollbarSlider.background': '#E6751440',
    'scrollbarSlider.hoverBackground': '#E6751460',
    'scrollbarSlider.activeBackground': '#E67514',
    'minimap.selectionHighlight': '#E67514',
    'editorBracketMatch.background': '#0064001a',
    'editorBracketMatch.border': '#E67514',
  }
};
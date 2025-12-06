# Frontend Reader System

## Overview

The **Frontend Reader System** is a comprehensive solution for automatically reading, analyzing, and loading existing frontend projects into the DragNDrop visual editor. It enables seamless visual editing of established codebases without manual reconstruction.

## Features

### ✅ Implemented (Phase 1)

#### 1. Framework Detection
- **Automatic Detection**: Identifies React, Vue, Angular, Svelte, and plain HTML projects
- **Version Detection**: Extracts framework versions from package.json
- **Flavor Detection**: Recognizes CRA, Next.js, Nuxt, Vue CLI, Angular CLI, etc.
- **TypeScript Support**: Detects TypeScript usage
- **Confidence Scoring**: Provides confidence levels for framework detection

#### 2. HTML Parsing
- **Complete HTML Analysis**: Parses DOCTYPE, head, and body sections
- **Element Extraction**: Extracts all HTML elements with attributes and hierarchy
- **Metadata Extraction**: Captures title, charset, viewport, meta tags
- **Script Detection**: Identifies inline and external scripts
- **Style Detection**: Finds inline, internal, and external styles
- **Asset Discovery**: Locates images, videos, fonts, and other assets

#### 3. Project Analysis
- **Structure Analysis**: Identifies src, public, components, pages directories
- **Dependency Analysis**: Extracts and categorizes dependencies
- **Build Tool Detection**: Identifies Vite, Webpack, Parcel, Rollup, esbuild
- **Package Manager Detection**: Detects npm, yarn, pnpm
- **Entry Point Discovery**: Finds main HTML, JS, and CSS files
- **Statistics Calculation**: Provides comprehensive project statistics

#### 4. Component Tree Building
- **Hierarchy Construction**: Builds component tree with parent-child relationships
- **Dependency Mapping**: Maps component dependencies (scripts, styles, assets)
- **Relationship Analysis**: Identifies component relationships and usage
- **Statistics**: Calculates element counts, types, and distribution

#### 5. Style Extraction
- **CSS Parsing**: Extracts and parses CSS rules, variables, media queries
- **SCSS Support**: Detects SCSS variables, mixins, and nesting
- **Tailwind Detection**: Identifies Tailwind CSS usage and classes
- **CSS-in-JS Detection**: Recognizes styled-components, Emotion, MUI
- **Inline Styles**: Extracts inline style attributes
- **Style Statistics**: Provides comprehensive style metrics

#### 6. Asset Management
- **Asset Loading**: Loads images, videos, fonts, and other assets
- **Metadata Extraction**: Extracts dimensions, duration, format information
- **Object URL Creation**: Creates browser-accessible URLs for assets
- **Type Classification**: Categorizes assets by type
- **Statistics**: Provides asset counts and size information

#### 7. Sync Engine
- **Change Tracking**: Monitors canvas changes via MutationObserver
- **Debounced Processing**: Batches changes for efficient processing
- **State Export**: Exports current editor state
- **HTML Generation**: Generates updated HTML from editor state
- **File Download**: Downloads updated files

#### 8. User Interface
- **Import Modal**: Beautiful modal for project import
- **Progress Tracking**: Visual progress indicators during analysis
- **Results Display**: Shows analysis results with statistics
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Works on desktop and mobile devices

## Architecture

```
Frontend Reader System
├── Core Modules
│   ├── FrontendReader (index.js) - Main orchestrator
│   ├── FrameworkDetector - Framework identification
│   ├── ProjectAnalyzer - Project structure analysis
│   ├── ComponentTreeBuilder - Component hierarchy
│   ├── AssetManager - Asset handling
│   └── SyncEngine - Change synchronization
├── Parsers
│   └── HTMLParser - HTML parsing and extraction
├── Extractors
│   └── StyleExtractor - Style extraction and analysis
├── UI Components
│   ├── ProjectImportModal - Import interface
│   └── styles.css - UI styling
└── Integration
    └── integration.js - Editor integration
```

## Usage

### 1. Import a Directory

```javascript
// Via toolbar button
document.getElementById('loadDirectoryInput').click();

// Programmatically
const files = /* FileList from directory input */;
const project = await frontendReader.loadProject(files);
```

### 2. Import an HTML File

```javascript
// Via toolbar button
document.getElementById('importHTMLInput').click();

// Programmatically
const file = /* File from input */;
const project = await frontendReader.loadHTMLFile(file);
```

### 3. Show Import Modal

```javascript
// Via toolbar or programmatically
window.showProjectImportModal();
```

### 4. Access Loaded Project

```javascript
// Get current project
const project = frontendReader.getCurrentProject();

// Get project metadata
console.log(project.metadata);
console.log(project.framework);
console.log(project.components);
console.log(project.styles);
console.log(project.assets);
```

### 5. Export Updated Project

```javascript
// Download updated HTML
const syncEngine = frontendReader.syncEngine;
syncEngine.downloadUpdatedFile('updated.html');
```

## API Reference

### FrontendReader

#### Methods

- `loadProject(files)` - Load and analyze a project from files
- `loadHTMLFile(file)` - Load a single HTML file
- `getCurrentProject()` - Get current project data
- `stopSync()` - Stop sync engine
- `cleanup()` - Clean up resources

### FrameworkDetector

#### Methods

- `detect(files)` - Detect framework from files
- `detectVersion(framework, packageJson)` - Detect framework version
- `detectFlavor(framework, files, packageJson)` - Detect framework flavor

### ProjectAnalyzer

#### Methods

- `analyze(files, framework)` - Analyze project structure
- `getMetadata()` - Get project metadata

### HTMLParser

#### Methods

- `parse(content, filename)` - Parse HTML content
- `extractDoctype(content)` - Extract DOCTYPE
- `parseElement(element)` - Parse HTML element
- `extractStyles(doc)` - Extract styles
- `extractAssets(doc)` - Extract assets

### ComponentTreeBuilder

#### Methods

- `build(parsedComponents, framework)` - Build component tree
- `getTree()` - Get component tree
- `getComponent(id)` - Get component by ID
- `findComponentsByName(name)` - Find components by name

### StyleExtractor

#### Methods

- `extract(files, components)` - Extract styles
- `parseCSS(content, filename)` - Parse CSS content
- `parseSCSS(content, filename)` - Parse SCSS content
- `detectTailwind(components, files)` - Detect Tailwind CSS
- `detectCSSinJS(files)` - Detect CSS-in-JS

### AssetManager

#### Methods

- `load(assetFiles)` - Load assets
- `processAsset(file)` - Process single asset
- `getAssetsByType(type)` - Get assets by type
- `getAssetById(id)` - Get asset by ID
- `getStats()` - Get asset statistics
- `cleanup()` - Clean up object URLs

### SyncEngine

#### Methods

- `start()` - Start sync engine
- `stop()` - Stop sync engine
- `exportState()` - Export current state
- `generateHTML()` - Generate updated HTML
- `downloadUpdatedFile(filename)` - Download updated file
- `getStatus()` - Get sync status

## Project Data Structure

```typescript
interface Project {
  metadata: {
    name: string;
    version: string;
    description: string;
    framework: FrameworkInfo;
    structure: StructureInfo;
    dependencies: DependencyInfo;
    buildTool: string;
    packageManager: string;
    entryPoints: EntryPoints;
    stats: ProjectStats;
  };
  
  framework: {
    name: 'react' | 'vue' | 'angular' | 'svelte' | 'html';
    version: string;
    flavor: string;
    typescript: boolean;
    confidence: number;
  };
  
  components: Component[];
  componentTree: ComponentTree;
  styles: StyleData;
  assets: Asset[];
  files: OrganizedFiles;
}
```

## Configuration

### Options

```javascript
const frontendReader = new FrontendReader({
  autoSync: true,           // Enable automatic synchronization
  watchFiles: true,         // Watch files for changes
  preserveFormatting: true  // Preserve original formatting
});
```

## Limitations

### Current Phase (Phase 1)

1. **Framework Parsing**: Only HTML parsing is fully implemented
   - JSX/TSX parsing: Not yet implemented
   - Vue SFC parsing: Not yet implemented
   - Angular template parsing: Not yet implemented
   - Svelte parsing: Not yet implemented

2. **File Watching**: Browser environment limitations
   - No native file system watching
   - Changes tracked through editor events only
   - File System Access API not yet implemented

3. **Build Tool Integration**: Limited support
   - Cannot execute build processes
   - Cannot resolve webpack aliases
   - Cannot process SCSS/SASS compilation

4. **State Management**: Read-only detection
   - Redux/Vuex/Pinia detection only
   - Cannot modify state management code

## Future Enhancements (Phases 2-5)

### Phase 2: Framework Support
- [ ] JSX/TSX parser with Babel
- [ ] Vue SFC parser
- [ ] Angular template parser
- [ ] Svelte parser
- [ ] Component extraction for each framework

### Phase 3: Advanced Style Support
- [ ] SCSS/SASS compilation
- [ ] CSS Modules support
- [ ] CSS-in-JS parsing
- [ ] PostCSS processing

### Phase 4: Enhanced Sync
- [ ] File System Access API integration
- [ ] Real-time file watching
- [ ] Conflict resolution
- [ ] Backup/rollback system
- [ ] Git integration

### Phase 5: Advanced Features
- [ ] State management integration
- [ ] Routing support
- [ ] API call detection
- [ ] Environment variable handling
- [ ] Build configuration parsing

## Testing

### Manual Testing

1. **Test HTML Import**
   ```bash
   # Create test HTML file
   echo '<!DOCTYPE html><html><head><title>Test</title></head><body><h1>Hello</h1></body></html>' > test.html
   
   # Import via UI
   # Click "Archivo" → "Importar HTML" → Select test.html
   ```

2. **Test Directory Import**
   ```bash
   # Create test project
   mkdir test-project
   cd test-project
   echo '<!DOCTYPE html><html><body><h1>Test</h1></body></html>' > index.html
   echo 'body { margin: 0; }' > style.css
   
   # Import via UI
   # Click "Archivo" → "Analizar Directorio" → Select test-project folder
   ```

### Automated Testing

```javascript
// Unit tests (to be implemented)
describe('FrontendReader', () => {
  test('should load HTML file', async () => {
    const file = new File(['<html></html>'], 'test.html', { type: 'text/html' });
    const project = await frontendReader.loadHTMLFile(file);
    expect(project).toBeDefined();
    expect(project.framework.name).toBe('html');
  });
});
```

## Troubleshooting

### Issue: "Canvas not found"
**Solution**: Ensure the editor is fully loaded before importing

### Issue: "Failed to parse HTML"
**Solution**: Check HTML syntax, ensure valid HTML5

### Issue: "Assets not loading"
**Solution**: Check browser console for CORS errors

### Issue: "Styles not applied"
**Solution**: Check if styles are inline or external, verify CSS syntax

## Performance Considerations

1. **Large Projects**: Projects with 1000+ files may take longer to analyze
2. **Asset Loading**: Large assets (videos, high-res images) may slow down loading
3. **Memory Usage**: Keep an eye on browser memory with very large projects
4. **Debouncing**: Sync engine uses 500ms debounce to batch changes

## Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ⚠️ File System Access API: Chrome/Edge only

## Contributing

To contribute to the Frontend Reader system:

1. Follow the existing code structure
2. Add comprehensive JSDoc comments
3. Include error handling
4. Write tests for new features
5. Update documentation

## License

MIT License - Same as the main project

## Support

For issues and questions:
- GitHub Issues: https://github.com/SebastianVernis/DragNDrop/issues
- Label: `frontend-reader`

---

**Version**: 1.0.0 (Phase 1)  
**Last Updated**: December 2024  
**Status**: ✅ Production Ready (HTML support)

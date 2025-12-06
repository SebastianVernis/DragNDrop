---
name: Automatic Frontend Reader
about: Auto-detect and load existing frontend projects for visual editing
title: '[FEATURE] Automatic Frontend Reader - Load and parse existing projects'
labels: enhancement, automation, parser
assignees: ''
---

## 🎯 Objective

Implement an intelligent system that automatically reads, analyzes, and loads existing frontend projects into the visual editor, enabling seamless visual editing of established codebases.

## 📋 Description

Create a comprehensive frontend reader that can:
- Auto-detect project type and framework
- Parse component structure and relationships
- Extract styling information
- Load assets and dependencies
- Maintain project integrity during editing
- Sync changes bidirectionally

## 🎨 User Stories

### As a Developer
- I want to open my existing React/Vue/Angular project in the editor
- I want all my components to be automatically detected
- I want to see the current project structure in the editor
- I want to edit components visually without breaking the code
- I want my changes to be reflected in the original files

### As a Designer
- I want to load a developer's project and make visual tweaks
- I want to see the actual components, not just mockups
- I want changes to be code-ready

## 💡 Proposed Solution

### System Architecture

```
Frontend Reader System
├── Project Analyzer
│   ├── Framework Detector
│   ├── Dependency Scanner
│   └── Build Tool Identifier
├── File Parser
│   ├── HTML Parser
│   ├── JSX/TSX Parser
│   ├── Vue SFC Parser
│   ├── Angular Template Parser
│   └── Svelte Parser
├── Component Extractor
│   ├── Component Tree Builder
│   ├── Props Analyzer
│   ├── State Detector
│   └── Routing Mapper
├── Style Extractor
│   ├── CSS Parser
│   ├── SCSS/SASS Parser
│   ├── CSS-in-JS Parser
│   └── Tailwind Detector
├── Asset Manager
│   ├── Image Loader
│   ├── Font Loader
│   └── Icon Detector
└── Sync Engine
    ├── File Watcher
    ├── Change Applier
    └── Conflict Resolver
```

## 🔧 Technical Requirements

### 1. Framework Detection

#### React Detection
```javascript
// Detect React project
const detectReact = (projectPath) => {
  const checks = {
    packageJson: hasReactDependency(),
    jsxFiles: hasJSXFiles(),
    reactImports: hasReactImports(),
    configFiles: hasReactConfig() // vite.config, webpack.config
  };
  
  return {
    framework: 'react',
    version: getReactVersion(),
    flavor: detectFlavor(), // CRA, Next.js, Gatsby, Vite
    typescript: hasTypeScript()
  };
};
```

#### Vue Detection
```javascript
// Detect Vue project
const detectVue = (projectPath) => {
  return {
    framework: 'vue',
    version: getVueVersion(), // 2 or 3
    flavor: detectFlavor(), // CLI, Nuxt, Vite
    typescript: hasTypeScript(),
    composition: usesCompositionAPI()
  };
};
```

#### Angular Detection
```javascript
// Detect Angular project
const detectAngular = (projectPath) => {
  return {
    framework: 'angular',
    version: getAngularVersion(),
    typescript: true, // Always TS
    modules: detectModules(),
    standalone: usesStandalone() // Angular 14+
  };
};
```

### 2. File Parsing

#### JSX/TSX Parser
```javascript
class JSXParser {
  constructor(filePath, options) {
    this.filePath = filePath;
    this.ast = null;
    this.components = [];
  }
  
  async parse() {
    const code = await fs.readFile(this.filePath, 'utf-8');
    this.ast = babel.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript']
    });
    
    return this.extractComponents();
  }
  
  extractComponents() {
    // Traverse AST to find components
    babel.traverse(this.ast, {
      FunctionDeclaration: (path) => {
        if (this.isComponent(path)) {
          this.components.push(this.parseComponent(path));
        }
      },
      ArrowFunctionExpression: (path) => {
        if (this.isComponent(path)) {
          this.components.push(this.parseComponent(path));
        }
      }
    });
    
    return this.components;
  }
  
  parseComponent(path) {
    return {
      name: this.getComponentName(path),
      props: this.extractProps(path),
      state: this.extractState(path),
      hooks: this.extractHooks(path),
      jsx: this.extractJSX(path),
      imports: this.extractImports(),
      exports: this.extractExports(),
      styles: this.extractStyles(path)
    };
  }
}
```

#### Vue SFC Parser
```javascript
class VueSFCParser {
  async parse(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');
    const { descriptor } = vueCompiler.parse(content);
    
    return {
      name: this.extractComponentName(descriptor),
      template: this.parseTemplate(descriptor.template),
      script: this.parseScript(descriptor.script || descriptor.scriptSetup),
      styles: descriptor.styles.map(s => this.parseStyle(s)),
      props: this.extractProps(descriptor),
      data: this.extractData(descriptor),
      computed: this.extractComputed(descriptor),
      methods: this.extractMethods(descriptor)
    };
  }
}
```

### 3. Component Tree Builder

```javascript
class ComponentTreeBuilder {
  constructor(projectPath, framework) {
    this.projectPath = projectPath;
    this.framework = framework;
    this.tree = null;
    this.components = new Map();
  }
  
  async build() {
    // 1. Find all component files
    const files = await this.findComponentFiles();
    
    // 2. Parse each file
    for (const file of files) {
      const component = await this.parseFile(file);
      this.components.set(component.name, component);
    }
    
    // 3. Build relationships
    this.buildRelationships();
    
    // 4. Create tree structure
    this.tree = this.createTree();
    
    return this.tree;
  }
  
  buildRelationships() {
    for (const [name, component] of this.components) {
      // Find child components used in this component
      component.children = this.findChildren(component);
      
      // Find parent components that use this component
      component.parents = this.findParents(component);
    }
  }
  
  createTree() {
    // Start from root components (App, _app, etc.)
    const roots = this.findRootComponents();
    
    return {
      roots,
      components: Array.from(this.components.values()),
      relationships: this.buildRelationshipMap()
    };
  }
}
```

### 4. Style Extraction

```javascript
class StyleExtractor {
  async extract(component, projectPath) {
    const styles = {
      inline: [],
      scoped: [],
      global: [],
      cssModules: [],
      cssInJs: [],
      tailwind: []
    };
    
    // Extract inline styles
    styles.inline = this.extractInlineStyles(component);
    
    // Extract CSS imports
    const cssImports = this.extractCSSImports(component);
    for (const cssFile of cssImports) {
      const parsed = await this.parseCSS(cssFile);
      styles.scoped.push(parsed);
    }
    
    // Detect CSS-in-JS
    if (this.usesCSSinJS(component)) {
      styles.cssInJs = this.extractCSSinJS(component);
    }
    
    // Detect Tailwind
    if (this.usesTailwind(component)) {
      styles.tailwind = this.extractTailwindClasses(component);
    }
    
    // Extract CSS Modules
    if (this.usesCSSModules(component)) {
      styles.cssModules = await this.extractCSSModules(component);
    }
    
    return styles;
  }
  
  parseCSS(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    return postcss.parse(content);
  }
}
```

### 5. Asset Management

```javascript
class AssetManager {
  constructor(projectPath) {
    this.projectPath = projectPath;
    this.assets = {
      images: [],
      fonts: [],
      icons: [],
      videos: [],
      other: []
    };
  }
  
  async scan() {
    // Scan public/assets directories
    const assetDirs = ['public', 'assets', 'static'];
    
    for (const dir of assetDirs) {
      const dirPath = path.join(this.projectPath, dir);
      if (await fs.exists(dirPath)) {
        await this.scanDirectory(dirPath);
      }
    }
    
    return this.assets;
  }
  
  async loadIntoEditor(editorInstance) {
    // Copy assets to editor's asset manager
    for (const [type, files] of Object.entries(this.assets)) {
      for (const file of files) {
        await editorInstance.assets.add(file);
      }
    }
  }
}
```

### 6. Change Synchronization

```javascript
class SyncEngine {
  constructor(projectPath, editorInstance) {
    this.projectPath = projectPath;
    this.editor = editorInstance;
    this.watcher = null;
    this.changeQueue = [];
  }
  
  start() {
    // Watch project files for external changes
    this.watcher = chokidar.watch(this.projectPath, {
      ignored: /(node_modules|\.git|dist|build)/,
      persistent: true
    });
    
    this.watcher
      .on('change', (path) => this.handleExternalChange(path))
      .on('add', (path) => this.handleFileAdded(path))
      .on('unlink', (path) => this.handleFileDeleted(path));
    
    // Listen for editor changes
    this.editor.on('componentChanged', (component) => {
      this.applyChangeToFile(component);
    });
  }
  
  async applyChangeToFile(component) {
    const filePath = component.filePath;
    const originalCode = await fs.readFile(filePath, 'utf-8');
    
    // Parse original
    const ast = babel.parse(originalCode, { /* options */ });
    
    // Apply changes to AST
    const modifiedAST = this.applyChangesToAST(ast, component.changes);
    
    // Generate new code
    const { code } = babel.generate(modifiedAST);
    
    // Format with Prettier
    const formatted = await prettier.format(code, {
      parser: this.getParser(filePath)
    });
    
    // Write back to file
    await fs.writeFile(filePath, formatted);
    
    console.log(`✅ Synced changes to ${filePath}`);
  }
  
  async handleExternalChange(filePath) {
    // File changed outside editor
    // Reload into editor if currently open
    if (this.editor.isOpen(filePath)) {
      const shouldReload = await this.detectConflict(filePath);
      
      if (shouldReload) {
        await this.editor.reload(filePath);
      }
    }
  }
}
```

## 🎯 Features Checklist

### Framework Support
- [ ] React (CRA, Next.js, Gatsby, Vite)
- [ ] Vue 2 & 3 (CLI, Nuxt)
- [ ] Angular (v12+)
- [ ] Svelte (SvelteKit)
- [ ] Plain HTML/CSS/JS
- [ ] TypeScript support for all

### Parsing Capabilities
- [ ] Component structure
- [ ] Props/attributes
- [ ] State management (Redux, Vuex, Pinia, Context)
- [ ] Routing (React Router, Vue Router, etc.)
- [ ] API calls detection
- [ ] Environment variables
- [ ] Build configuration

### Style Handling
- [ ] CSS files
- [ ] SCSS/SASS
- [ ] CSS Modules
- [ ] CSS-in-JS (styled-components, emotion)
- [ ] Tailwind CSS
- [ ] PostCSS
- [ ] Style scoping

### Asset Management
- [ ] Images (png, jpg, svg, webp)
- [ ] Fonts (woff, woff2, ttf)
- [ ] Icons (icon fonts, SVG sprites)
- [ ] Videos
- [ ] Public assets
- [ ] Dynamic imports

### Change Tracking
- [ ] Real-time file watching
- [ ] Bidirectional sync
- [ ] Conflict detection
- [ ] Backup/rollback system
- [ ] Git integration
- [ ] Change preview before apply

## 📊 Data Structures

### Project Metadata
```typescript
interface ProjectMetadata {
  name: string;
  path: string;
  framework: {
    name: 'react' | 'vue' | 'angular' | 'svelte' | 'html';
    version: string;
    flavor?: string;
  };
  typescript: boolean;
  buildTool: 'vite' | 'webpack' | 'parcel' | 'rollup' | 'esbuild';
  packageManager: 'npm' | 'yarn' | 'pnpm';
  dependencies: Record<string, string>;
  structure: {
    srcDir: string;
    publicDir: string;
    componentsDir: string;
    assetsDir: string;
  };
}
```

### Component Representation
```typescript
interface ComponentData {
  id: string;
  name: string;
  filePath: string;
  type: 'functional' | 'class' | 'sfc';
  framework: string;
  
  structure: {
    template: string | JSX;
    script: string;
    styles: StyleData[];
  };
  
  metadata: {
    props: PropDefinition[];
    state: StateDefinition[];
    computed: ComputedDefinition[];
    methods: MethodDefinition[];
    lifecycle: LifecycleHook[];
    imports: ImportStatement[];
    exports: ExportStatement[];
  };
  
  relationships: {
    parent: string | null;
    children: string[];
    dependencies: string[];
  };
  
  styles: {
    inline: CSSProperties;
    scoped: string[];
    global: string[];
    cssModules: Record<string, string>;
    tailwind: string[];
  };
}
```

## 🧪 Testing Strategy

### Unit Tests
- [ ] Framework detection accuracy
- [ ] Parser for each framework
- [ ] Style extraction
- [ ] Component tree building

### Integration Tests
- [ ] Load real React project
- [ ] Load real Vue project
- [ ] Load real Angular project
- [ ] Sync changes back to files

### E2E Tests
- [ ] Full project load → edit → save workflow
- [ ] Multiple simultaneous edits
- [ ] Conflict resolution

### Test Projects
Create test projects for each framework:
- `test-react-app/` - CRA project
- `test-next-app/` - Next.js project
- `test-vue-app/` - Vue 3 project
- `test-angular-app/` - Angular project
- `test-svelte-app/` - SvelteKit project

## 🚧 Implementation Phases

### Phase 1: Core Parser (Weeks 1-2)
- [ ] HTML parser
- [ ] JSX parser (React)
- [ ] Basic component extraction
- [ ] File system integration

### Phase 2: Framework Support (Weeks 3-4)
- [ ] Vue SFC parser
- [ ] Angular template parser
- [ ] Svelte parser
- [ ] Framework auto-detection

### Phase 3: Style Extraction (Weeks 5-6)
- [ ] CSS parser
- [ ] SCSS/SASS support
- [ ] CSS-in-JS detection
- [ ] Tailwind extraction

### Phase 4: Sync Engine (Weeks 7-8)
- [ ] File watcher
- [ ] Change application
- [ ] Conflict resolution
- [ ] Backup system

### Phase 5: Advanced Features (Weeks 9-10)
- [ ] State management detection
- [ ] Routing support
- [ ] Asset management
- [ ] TypeScript support

## 🔗 Dependencies

```json
{
  "dependencies": {
    "@babel/parser": "^7.23.0",
    "@babel/traverse": "^7.23.0",
    "@babel/generator": "^7.23.0",
    "@vue/compiler-sfc": "^3.3.0",
    "@angular/compiler": "^17.0.0",
    "svelte": "^4.0.0",
    "postcss": "^8.4.0",
    "sass": "^1.69.0",
    "chokidar": "^3.5.0",
    "glob": "^10.3.0",
    "prettier": "^3.0.0",
    "typescript": "^5.0.0"
  }
}
```

## ⚠️ Challenges & Solutions

### Challenge 1: Complex Framework Syntax
**Solution**: Use official parsers (@vue/compiler-sfc, @babel/parser) instead of regex

### Challenge 2: State Management
**Solution**: Detect common patterns (Redux, Vuex) and provide read-only view initially

### Challenge 3: TypeScript
**Solution**: Use TypeScript compiler API to preserve type information

### Challenge 4: Build Tool Integration
**Solution**: Read build configs, respect aliases and paths

### Challenge 5: Large Projects
**Solution**: Lazy loading, virtual scrolling, selective parsing

## 📝 Documentation Needs

- [ ] Supported frameworks and versions
- [ ] File structure requirements
- [ ] Limitations and edge cases
- [ ] Troubleshooting guide
- [ ] API documentation for parsers

## 🎓 Learning Resources

- [Babel Plugin Handbook](https://github.com/jamiebuilds/babel-handbook)
- [Vue SFC Spec](https://vue-loader.vuejs.org/spec.html)
- [Angular Compiler](https://angular.io/guide/aot-compiler)
- [AST Explorer](https://astexplorer.net/)

## 💬 Discussion Points

- How to handle very large projects (1000+ components)?
- Should we support older framework versions?
- How to handle custom webpack configurations?
- Privacy concerns with code analysis?

## 🔖 Related Issues

- #XX - NPM Package Integration
- #XX - Visual Diff System
- #XX - Code Generation Engine

---

**Labels**: `enhancement`, `automation`, `parser`, `high-priority`  
**Milestone**: v4.0 - Project Integration  
**Estimated Effort**: 10 weeks  
**Priority**: Critical

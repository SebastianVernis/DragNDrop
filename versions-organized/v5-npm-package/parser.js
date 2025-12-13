/**
 * File Parser
 * Parses HTML, JSX, Vue, and other component files
 */

const fs = require('fs').promises;
const path = require('path');
const { parse: babelParse } = require('@babel/parser');
const { glob } = require('glob');

class FileParser {
  constructor(options = {}) {
    this.options = options;
  }
  
  /**
   * Get project structure
   */
  async getProjectStructure(cwd) {
    const structure = {
      root: cwd,
      files: [],
      components: [],
      framework: this.options.framework
    };
    
    // Find all matching files
    const patterns = this.options.include || ['**/*.html', '**/*.jsx', '**/*.vue'];
    const ignore = this.options.exclude || ['node_modules/**', 'dist/**'];
    
    for (const pattern of patterns) {
      const files = await glob(pattern, {
        cwd,
        ignore,
        absolute: true
      });
      
      for (const file of files) {
        const relativePath = path.relative(cwd, file);
        const stats = await fs.stat(file);
        
        structure.files.push({
          path: relativePath,
          absolutePath: file,
          name: path.basename(file),
          ext: path.extname(file),
          size: stats.size,
          modified: stats.mtime
        });
      }
    }
    
    // Parse components
    for (const file of structure.files) {
      try {
        const component = await this.parseFile(file.absolutePath);
        if (component) {
          structure.components.push({
            ...file,
            ...component
          });
        }
      } catch (error) {
        // Skip files that can't be parsed
        console.warn(`Failed to parse ${file.path}: ${error.message}`);
      }
    }
    
    return structure;
  }
  
  /**
   * Parse a single file
   */
  async parseFile(filePath) {
    const ext = path.extname(filePath);
    const content = await fs.readFile(filePath, 'utf-8');
    
    switch (ext) {
      case '.html':
        return this.parseHTML(content, filePath);
      case '.jsx':
      case '.tsx':
        return this.parseJSX(content, filePath);
      case '.vue':
        return this.parseVue(content, filePath);
      case '.js':
      case '.ts':
        return this.parseJS(content, filePath);
      default:
        return { content, type: 'unknown' };
    }
  }
  
  /**
   * Parse HTML file
   */
  parseHTML(content, filePath) {
    // Extract basic structure
    const structure = {
      type: 'html',
      content,
      elements: [],
      scripts: [],
      styles: []
    };
    
    // Extract script tags
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = scriptRegex.exec(content)) !== null) {
      structure.scripts.push({
        content: match[1],
        attributes: this.parseAttributes(match[0])
      });
    }
    
    // Extract style tags
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    while ((match = styleRegex.exec(content)) !== null) {
      structure.styles.push({
        content: match[1],
        attributes: this.parseAttributes(match[0])
      });
    }
    
    // Extract elements (simplified)
    const elementRegex = /<(\w+)([^>]*)>/g;
    while ((match = elementRegex.exec(content)) !== null) {
      structure.elements.push({
        tag: match[1],
        attributes: this.parseAttributes(match[2]),
        position: match.index
      });
    }
    
    return structure;
  }
  
  /**
   * Parse JSX/TSX file
   */
  parseJSX(content, filePath) {
    try {
      const ast = babelParse(content, {
        sourceType: 'module',
        plugins: [
          'jsx',
          'typescript',
          'classProperties',
          'decorators-legacy'
        ]
      });
      
      const structure = {
        type: 'jsx',
        content,
        ast,
        components: [],
        imports: [],
        exports: []
      };
      
      // Extract components, imports, exports from AST
      this.traverseAST(ast, structure);
      
      return structure;
    } catch (error) {
      console.warn(`Failed to parse JSX: ${error.message}`);
      return { type: 'jsx', content, error: error.message };
    }
  }
  
  /**
   * Parse Vue Single File Component
   */
  parseVue(content, filePath) {
    const structure = {
      type: 'vue',
      content,
      template: null,
      script: null,
      style: null
    };
    
    // Extract template
    const templateMatch = content.match(/<template[^>]*>([\s\S]*?)<\/template>/i);
    if (templateMatch) {
      structure.template = {
        content: templateMatch[1],
        attributes: this.parseAttributes(templateMatch[0])
      };
    }
    
    // Extract script
    const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
    if (scriptMatch) {
      structure.script = {
        content: scriptMatch[1],
        attributes: this.parseAttributes(scriptMatch[0])
      };
      
      // Try to parse script content
      try {
        structure.script.ast = babelParse(scriptMatch[1], {
          sourceType: 'module',
          plugins: ['typescript']
        });
      } catch (error) {
        // Ignore parse errors
      }
    }
    
    // Extract style
    const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    if (styleMatch) {
      structure.style = {
        content: styleMatch[1],
        attributes: this.parseAttributes(styleMatch[0])
      };
    }
    
    return structure;
  }
  
  /**
   * Parse JavaScript/TypeScript file
   */
  parseJS(content, filePath) {
    try {
      const ast = babelParse(content, {
        sourceType: 'module',
        plugins: ['typescript', 'classProperties', 'decorators-legacy']
      });
      
      return {
        type: 'js',
        content,
        ast
      };
    } catch (error) {
      return { type: 'js', content, error: error.message };
    }
  }
  
  /**
   * Parse HTML attributes
   */
  parseAttributes(attrString) {
    const attributes = {};
    const attrRegex = /(\w+)(?:=["']([^"']*)["'])?/g;
    let match;
    
    while ((match = attrRegex.exec(attrString)) !== null) {
      attributes[match[1]] = match[2] || true;
    }
    
    return attributes;
  }
  
  /**
   * Traverse AST and extract information
   */
  traverseAST(ast, structure) {
    const traverse = (node) => {
      if (!node || typeof node !== 'object') return;
      
      // Extract imports
      if (node.type === 'ImportDeclaration') {
        structure.imports.push({
          source: node.source.value,
          specifiers: node.specifiers.map(s => ({
            type: s.type,
            local: s.local?.name,
            imported: s.imported?.name
          }))
        });
      }
      
      // Extract exports
      if (node.type === 'ExportDefaultDeclaration' || node.type === 'ExportNamedDeclaration') {
        structure.exports.push({
          type: node.type,
          declaration: node.declaration?.type
        });
      }
      
      // Extract function components
      if (node.type === 'FunctionDeclaration' || node.type === 'ArrowFunctionExpression') {
        if (this.isReactComponent(node)) {
          structure.components.push({
            name: node.id?.name || 'Anonymous',
            type: 'function',
            params: node.params.map(p => p.name)
          });
        }
      }
      
      // Extract class components
      if (node.type === 'ClassDeclaration') {
        if (this.isReactComponent(node)) {
          structure.components.push({
            name: node.id?.name,
            type: 'class',
            superClass: node.superClass?.name
          });
        }
      }
      
      // Recursively traverse
      for (const key in node) {
        if (key !== 'loc' && key !== 'range') {
          const child = node[key];
          if (Array.isArray(child)) {
            child.forEach(traverse);
          } else if (child && typeof child === 'object') {
            traverse(child);
          }
        }
      }
    };
    
    traverse(ast);
  }
  
  /**
   * Check if node is a React component
   */
  isReactComponent(node) {
    // Simplified check - could be more sophisticated
    if (node.type === 'ClassDeclaration') {
      return node.superClass?.name === 'Component' || 
             node.superClass?.name === 'PureComponent';
    }
    
    if (node.type === 'FunctionDeclaration' || node.type === 'ArrowFunctionExpression') {
      // Check if function returns JSX
      return true; // Simplified - would need to check return statement
    }
    
    return false;
  }
  
  /**
   * Search files
   */
  async searchFiles(cwd, query, type = 'all') {
    const structure = await this.getProjectStructure(cwd);
    const results = [];
    
    const searchTerm = query.toLowerCase();
    
    for (const file of structure.files) {
      // Search by filename
      if (file.name.toLowerCase().includes(searchTerm)) {
        results.push({
          ...file,
          matchType: 'filename'
        });
        continue;
      }
      
      // Search by content
      try {
        const content = await fs.readFile(file.absolutePath, 'utf-8');
        if (content.toLowerCase().includes(searchTerm)) {
          // Find matching lines
          const lines = content.split('\n');
          const matches = [];
          
          lines.forEach((line, index) => {
            if (line.toLowerCase().includes(searchTerm)) {
              matches.push({
                line: index + 1,
                content: line.trim(),
                context: lines.slice(Math.max(0, index - 1), index + 2)
              });
            }
          });
          
          if (matches.length > 0) {
            results.push({
              ...file,
              matchType: 'content',
              matches: matches.slice(0, 5) // Limit to 5 matches per file
            });
          }
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }
    
    return results;
  }
}

module.exports = { FileParser };

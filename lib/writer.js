/**
 * File Writer
 * Writes changes back to source files with AST manipulation
 */

const fs = require('fs').promises;
const path = require('path');
const { parse: babelParse } = require('@babel/parser');
const generate = require('@babel/generator').default;
const prettier = require('prettier');

class FileWriter {
  constructor(options = {}) {
    this.options = options;
    this.backupEnabled = options.backup !== false;
  }
  
  /**
   * Write file with changes
   */
  async writeFile(filePath, content, changes = null) {
    try {
      // Create backup if enabled
      if (this.backupEnabled) {
        await this.createBackup(filePath);
      }
      
      let finalContent = content;
      
      // Apply changes if provided
      if (changes) {
        finalContent = await this.applyChanges(filePath, content, changes);
      }
      
      // Format with Prettier
      finalContent = await this.formatCode(filePath, finalContent);
      
      // Write to file
      await fs.writeFile(filePath, finalContent, 'utf-8');
      
      return { success: true, path: filePath };
    } catch (error) {
      throw new Error(`Failed to write file ${filePath}: ${error.message}`);
    }
  }
  
  /**
   * Create backup of file
   */
  async createBackup(filePath) {
    try {
      const backupPath = `${filePath}.backup`;
      const content = await fs.readFile(filePath, 'utf-8');
      await fs.writeFile(backupPath, content, 'utf-8');
    } catch (error) {
      // Ignore backup errors
      console.warn(`Failed to create backup: ${error.message}`);
    }
  }
  
  /**
   * Apply changes to content
   */
  async applyChanges(filePath, content, changes) {
    const ext = path.extname(filePath);
    
    switch (ext) {
      case '.html':
        return this.applyHTMLChanges(content, changes);
      case '.jsx':
      case '.tsx':
        return this.applyJSXChanges(content, changes);
      case '.vue':
        return this.applyVueChanges(content, changes);
      default:
        return content;
    }
  }
  
  /**
   * Apply changes to HTML
   */
  applyHTMLChanges(content, changes) {
    let result = content;
    
    // Sort changes by position (reverse order to maintain positions)
    const sortedChanges = [...changes].sort((a, b) => b.position - a.position);
    
    for (const change of sortedChanges) {
      switch (change.type) {
        case 'insert':
          result = this.insertHTML(result, change.position, change.content);
          break;
        case 'replace':
          result = this.replaceHTML(result, change.start, change.end, change.content);
          break;
        case 'delete':
          result = this.deleteHTML(result, change.start, change.end);
          break;
        case 'attribute':
          result = this.updateAttribute(result, change.selector, change.attribute, change.value);
          break;
      }
    }
    
    return result;
  }
  
  /**
   * Apply changes to JSX
   */
  applyJSXChanges(content, changes) {
    try {
      // Parse to AST
      const ast = babelParse(content, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript', 'classProperties', 'decorators-legacy']
      });
      
      // Apply changes to AST
      this.modifyAST(ast, changes);
      
      // Generate code from AST
      const output = generate(ast, {
        retainLines: true,
        comments: true
      });
      
      return output.code;
    } catch (error) {
      console.warn(`Failed to apply JSX changes via AST: ${error.message}`);
      // Fallback to string manipulation
      return this.applyHTMLChanges(content, changes);
    }
  }
  
  /**
   * Apply changes to Vue SFC
   */
  applyVueChanges(content, changes) {
    let result = content;
    
    for (const change of changes) {
      if (change.section === 'template') {
        // Apply changes to template section
        const templateMatch = result.match(/<template[^>]*>([\s\S]*?)<\/template>/i);
        if (templateMatch) {
          const templateContent = templateMatch[1];
          const modifiedTemplate = this.applyHTMLChanges(templateContent, [change]);
          result = result.replace(templateMatch[1], modifiedTemplate);
        }
      } else if (change.section === 'script') {
        // Apply changes to script section
        const scriptMatch = result.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
        if (scriptMatch) {
          const scriptContent = scriptMatch[1];
          const modifiedScript = this.applyJSXChanges(scriptContent, [change]);
          result = result.replace(scriptMatch[1], modifiedScript);
        }
      } else if (change.section === 'style') {
        // Apply changes to style section
        const styleMatch = result.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
        if (styleMatch) {
          const styleContent = styleMatch[1];
          const modifiedStyle = change.content || styleContent;
          result = result.replace(styleMatch[1], modifiedStyle);
        }
      }
    }
    
    return result;
  }
  
  /**
   * Insert HTML at position
   */
  insertHTML(content, position, html) {
    return content.slice(0, position) + html + content.slice(position);
  }
  
  /**
   * Replace HTML between positions
   */
  replaceHTML(content, start, end, html) {
    return content.slice(0, start) + html + content.slice(end);
  }
  
  /**
   * Delete HTML between positions
   */
  deleteHTML(content, start, end) {
    return content.slice(0, start) + content.slice(end);
  }
  
  /**
   * Update HTML attribute
   */
  updateAttribute(content, selector, attribute, value) {
    // Simplified attribute update
    // In production, would use proper HTML parser
    const regex = new RegExp(`(<${selector}[^>]*)(${attribute}=["'][^"']*["'])([^>]*>)`, 'i');
    
    if (regex.test(content)) {
      // Update existing attribute
      return content.replace(regex, `$1${attribute}="${value}"$3`);
    } else {
      // Add new attribute
      const tagRegex = new RegExp(`(<${selector})([^>]*>)`, 'i');
      return content.replace(tagRegex, `$1 ${attribute}="${value}"$2`);
    }
  }
  
  /**
   * Modify AST
   */
  modifyAST(ast, changes) {
    // Simplified AST modification
    // In production, would use @babel/traverse for proper AST manipulation
    for (const change of changes) {
      if (change.type === 'component') {
        // Modify component in AST
        this.modifyComponent(ast, change);
      } else if (change.type === 'import') {
        // Add/modify import
        this.modifyImport(ast, change);
      }
    }
  }
  
  /**
   * Modify component in AST
   */
  modifyComponent(ast, change) {
    // Placeholder for component modification
    // Would traverse AST and modify specific component
  }
  
  /**
   * Modify import in AST
   */
  modifyImport(ast, change) {
    // Placeholder for import modification
    // Would add/modify import declarations
  }
  
  /**
   * Format code with Prettier
   */
  async formatCode(filePath, content) {
    try {
      const ext = path.extname(filePath);
      let parser = 'html';
      
      switch (ext) {
        case '.js':
        case '.jsx':
          parser = 'babel';
          break;
        case '.ts':
        case '.tsx':
          parser = 'typescript';
          break;
        case '.vue':
          parser = 'vue';
          break;
        case '.css':
        case '.scss':
          parser = 'css';
          break;
      }
      
      // Try to load project's prettier config
      let prettierConfig = {};
      try {
        const configPath = path.join(this.options.cwd || process.cwd(), '.prettierrc');
        const configContent = await fs.readFile(configPath, 'utf-8');
        prettierConfig = JSON.parse(configContent);
      } catch (error) {
        // Use default config
        prettierConfig = {
          semi: true,
          singleQuote: true,
          tabWidth: 2,
          trailingComma: 'es5'
        };
      }
      
      return prettier.format(content, {
        ...prettierConfig,
        parser
      });
    } catch (error) {
      console.warn(`Failed to format code: ${error.message}`);
      return content;
    }
  }
  
  /**
   * Validate changes before writing
   */
  validateChanges(content, changes) {
    // Validate that changes don't corrupt the file
    for (const change of changes) {
      if (change.start !== undefined && change.end !== undefined) {
        if (change.start < 0 || change.end > content.length || change.start > change.end) {
          throw new Error(`Invalid change positions: ${change.start}-${change.end}`);
        }
      }
    }
    
    return true;
  }
  
  /**
   * Restore from backup
   */
  async restoreBackup(filePath) {
    try {
      const backupPath = `${filePath}.backup`;
      const content = await fs.readFile(backupPath, 'utf-8');
      await fs.writeFile(filePath, content, 'utf-8');
      await fs.unlink(backupPath);
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to restore backup: ${error.message}`);
    }
  }
}

module.exports = { FileWriter };

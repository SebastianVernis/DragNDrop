# Frontend Reader - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

The Frontend Reader allows you to import existing HTML projects into the visual editor for easy editing.

## 📋 Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- An HTML file or project directory to import

## 🎯 Quick Start

### Method 1: Import a Single HTML File

1. **Open the Editor**
   ```bash
   npm run dev
   # Open http://localhost:8080
   ```

2. **Click Import**
   - Click "📁 Archivo" in the toolbar
   - Select "📄 Importar HTML"
   - Choose your HTML file

3. **Edit Visually**
   - Your HTML is now loaded in the canvas
   - Click any element to select it
   - Double-click text to edit
   - Use the properties panel to modify styles

4. **Export**
   - Click "💾 Exportar HTML" to download
   - Your changes are preserved!

### Method 2: Import a Project Directory

1. **Open the Editor**
   ```bash
   npm run dev
   ```

2. **Analyze Directory**
   - Click "📁 Archivo" in the toolbar
   - Select "📁 Analizar Directorio"
   - Choose your project folder

3. **Review Analysis**
   - See detected framework
   - View file counts
   - Check statistics

4. **Load into Editor**
   - Click "Load into Editor"
   - Start editing visually!

## 📝 Example: Import Your First HTML File

### Step 1: Create a Test HTML File

Create `test.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Import</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f0f0f0;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            margin-top: 0;
        }
        p {
            color: #666;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to My Website</h1>
        <p>This is a test page that will be imported into the visual editor.</p>
        <button>Click Me</button>
    </div>
</body>
</html>
```

### Step 2: Import the File

1. Open the editor: `http://localhost:8080`
2. Click "📁 Archivo" → "📄 Importar HTML"
3. Select `test.html`
4. Wait for loading (should be instant)

### Step 3: Edit Visually

Now you can:
- Click the heading to select it
- Double-click to edit the text
- Click the button to select it
- Use the properties panel to change colors, sizes, etc.

### Step 4: Export

1. Click "💾 Exportar HTML"
2. Your modified HTML is downloaded
3. Open it in a browser to see your changes!

## 🎨 What Gets Imported?

### ✅ Fully Supported
- HTML structure
- Inline styles
- Internal `<style>` tags
- External stylesheet references
- Images, videos, fonts
- Meta tags and SEO data
- Scripts (preserved but not executed)

### ⚠️ Partially Supported
- External CSS files (detected but not loaded)
- JavaScript functionality (preserved but not interactive)
- Complex frameworks (detected but not fully parsed)

### ❌ Not Yet Supported
- JSX/React components (Phase 2)
- Vue Single File Components (Phase 2)
- Angular templates (Phase 2)
- Build tool execution

## 💡 Tips & Tricks

### Tip 1: Start Simple
Begin with a simple HTML file to understand the workflow before importing complex projects.

### Tip 2: Check the Console
Open browser DevTools (F12) to see detailed import logs and any warnings.

### Tip 3: Use the Properties Panel
After importing, select elements and use the properties panel to make precise adjustments.

### Tip 4: Save Your Work
Use "💾 Guardar Proyecto" to save your work as a JSON file that can be reloaded later.

### Tip 5: Export Often
Export your HTML frequently to avoid losing changes.

## 🔧 Troubleshooting

### Problem: "Canvas not found"
**Solution**: Refresh the page and try again. Ensure the editor is fully loaded.

### Problem: Styles not showing
**Solution**: Check if styles are inline or in `<style>` tags. External CSS files are detected but not automatically loaded.

### Problem: Images not displaying
**Solution**: Ensure image paths are correct. Relative paths may not work if the HTML is moved.

### Problem: Import button not working
**Solution**: Check browser console for errors. Ensure you're using a modern browser.

## 📚 Next Steps

### Learn More
- Read the [Full Documentation](./FRONTEND_READER.md)
- Check the [API Reference](./FRONTEND_READER.md#api-reference)
- Review [Examples](./FRONTEND_READER.md#usage)

### Advanced Usage
- Import multi-file projects
- Work with CSS frameworks (Tailwind, Bootstrap)
- Export with custom configurations
- Use the Sync Engine for live updates

### Contribute
- Report issues on GitHub
- Suggest improvements
- Contribute code

## 🎓 Video Tutorial (Coming Soon)

We're working on video tutorials to help you get started even faster!

## 📞 Support

Need help?
- 📖 Read the [Full Documentation](./FRONTEND_READER.md)
- 🐛 Report bugs on [GitHub Issues](https://github.com/SebastianVernis/DragNDrop/issues)
- 💬 Ask questions in [Discussions](https://github.com/SebastianVernis/DragNDrop/discussions)

## ✅ Checklist

Before you start:
- [ ] Editor is running (`npm run dev`)
- [ ] Browser is open to `http://localhost:8080`
- [ ] You have an HTML file ready to import
- [ ] Browser DevTools are open (F12) for debugging

After importing:
- [ ] HTML structure is visible in canvas
- [ ] Elements are selectable
- [ ] Text is editable (double-click)
- [ ] Properties panel shows element properties
- [ ] Export works correctly

## 🎉 Success!

You've successfully imported your first HTML file into the visual editor! Now you can edit it visually and export your changes.

Happy editing! 🚀

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Status**: ✅ Production Ready

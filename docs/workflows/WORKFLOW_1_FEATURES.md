# Workflow 1: UI/UX Core Features

## 🎨 Overview

Workflow 1 introduces professional-grade UI/UX features to the DragNDrop HTML Editor, including a complete layer management system, multi-selection with batch operations, smart guides, and an advanced inspector.

---

## 🗂️ Layers System

### What is it?
A hierarchical view of all elements on the canvas, similar to Photoshop or Figma layers.

### Features
- **Tree Structure**: See parent-child relationships
- **Visual Icons**: Each element type has a unique icon
- **Quick Actions**: Lock, hide, duplicate, delete from the panel
- **Drag & Drop**: Reorder layers by dragging
- **Search**: Find layers quickly
- **Expand/Collapse**: Manage complex hierarchies

### How to Use

#### View Layers
The Layers panel appears in the left sidebar below the components panel.

#### Select a Layer
Click on any layer to select it on the canvas.

#### Rename a Layer
Double-click the layer name to edit it.

#### Lock a Layer
Click the lock icon (🔓) to lock. Locked layers cannot be selected or edited.

#### Hide a Layer
Click the eye icon (👁️) to hide. Hidden layers are not visible on the canvas.

#### Reorder Layers
Drag a layer and drop it:
- **Above another layer**: Drop in the top third
- **Below another layer**: Drop in the bottom third
- **Inside another layer**: Drop in the middle third

#### Delete a Layer
Click the trash icon (🗑️) to delete. Locked layers cannot be deleted.

#### Duplicate a Layer
Click the copy icon (📋) to create a duplicate.

---

## 🎯 Multi-Selection

### What is it?
Select multiple elements at once to perform batch operations.

### Selection Modes

#### 1. Click Selection
Click an element to select it (clears previous selection).

#### 2. Ctrl+Click (Toggle)
Hold Ctrl (or Cmd on Mac) and click to add/remove elements from selection.

#### 3. Shift+Click (Range)
Click one element, then Shift+Click another to select all elements between them.

#### 4. Marquee Selection
Click and drag on the canvas background to draw a selection rectangle. All elements inside are selected.

#### 5. Select All
Press **Ctrl+A** to select all elements on the canvas.

#### 6. Clear Selection
Press **Escape** to clear the selection.

### Visual Feedback
- **Single selection**: Blue outline
- **Multi-selection**: Blue outline + checkmark
- **Selection count**: Displayed in toolbar and badge

---

## ⚡ Batch Operations

### What is it?
Perform operations on multiple selected elements at once.

### Alignment (8 modes)

#### Horizontal Alignment
- **Align Left** (⬅️): Align all elements to the leftmost edge
- **Align Center** (↔️): Align all elements to the horizontal center
- **Align Right** (➡️): Align all elements to the rightmost edge

#### Vertical Alignment
- **Align Top** (⬆️): Align all elements to the topmost edge
- **Align Middle** (↕️): Align all elements to the vertical center
- **Align Bottom** (⬇️): Align all elements to the bottommost edge

### Distribution (2 modes)

#### Distribute Horizontal (↔️📏)
Evenly space elements horizontally between the leftmost and rightmost elements.

#### Distribute Vertical (↕️📏)
Evenly space elements vertically between the topmost and bottommost elements.

### Grouping

#### Create Group (📦)
Combine selected elements into a group. Groups can be moved together and nested.

#### Ungroup (📂)
Break apart a group into individual elements.

### Other Operations

#### Duplicate (📋)
Create copies of all selected elements.

#### Delete (🗑️)
Remove all selected elements (with confirmation).

#### Lock/Unlock
Lock or unlock all selected elements.

#### Hide/Show
Hide or show all selected elements.

#### Bring to Front
Move selected elements to the top of the z-index.

#### Send to Back
Move selected elements to the bottom of the z-index.

---

## 📏 Smart Guides

### What is it?
Visual guides that appear when dragging elements to help with alignment.

### Features

#### Alignment Guides
- **Element Alignment**: Guides appear when edges or centers align with other elements
- **Canvas Alignment**: Guides appear when aligning with canvas edges
- **Snap Threshold**: 5px tolerance for snapping

#### Grid System
- **Toggle Grid**: Show/hide a visual grid on the canvas
- **Configurable Size**: Adjust grid spacing (5-50px)
- **Snap to Grid**: Elements snap to grid intersections

### How to Use

#### Enable/Disable Guides
Guides are enabled by default. They appear automatically when dragging elements.

#### Enable/Disable Snap
Snap is enabled by default. Elements will snap to guides within 5px.

#### Enable/Disable Grid
Grid is disabled by default. Toggle it to show a visual grid on the canvas.

#### Adjust Grid Size
Change the grid spacing in the settings (default: 10px).

---

## 🔍 Advanced Inspector

### What is it?
An enhanced properties panel that shows both inline and computed CSS styles.

### Features

#### Normal View
The standard properties panel with editable fields.

#### Computed Styles View
Click the **💻 Computed** button to switch to computed styles view.

### Computed Styles Tabs

#### 1. Important Properties
Shows the most commonly used CSS properties:
- Display, position, dimensions
- Margin, padding
- Typography
- Colors, borders
- Flexbox, grid

#### 2. All Properties
Shows every CSS property applied to the element:
- Searchable list
- Alphabetically sorted
- Includes inherited properties

#### 3. Box Model
Visual diagram showing:
- Content dimensions
- Padding (all sides)
- Border (all sides)
- Margin (all sides)

### Inline vs Computed
- **Inline styles**: Marked with a blue badge
- **Computed styles**: Final values after all CSS is applied

---

## ⌨️ Keyboard Shortcuts

### Selection
- **Ctrl+A**: Select all elements
- **Escape**: Clear selection
- **Delete**: Delete selected elements

### Layers
- **Ctrl+D**: Duplicate selected layers

### Navigation
- **Tab**: Navigate between UI elements

---

## 🎨 Visual Indicators

### Layers Panel
- **📦 Container**: div, section, article
- **📄 Section**: section, main, aside
- **📝 Heading**: h1, h2, h3, h4, h5, h6
- **📄 Text**: p, span
- **🔗 Link**: a
- **🔘 Button**: button
- **📝 Input**: input, textarea, select
- **🖼️ Image**: img
- **🎬 Video**: video
- **🌐 Iframe**: iframe
- **📋 List**: ul, ol, li
- **📊 Table**: table

### Selection States
- **Selected**: Blue outline
- **Multi-selected**: Blue outline + checkmark
- **Locked**: Gray overlay + lock icon
- **Hidden**: Faded appearance

### Group Indicators
- **Group**: Dashed border + 📦 icon
- **Nested Group**: Multiple dashed borders

---

## 🚀 Performance

### Optimizations
- **Debounced Updates**: Tree rebuilds are debounced to 100ms
- **Efficient Selection**: O(m) complexity where m is selected elements
- **Smart Rendering**: Only visible layers are rendered
- **Event Delegation**: Minimal event listeners

### Tested With
- ✅ 100+ elements on canvas
- ✅ 10+ levels of nesting
- ✅ 50+ selected elements
- ✅ Complex drag operations

---

## 🎯 Use Cases

### 1. Organizing Complex Layouts
Use layers to manage complex page structures with many nested elements.

### 2. Batch Editing
Select multiple elements and apply styles, alignment, or operations at once.

### 3. Precise Alignment
Use smart guides to align elements perfectly with each other or the canvas.

### 4. Debugging Styles
Use the computed styles view to understand which CSS is actually applied.

### 5. Creating Reusable Groups
Group related elements together for easier manipulation and organization.

---

## 💡 Tips & Tricks

### Layers
1. **Name your layers**: Double-click to rename for better organization
2. **Use lock liberally**: Lock background elements to prevent accidental selection
3. **Hide temporarily**: Hide elements you're not working on to reduce clutter
4. **Search is your friend**: Use search to find layers in complex documents

### Multi-Selection
1. **Marquee for speed**: Drag to select multiple elements quickly
2. **Ctrl+Click to refine**: Add or remove specific elements from selection
3. **Shift+Click for ranges**: Select consecutive elements in the layers panel

### Alignment
1. **Align first, distribute second**: Get elements in the right position, then space them evenly
2. **Use groups**: Group aligned elements to maintain their relationship
3. **Smart guides help**: Watch for guides when dragging for quick alignment

### Inspector
1. **Check computed styles**: When styles don't look right, check computed values
2. **Box model is visual**: Use the box model tab to understand spacing
3. **Search all properties**: Find specific CSS properties quickly

---

## 🐛 Troubleshooting

### Layers not showing
- Make sure elements have the `canvas-element` class
- Try clicking the refresh button in the layers toolbar

### Can't select element
- Check if the element is locked (lock icon in layers panel)
- Make sure you're not in a different selection mode

### Alignment not working
- Need at least 2 elements selected for alignment
- Need at least 3 elements selected for distribution

### Guides not appearing
- Make sure guides are enabled
- Guides only appear when dragging elements

### Computed styles not showing
- Click the **💻 Computed** button in the properties panel
- Make sure an element is selected

---

## 📚 API Reference

See `WORKFLOW_1_IMPLEMENTATION_SUMMARY.md` for complete API documentation.

---

## 🎉 What's Next?

### Workflow 2: AI & Smart Features
- AI-powered code generation
- Smart component suggestions
- Auto-layout algorithms
- Code optimization

### Workflow 3: Backend & Auth
- User authentication
- Cloud project storage
- Real-time collaboration
- Version control

### Workflow 4: Deployment
- Production optimization
- CDN deployment
- Performance monitoring
- Analytics

---

**Version:** 2.0.0  
**Last Updated:** December 2, 2025  
**Status:** ✅ Production Ready

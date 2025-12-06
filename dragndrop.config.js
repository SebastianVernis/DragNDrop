/**
 * DragNDrop Editor Configuration
 * Generated on 2025-12-06T06:23:00.548Z
 */

module.exports = {
  "source": [
    "src",
    "components"
  ],
  "include": [
    "**/*.html",
    "**/*.jsx",
    "**/*.vue",
    "**/*.tsx"
  ],
  "exclude": [
    "node_modules/**",
    "dist/**",
    "build/**"
  ],
  "port": 3001,
  "autoSave": true,
  "autoSaveDelay": 1000,
  "buildTool": "auto",
  "framework": "react",
  "parsers": {},
  "git": {
    "autoCommit": false,
    "commitMessage": "Visual edit: ${filename}"
  }
};

# Garden Layout Planner

A beginner-friendly React + Vite app for planning garden layouts on GitHub Pages.

The main workspace is not one giant grid. Instead, users add separate objects such as pots, planter boxes, raised beds, and custom containers. Each object has its own internal grid based on the real-world dimensions entered by the user.

## Features included in this first working version

- Add rectangular planters, raised beds, square pots, circular pots, and custom containers.
- Give each object real dimensions in centimetres.
- Choose internal grid scale: 1 cell = 1cm, 5cm, or 10cm.
- Move objects around the workspace using the Move tool.
- Create, edit, and delete custom plants.
- Select a plant and paint it into a garden object's grid.
- Erase painted cells.
- Circular pots visually disable cells outside the circular boundary.
- Plant spacing warnings between different plant types. Same-colour painted cells are treated as one planted zone.
- Planning mode allows spacing issues but reports warnings.
- Strict spacing mode blocks invalid placement.
- Automatic plant key / legend.
- Selected object summary with area, planted cells, empty area, and warnings.
- Autosave using localStorage.
- Export full garden plan as JSON.
- Import a previous JSON export.
- Clear saved browser data.

## Project structure

```text
src/
  App.jsx
  components/
    AddObjectPanel.jsx
    GardenObject.jsx
    ImportExportControls.jsx
    LegendPanel.jsx
    ObjectGrid.jsx
    PlantCreator.jsx
    PlantSelector.jsx
    SummaryPanel.jsx
    Workspace.jsx
  data/
    defaultPlants.js
  styles/
    App.css
  utils/
    gridUtils.js
    spacingUtils.js
    storageUtils.js
```

## Install and run locally

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite, usually:

```text
http://localhost:5173/
```

## Build the production version

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

### Option 1: use the included gh-pages script

1. Create a GitHub repository, for example:

```text
garden-layout-planner
```

2. Push this project to the repository.

3. In `vite.config.js`, set the base path to your repository name:

```js
export default defineConfig({
  plugins: [react()],
  base: '/garden-layout-planner/'
});
```

If you deploy to a custom domain or a user site such as `username.github.io`, you can usually leave the base as:

```js
base: './'
```

4. Install dependencies:

```bash
npm install
```

5. Deploy:

```bash
npm run deploy
```

6. In GitHub, go to:

```text
Settings → Pages
```

Set the source to the `gh-pages` branch if GitHub does not do this automatically.

### Option 2: deploy manually

```bash
npm run build
```

Upload the generated `dist` folder to your preferred static hosting provider.

## Notes for improving later

Good next features would be:

- Resize existing objects after creation.
- Better plant placement as circular plant markers instead of painted cells.
- Undo / redo stack.
- Object duplication.
- Snap-to-workspace movement.
- Printable garden plan.
- Export as PNG or PDF.
- More advanced companion planting rules.

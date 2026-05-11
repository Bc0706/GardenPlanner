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



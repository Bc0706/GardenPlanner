import { cellKey, getGridDimensions, isCellInsideObject } from '../utils/gridUtils';

export default function ObjectGrid({
  gardenObject,
  plants,
  selectedPlantId,
  activeTool,
  cellPixelSize,
  onCellAction
}) {
  const { columns, rows } = getGridDimensions(gardenObject);
  const cells = [];

  function handleCellPointer(event, row, column) {
    event.stopPropagation();

    if (event.buttons !== 1 && event.type !== 'pointerdown') {
      return;
    }

    if (activeTool !== 'paint' && activeTool !== 'erase') {
      return;
    }

    onCellAction(gardenObject.id, row, column);
  }

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const key = cellKey(row, column);
      const plantId = gardenObject.cells?.[key];
      const plant = plants.find((item) => item.id === plantId);
      const inside = isCellInsideObject(gardenObject, row, column);
      const label = plant?.name ? plant.name.slice(0, 2).toUpperCase() : '';

      cells.push(
        <button
          key={key}
          type="button"
          className={`grid-cell ${inside ? '' : 'disabled'} ${plant ? 'planted' : ''}`}
          style={{
            width: cellPixelSize,
            height: cellPixelSize,
            backgroundColor: inside && plant ? plant.colour : undefined
          }}
          disabled={!inside}
          title={inside ? plant?.name || 'Empty cell' : 'Outside circular pot'}
          onPointerDown={(event) => handleCellPointer(event, row, column)}
          onPointerEnter={(event) => handleCellPointer(event, row, column)}
        >
          {cellPixelSize >= 16 ? label : ''}
        </button>
      );
    }
  }

  return (
    <div
      className="object-grid"
      style={{
        gridTemplateColumns: `repeat(${columns}, ${cellPixelSize}px)`
      }}
    >
      {cells}
    </div>
  );
}

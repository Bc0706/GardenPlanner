import ObjectGrid from './ObjectGrid.jsx';
import { getGridDimensions, getObjectSize } from '../utils/gridUtils';

export default function GardenObject({
  gardenObject,
  plants,
  selectedPlantId,
  selectedObjectId,
  activeTool,
  cellPixelSize,
  onSelectObject,
  onMoveObject,
  onCellAction,
  onDeleteObject
}) {
  const { columns, rows } = getGridDimensions(gardenObject);
  const { widthCm, heightCm } = getObjectSize(gardenObject);
  const isSelected = selectedObjectId === gardenObject.id;
  const isCircular = gardenObject.type === 'circular';

  function startMoving(event) {
    event.preventDefault();
    event.stopPropagation();

    if (activeTool !== 'move') {
      onSelectObject(gardenObject.id);
      return;
    }

    const startX = event.clientX;
    const startY = event.clientY;
    const originalX = gardenObject.position?.x || 0;
    const originalY = gardenObject.position?.y || 0;

    function handlePointerMove(moveEvent) {
      onMoveObject(gardenObject.id, {
        x: Math.max(0, originalX + moveEvent.clientX - startX),
        y: Math.max(0, originalY + moveEvent.clientY - startY)
      });
    }

    function stopMoving() {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopMoving);
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', stopMoving);
  }

  return (
    <article
      className={`garden-object ${isSelected ? 'selected' : ''} ${isCircular ? 'circular-object' : ''}`}
      style={{
        left: gardenObject.position?.x || 0,
        top: gardenObject.position?.y || 0
      }}
      onPointerDown={(event) => {
        event.stopPropagation();
        onSelectObject(gardenObject.id);
      }}
    >
      <header className="garden-object-header" onPointerDown={startMoving}>
        <div>
          <strong>{gardenObject.name}</strong>
          <small>
            {widthCm}cm × {heightCm}cm · {gardenObject.cellSizeCm}cm grid
          </small>
        </div>
        <button
          type="button"
          className="icon-button"
          title="Delete object"
          onClick={(event) => {
            event.stopPropagation();
            onDeleteObject(gardenObject.id);
          }}
        >
          ×
        </button>
      </header>

      <div
        className="garden-object-body"
        style={{
          width: columns * cellPixelSize,
          minHeight: rows * cellPixelSize
        }}
      >
        <ObjectGrid
          gardenObject={gardenObject}
          plants={plants}
          selectedPlantId={selectedPlantId}
          activeTool={activeTool}
          cellPixelSize={cellPixelSize}
          onCellAction={onCellAction}
        />
      </div>
    </article>
  );
}

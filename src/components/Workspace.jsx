import GardenObject from './GardenObject.jsx';

export default function Workspace({
  gardenObjects,
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
  return (
    <main className="workspace" onPointerDown={() => onSelectObject(null)}>
      {gardenObjects.length === 0 && (
        <div className="empty-workspace">
          <h2>No garden objects yet</h2>
          <p>Add a pot, planter box, raised bed, or custom container from the left sidebar.</p>
        </div>
      )}

      {gardenObjects.map((gardenObject) => (
        <GardenObject
          key={gardenObject.id}
          gardenObject={gardenObject}
          plants={plants}
          selectedPlantId={selectedPlantId}
          selectedObjectId={selectedObjectId}
          activeTool={activeTool}
          cellPixelSize={cellPixelSize}
          onSelectObject={onSelectObject}
          onMoveObject={onMoveObject}
          onCellAction={onCellAction}
          onDeleteObject={onDeleteObject}
        />
      ))}
    </main>
  );
}

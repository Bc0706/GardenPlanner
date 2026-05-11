import {
  getCellAreaCm2,
  getObjectAreaCm2,
  getObjectSize,
  getPlantedCellCounts
} from '../utils/gridUtils';

export default function SummaryPanel({ gardenObjects, plants, selectedObjectId, warnings }) {
  const selectedObject = gardenObjects.find((item) => item.id === selectedObjectId);

  if (!selectedObject) {
    const totalObjects = gardenObjects.length;
    const totalWarnings = warnings.length;

    return (
      <section className="panel-section">
        <h2>Layout summary</h2>
        <p><strong>{totalObjects}</strong> garden objects</p>
        <p><strong>{totalWarnings}</strong> spacing warnings</p>
        <p className="muted">Select a garden object to see detailed area and plant usage.</p>
      </section>
    );
  }

  const { widthCm, heightCm } = getObjectSize(selectedObject);
  const areaCm2 = getObjectAreaCm2(selectedObject);
  const cellAreaCm2 = getCellAreaCm2(selectedObject);
  const plantCounts = getPlantedCellCounts(selectedObject);
  const plantedCells = Object.values(plantCounts).reduce((sum, count) => sum + count, 0);
  const usedArea = plantedCells * cellAreaCm2;
  const emptyArea = Math.max(0, areaCm2 - usedArea);
  const objectWarnings = warnings.filter((warning) => warning.objectId === selectedObject.id);

  return (
    <section className="panel-section">
      <h2>Selected object</h2>
      <div className="summary-card">
        <strong>{selectedObject.name}</strong>
        <small>Type: {selectedObject.type}</small>
        <small>Dimensions: {widthCm}cm × {heightCm}cm</small>
        <small>Total area: {Math.round(areaCm2)}cm²</small>
        <small>Used area: {Math.round(usedArea)}cm²</small>
        <small>Empty area: {Math.round(emptyArea)}cm²</small>
        {selectedObject.notes && <p>{selectedObject.notes}</p>}
      </div>

      <h3>Plants inside</h3>
      {Object.keys(plantCounts).length === 0 ? (
        <p className="muted">No plants placed in this object yet.</p>
      ) : (
        <div className="compact-list">
          {Object.entries(plantCounts).map(([plantId, count]) => {
            const plant = plants.find((item) => item.id === plantId);
            return (
              <div key={plantId} className="compact-list-row">
                <span className="colour-dot" style={{ backgroundColor: plant?.colour }} />
                <span>{plant?.name || 'Unknown plant'}</span>
                <strong>{count} cells</strong>
              </div>
            );
          })}
        </div>
      )}

      <h3>Spacing warnings</h3>
      {objectWarnings.length === 0 ? (
        <p className="muted">No spacing issues detected for this object.</p>
      ) : (
        <ul className="warning-list">
          {objectWarnings.slice(0, 8).map((warning, index) => (
            <li key={`${warning.firstCell}-${warning.secondCell}-${index}`}>
              {warning.firstPlantName} and {warning.secondPlantName} are {warning.distanceCm}cm apart. Required: {warning.requiredSpacingCm}cm.
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

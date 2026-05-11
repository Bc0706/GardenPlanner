import { getPlantedCellCounts } from '../utils/gridUtils';

export default function LegendPanel({ plants, gardenObjects }) {
  const legendItems = plants
    .map((plant) => {
      const usedIn = [];
      let totalCells = 0;

      gardenObjects.forEach((gardenObject) => {
        const counts = getPlantedCellCounts(gardenObject);
        if (counts[plant.id]) {
          usedIn.push(gardenObject.name);
          totalCells += counts[plant.id];
        }
      });

      return { ...plant, usedIn, totalCells };
    })
    .filter((plant) => plant.totalCells > 0);

  return (
    <section className="panel-section">
      <h2>Plant key</h2>
      {legendItems.length === 0 ? (
        <p className="muted">Paint plants into an object to build the legend.</p>
      ) : (
        <div className="legend-list">
          {legendItems.map((plant) => (
            <div key={plant.id} className="legend-item">
              <span className="legend-colour" style={{ backgroundColor: plant.colour }} />
              <div>
                <strong>{plant.name}</strong>
                <small>{plant.spacingCm}cm spacing · {plant.totalCells} cells used</small>
                <small>In: {plant.usedIn.join(', ')}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function PlantSelector({ plants, selectedPlantId, onSelectPlant, activeTool, onToolChange }) {
  return (
    <section className="panel-section">
      <h2>Plant & tools</h2>

      <div className="tool-grid">
        <button
          className={activeTool === 'paint' ? 'active' : ''}
          onClick={() => onToolChange('paint')}
          type="button"
        >
          Paint
        </button>
        <button
          className={activeTool === 'erase' ? 'active' : ''}
          onClick={() => onToolChange('erase')}
          type="button"
        >
          Erase
        </button>
        <button
          className={activeTool === 'move' ? 'active' : ''}
          onClick={() => onToolChange('move')}
          type="button"
        >
          Move
        </button>
      </div>

      <div className="plant-list">
        {plants.map((plant) => (
          <button
            key={plant.id}
            type="button"
            className={`plant-choice ${selectedPlantId === plant.id ? 'selected' : ''}`}
            onClick={() => {
              onSelectPlant(plant.id);
              onToolChange('paint');
            }}
          >
            <span className="colour-dot" style={{ backgroundColor: plant.colour }} />
            <span>
              <strong>{plant.name}</strong>
              <small>{plant.spacingCm}cm spacing</small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

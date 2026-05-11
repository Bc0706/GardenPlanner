import { useEffect, useMemo, useState } from 'react';
import Workspace from './components/Workspace.jsx';
import AddObjectPanel from './components/AddObjectPanel.jsx';
import PlantCreator from './components/PlantCreator.jsx';
import PlantSelector from './components/PlantSelector.jsx';
import LegendPanel from './components/LegendPanel.jsx';
import SummaryPanel from './components/SummaryPanel.jsx';
import ImportExportControls from './components/ImportExportControls.jsx';
import { defaultPlants } from './data/defaultPlants.js';
import { cellKey, createId } from './utils/gridUtils.js';
import { findSpacingIssues, getAllSpacingWarnings } from './utils/spacingUtils.js';
import { clearGardenPlan, loadGardenPlan, saveGardenPlan } from './utils/storageUtils.js';

function createStarterObject() {
  return {
    id: createId('object'),
    name: 'Front planter box',
    type: 'rectangular',
    widthCm: 100,
    heightCm: 30,
    cellSizeCm: 5,
    notes: 'Starter example. Delete or edit as needed.',
    position: { x: 40, y: 40 },
    cells: {}
  };
}

function createEmptyPlan() {
  return {
    version: 1,
    gardenObjects: [createStarterObject()],
    plants: defaultPlants,
    settings: {
      strictSpacingMode: false,
      cellPixelSize: 14
    }
  };
}

export default function App() {
  const [gardenObjects, setGardenObjects] = useState([]);
  const [plants, setPlants] = useState(defaultPlants);
  const [selectedPlantId, setSelectedPlantId] = useState(defaultPlants[0].id);
  const [selectedObjectId, setSelectedObjectId] = useState(null);
  const [activeTool, setActiveTool] = useState('paint');
  const [strictSpacingMode, setStrictSpacingMode] = useState(false);
  const [cellPixelSize, setCellPixelSize] = useState(14);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const savedPlan = loadGardenPlan();
    const startingPlan = savedPlan || createEmptyPlan();

    setGardenObjects(startingPlan.gardenObjects || []);
    setPlants(startingPlan.plants || defaultPlants);
    setStrictSpacingMode(Boolean(startingPlan.settings?.strictSpacingMode));
    setCellPixelSize(Number(startingPlan.settings?.cellPixelSize || 14));
    setSelectedPlantId((startingPlan.plants || defaultPlants)[0]?.id || '');
  }, []);

  const gardenPlan = useMemo(
    () => ({
      version: 1,
      gardenObjects,
      plants,
      settings: {
        strictSpacingMode,
        cellPixelSize
      }
    }),
    [gardenObjects, plants, strictSpacingMode, cellPixelSize]
  );

  useEffect(() => {
    if (gardenObjects.length === 0 && plants.length === 0) {
      return;
    }

    saveGardenPlan(gardenPlan);
  }, [gardenPlan, gardenObjects.length, plants.length]);

  const spacingWarnings = useMemo(
    () => getAllSpacingWarnings(gardenObjects, plants),
    [gardenObjects, plants]
  );

  function addGardenObject(form) {
    const nextOffset = gardenObjects.length * 30;
    const isCircular = form.type === 'circular';
    const newObject = {
      id: createId('object'),
      name: form.name,
      type: form.type,
      widthCm: isCircular ? Number(form.diameterCm) : Number(form.widthCm),
      heightCm: isCircular ? Number(form.diameterCm) : Number(form.heightCm),
      diameterCm: isCircular ? Number(form.diameterCm) : undefined,
      cellSizeCm: Number(form.cellSizeCm),
      notes: form.notes,
      position: { x: 60 + nextOffset, y: 60 + nextOffset },
      cells: {}
    };

    setGardenObjects((currentObjects) => [...currentObjects, newObject]);
    setSelectedObjectId(newObject.id);
    setStatusMessage(`Added ${newObject.name}.`);
  }

  function savePlant(form) {
    const cleanedPlant = {
      ...form,
      id: form.id || createId('plant'),
      name: form.name.trim() || 'Unnamed plant',
      spacingCm: Number(form.spacingCm || 0)
    };

    setPlants((currentPlants) => {
      const plantExists = currentPlants.some((plant) => plant.id === cleanedPlant.id);
      if (plantExists) {
        return currentPlants.map((plant) => (plant.id === cleanedPlant.id ? cleanedPlant : plant));
      }

      return [...currentPlants, cleanedPlant];
    });

    setSelectedPlantId(cleanedPlant.id);
    setStatusMessage(`Saved ${cleanedPlant.name}.`);
  }

  function deletePlant(plantId) {
    const plant = plants.find((item) => item.id === plantId);
    const confirmed = window.confirm(
      `Delete ${plant?.name || 'this plant'}? Existing cells using this plant will be cleared.`
    );

    if (!confirmed) return;

    setPlants((currentPlants) => currentPlants.filter((item) => item.id !== plantId));
    setGardenObjects((currentObjects) =>
      currentObjects.map((gardenObject) => {
        const updatedCells = { ...(gardenObject.cells || {}) };

        Object.entries(updatedCells).forEach(([key, value]) => {
          if (value === plantId) {
            delete updatedCells[key];
          }
        });

        return { ...gardenObject, cells: updatedCells };
      })
    );

    setSelectedPlantId((currentPlantId) => {
      if (currentPlantId !== plantId) return currentPlantId;
      return plants.find((item) => item.id !== plantId)?.id || '';
    });

    setStatusMessage('Plant deleted.');
  }

  function moveObject(objectId, position) {
    setGardenObjects((currentObjects) =>
      currentObjects.map((gardenObject) =>
        gardenObject.id === objectId ? { ...gardenObject, position } : gardenObject
      )
    );
  }

  function deleteObject(objectId) {
    const gardenObject = gardenObjects.find((item) => item.id === objectId);
    const confirmed = window.confirm(`Delete ${gardenObject?.name || 'this object'}?`);

    if (!confirmed) return;

    setGardenObjects((currentObjects) => currentObjects.filter((item) => item.id !== objectId));
    setSelectedObjectId((currentId) => (currentId === objectId ? null : currentId));
  }

  function handleCellAction(objectId, row, column) {
    setSelectedObjectId(objectId);

    setGardenObjects((currentObjects) =>
      currentObjects.map((gardenObject) => {
        if (gardenObject.id !== objectId) {
          return gardenObject;
        }

        const key = cellKey(row, column);
        const updatedCells = { ...(gardenObject.cells || {}) };

        if (activeTool === 'erase') {
          delete updatedCells[key];
          return { ...gardenObject, cells: updatedCells };
        }

        if (!selectedPlantId) {
          setStatusMessage('Select or create a plant before painting.');
          return gardenObject;
        }

        const issues = findSpacingIssues({
          gardenObject,
          plants,
          row,
          column,
          plantId: selectedPlantId
        });

        if (issues.length > 0 && strictSpacingMode) {
          setStatusMessage(
            `Strict mode blocked placement: ${issues[0].plantName} needs ${issues[0].requiredSpacingCm}cm spacing.`
          );
          return gardenObject;
        }

        updatedCells[key] = selectedPlantId;

        if (issues.length > 0) {
          setStatusMessage(
            `Warning: ${issues[0].plantName} is ${issues[0].distanceCm}cm from ${issues[0].nearbyPlantName}.`
          );
        }

        return { ...gardenObject, cells: updatedCells };
      })
    );
  }

  function importPlan(importedPlan) {
    if (!Array.isArray(importedPlan.gardenObjects) || !Array.isArray(importedPlan.plants)) {
      alert('This file does not look like a valid garden plan export.');
      return;
    }

    setGardenObjects(importedPlan.gardenObjects);
    setPlants(importedPlan.plants);
    setStrictSpacingMode(Boolean(importedPlan.settings?.strictSpacingMode));
    setCellPixelSize(Number(importedPlan.settings?.cellPixelSize || 14));
    setSelectedPlantId(importedPlan.plants[0]?.id || '');
    setSelectedObjectId(null);
    setStatusMessage('Garden plan imported.');
  }

  function startNewPlan() {
    const confirmed = window.confirm('Start a new garden plan? This will replace the current workspace.');
    if (!confirmed) return;

    const newPlan = createEmptyPlan();
    setGardenObjects(newPlan.gardenObjects);
    setPlants(newPlan.plants);
    setStrictSpacingMode(newPlan.settings.strictSpacingMode);
    setCellPixelSize(newPlan.settings.cellPixelSize);
    setSelectedPlantId(newPlan.plants[0]?.id || '');
    setSelectedObjectId(null);
    setStatusMessage('New garden plan created.');
  }

  function clearSavedGarden() {
    const confirmed = window.confirm('Clear the autosaved garden from this browser? The current screen will stay open.');
    if (!confirmed) return;

    clearGardenPlan();
    setStatusMessage('Saved garden cleared from localStorage.');
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Garden Layout Planner</h1>
          <p>Build separate pots, planter boxes, and beds, then paint plants into each object grid.</p>
        </div>

        <ImportExportControls
          gardenPlan={gardenPlan}
          onImportPlan={importPlan}
          onNewPlan={startNewPlan}
          onClearSavedGarden={clearSavedGarden}
        />
      </header>

      <div className="toolbar">
        <label className="inline-control">
          Display zoom
          <select value={cellPixelSize} onChange={(event) => setCellPixelSize(Number(event.target.value))}>
            <option value={8}>Small cells</option>
            <option value={14}>Medium cells</option>
            <option value={20}>Large cells</option>
          </select>
        </label>

        <label className="toggle-control">
          <input
            type="checkbox"
            checked={strictSpacingMode}
            onChange={(event) => setStrictSpacingMode(event.target.checked)}
          />
          Strict spacing mode
        </label>

        <span className="status-message">{statusMessage || 'Autosave is on.'}</span>
      </div>

      <div className="layout-grid">
        <aside className="sidebar left-sidebar">
          <AddObjectPanel onAddObject={addGardenObject} />
          <PlantCreator plants={plants} onSavePlant={savePlant} onDeletePlant={deletePlant} />
          <PlantSelector
            plants={plants}
            selectedPlantId={selectedPlantId}
            onSelectPlant={setSelectedPlantId}
            activeTool={activeTool}
            onToolChange={setActiveTool}
          />
        </aside>

        <Workspace
          gardenObjects={gardenObjects}
          plants={plants}
          selectedPlantId={selectedPlantId}
          selectedObjectId={selectedObjectId}
          activeTool={activeTool}
          cellPixelSize={cellPixelSize}
          onSelectObject={setSelectedObjectId}
          onMoveObject={moveObject}
          onCellAction={handleCellAction}
          onDeleteObject={deleteObject}
        />

        <aside className="sidebar right-sidebar">
          <LegendPanel plants={plants} gardenObjects={gardenObjects} />
          <SummaryPanel
            gardenObjects={gardenObjects}
            plants={plants}
            selectedObjectId={selectedObjectId}
            warnings={spacingWarnings}
          />
        </aside>
      </div>
    </div>
  );
}

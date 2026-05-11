import { downloadJson, readJsonFile } from '../utils/storageUtils';

export default function ImportExportControls({ gardenPlan, onImportPlan, onNewPlan, onClearSavedGarden }) {
  async function handleImport(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedPlan = await readJsonFile(file);
      onImportPlan(importedPlan);
    } catch (error) {
      alert('Could not import this JSON file. Please check that it is a valid garden plan export.');
      console.error(error);
    } finally {
      event.target.value = '';
    }
  }

  function handleExport() {
    const exportData = {
      ...gardenPlan,
      dateExported: new Date().toISOString()
    };

    downloadJson(exportData, 'garden-plan.json');
  }

  return (
    <div className="import-export-controls">
      <button type="button" onClick={onNewPlan}>New garden</button>
      <button type="button" onClick={handleExport}>Export JSON</button>
      <label className="import-button">
        Import JSON
        <input type="file" accept="application/json" onChange={handleImport} />
      </label>
      <button type="button" className="danger" onClick={onClearSavedGarden}>
        Clear saved garden
      </button>
    </div>
  );
}

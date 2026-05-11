import { cellKey, parseCellKey } from './gridUtils';

export function findSpacingIssues({ gardenObject, plants, row, column, plantId }) {
  const issues = [];
  const selectedPlant = plants.find((plant) => plant.id === plantId);

  if (!selectedPlant) {
    return issues;
  }

  const cellSizeCm = Number(gardenObject.cellSizeCm || 5);
  const cells = gardenObject.cells || {};

  Object.entries(cells).forEach(([existingCellKey, existingPlantId]) => {
    if (existingCellKey === cellKey(row, column) || existingPlantId === plantId) {
      return;
    }

    const existingPlant = plants.find((plant) => plant.id === existingPlantId);
    if (!existingPlant) {
      return;
    }

    const existingCell = parseCellKey(existingCellKey);
    const rowDistanceCm = (existingCell.row - row) * cellSizeCm;
    const columnDistanceCm = (existingCell.column - column) * cellSizeCm;
    const distanceCm = Math.sqrt(rowDistanceCm ** 2 + columnDistanceCm ** 2);
    const requiredSpacingCm = Math.max(
      Number(selectedPlant.spacingCm || 0),
      Number(existingPlant.spacingCm || 0)
    );

    if (distanceCm < requiredSpacingCm) {
      issues.push({
        row,
        column,
        plantName: selectedPlant.name,
        nearbyPlantName: existingPlant.name,
        distanceCm: Math.round(distanceCm * 10) / 10,
        requiredSpacingCm
      });
    }
  });

  return issues;
}

export function getAllSpacingWarnings(gardenObjects, plants) {
  const warnings = [];

  gardenObjects.forEach((gardenObject) => {
    const entries = Object.entries(gardenObject.cells || {});
    const cellSizeCm = Number(gardenObject.cellSizeCm || 5);

    for (let i = 0; i < entries.length; i += 1) {
      const [firstKey, firstPlantId] = entries[i];
      const firstPlant = plants.find((plant) => plant.id === firstPlantId);
      if (!firstPlant) continue;

      const firstCell = parseCellKey(firstKey);

      for (let j = i + 1; j < entries.length; j += 1) {
        const [secondKey, secondPlantId] = entries[j];
        if (firstPlantId === secondPlantId) continue;

        const secondPlant = plants.find((plant) => plant.id === secondPlantId);
        if (!secondPlant) continue;

        const secondCell = parseCellKey(secondKey);
        const rowDistanceCm = (firstCell.row - secondCell.row) * cellSizeCm;
        const columnDistanceCm = (firstCell.column - secondCell.column) * cellSizeCm;
        const distanceCm = Math.sqrt(rowDistanceCm ** 2 + columnDistanceCm ** 2);
        const requiredSpacingCm = Math.max(
          Number(firstPlant.spacingCm || 0),
          Number(secondPlant.spacingCm || 0)
        );

        if (distanceCm < requiredSpacingCm) {
          warnings.push({
            objectId: gardenObject.id,
            objectName: gardenObject.name,
            firstPlantName: firstPlant.name,
            secondPlantName: secondPlant.name,
            firstCell: firstKey,
            secondCell: secondKey,
            distanceCm: Math.round(distanceCm * 10) / 10,
            requiredSpacingCm
          });
        }
      }
    }
  });

  return warnings;
}

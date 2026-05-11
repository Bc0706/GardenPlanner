// Grid helpers are kept in one place so the component code stays easier to read.

export function createId(prefix = 'id') {
  return `${prefix}-${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`;
}

export function getObjectSize(gardenObject) {
  if (gardenObject.type === 'circular') {
    const diameter = Number(gardenObject.diameterCm || gardenObject.widthCm || 30);
    return { widthCm: diameter, heightCm: diameter };
  }

  return {
    widthCm: Number(gardenObject.widthCm || 100),
    heightCm: Number(gardenObject.heightCm || 30)
  };
}

export function getGridDimensions(gardenObject) {
  const { widthCm, heightCm } = getObjectSize(gardenObject);
  const cellSizeCm = Number(gardenObject.cellSizeCm || 5);

  return {
    columns: Math.max(1, Math.ceil(widthCm / cellSizeCm)),
    rows: Math.max(1, Math.ceil(heightCm / cellSizeCm)),
    cellSizeCm
  };
}

export function cellKey(row, column) {
  return `${row},${column}`;
}

export function parseCellKey(key) {
  const [row, column] = key.split(',').map(Number);
  return { row, column };
}

export function isCellInsideObject(gardenObject, row, column) {
  if (gardenObject.type !== 'circular') {
    return true;
  }

  const { columns, rows } = getGridDimensions(gardenObject);
  const centerRow = (rows - 1) / 2;
  const centerColumn = (columns - 1) / 2;
  const radius = Math.min(rows, columns) / 2;

  const distanceFromCenter = Math.sqrt(
    Math.pow(row - centerRow, 2) + Math.pow(column - centerColumn, 2)
  );

  return distanceFromCenter <= radius;
}

export function getObjectAreaCm2(gardenObject) {
  if (gardenObject.type === 'circular') {
    const diameter = Number(gardenObject.diameterCm || gardenObject.widthCm || 0);
    const radius = diameter / 2;
    return Math.PI * radius * radius;
  }

  return Number(gardenObject.widthCm || 0) * Number(gardenObject.heightCm || 0);
}

export function getCellAreaCm2(gardenObject) {
  const cellSizeCm = Number(gardenObject.cellSizeCm || 5);
  return cellSizeCm * cellSizeCm;
}

export function getPlantedCellCounts(gardenObject) {
  const counts = {};

  Object.values(gardenObject.cells || {}).forEach((plantId) => {
    counts[plantId] = (counts[plantId] || 0) + 1;
  });

  return counts;
}

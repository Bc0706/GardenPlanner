const STORAGE_KEY = 'garden-layout-planner-plan';

export function saveGardenPlan(plan) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
}

export function loadGardenPlan() {
  const savedPlan = localStorage.getItem(STORAGE_KEY);

  if (!savedPlan) {
    return null;
  }

  try {
    return JSON.parse(savedPlan);
  } catch (error) {
    console.error('Could not load saved garden plan:', error);
    return null;
  }
}

export function clearGardenPlan() {
  localStorage.removeItem(STORAGE_KEY);
}

export function downloadJson(data, filename = 'garden-plan.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function readJsonFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        resolve(JSON.parse(reader.result));
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = reject;
    reader.readAsText(file);
  });
}

import { useMemo, useState } from 'react';

const emptyForm = {
  id: '',
  name: '',
  colour: '#58a55c',
  spacingCm: 20,
  category: 'Vegetable',
  notes: ''
};

export default function PlantCreator({ plants, onSavePlant, onDeletePlant }) {
  const [form, setForm] = useState(emptyForm);
  const isEditing = Boolean(form.id);

  const sortedPlants = useMemo(
    () => [...plants].sort((a, b) => a.name.localeCompare(b.name)),
    [plants]
  );

  function updateForm(field, value) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSavePlant(form);
    setForm(emptyForm);
  }

  function handleEditPlant(plantId) {
    const plant = plants.find((item) => item.id === plantId);
    if (plant) {
      setForm(plant);
    }
  }

  return (
    <section className="panel-section">
      <h2>Create / edit plant</h2>
      <form className="stack" onSubmit={handleSubmit}>
        <label>
          Existing plant
          <select value={form.id} onChange={(event) => handleEditPlant(event.target.value)}>
            <option value="">Create new plant</option>
            {sortedPlants.map((plant) => (
              <option key={plant.id} value={plant.id}>
                {plant.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Plant name
          <input
            value={form.name}
            onChange={(event) => updateForm('name', event.target.value)}
            placeholder="Lettuce"
            required
          />
        </label>

        <div className="two-column-inputs">
          <label>
            Colour
            <input
              type="color"
              value={form.colour}
              onChange={(event) => updateForm('colour', event.target.value)}
            />
          </label>

          <label>
            Spacing cm
            <input
              type="number"
              min="0"
              value={form.spacingCm}
              onChange={(event) => updateForm('spacingCm', Number(event.target.value))}
              required
            />
          </label>
        </div>

        <label>
          Category
          <input
            value={form.category}
            onChange={(event) => updateForm('category', event.target.value)}
            placeholder="Vegetable, herb, fruit, flower"
          />
        </label>

        <label>
          Notes
          <textarea
            rows="3"
            value={form.notes}
            onChange={(event) => updateForm('notes', event.target.value)}
          />
        </label>

        <div className="button-row">
          <button type="submit">{isEditing ? 'Save plant' : 'Create plant'}</button>
          {isEditing && (
            <button type="button" className="danger" onClick={() => onDeletePlant(form.id)}>
              Delete
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

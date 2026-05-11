import { useState } from 'react';

const objectTypes = [
  { value: 'rectangular', label: 'Rectangular planter' },
  { value: 'raised-bed', label: 'Raised garden bed' },
  { value: 'square', label: 'Square pot' },
  { value: 'circular', label: 'Circular pot' },
  { value: 'custom', label: 'Custom container' }
];

export default function AddObjectPanel({ onAddObject }) {
  const [form, setForm] = useState({
    name: 'New planter',
    type: 'rectangular',
    widthCm: 100,
    heightCm: 30,
    diameterCm: 30,
    cellSizeCm: 5,
    notes: ''
  });

  function updateForm(field, value) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onAddObject(form);
    setForm((currentForm) => ({
      ...currentForm,
      name: 'New planter',
      notes: ''
    }));
  }

  const isCircular = form.type === 'circular';

  return (
    <section className="panel-section">
      <h2>Add garden object</h2>
      <form className="stack" onSubmit={handleSubmit}>
        <label>
          Object name
          <input
            value={form.name}
            onChange={(event) => updateForm('name', event.target.value)}
            required
          />
        </label>

        <label>
          Type
          <select value={form.type} onChange={(event) => updateForm('type', event.target.value)}>
            {objectTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>

        {isCircular ? (
          <label>
            Diameter in cm
            <input
              type="number"
              min="1"
              value={form.diameterCm}
              onChange={(event) => updateForm('diameterCm', Number(event.target.value))}
              required
            />
          </label>
        ) : (
          <div className="two-column-inputs">
            <label>
              Width in cm
              <input
                type="number"
                min="1"
                value={form.widthCm}
                onChange={(event) => updateForm('widthCm', Number(event.target.value))}
                required
              />
            </label>
            <label>
              Height in cm
              <input
                type="number"
                min="1"
                value={form.heightCm}
                onChange={(event) => updateForm('heightCm', Number(event.target.value))}
                required
              />
            </label>
          </div>
        )}

        <label>
          Grid scale
          <select
            value={form.cellSizeCm}
            onChange={(event) => updateForm('cellSizeCm', Number(event.target.value))}
          >
            <option value={1}>1 cell = 1cm</option>
            <option value={5}>1 cell = 5cm</option>
            <option value={10}>1 cell = 10cm</option>
          </select>
        </label>

        <label>
          Notes
          <textarea
            rows="3"
            value={form.notes}
            onChange={(event) => updateForm('notes', event.target.value)}
          />
        </label>

        <button type="submit">Add object</button>
      </form>
    </section>
  );
}

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Type, AlignLeft, List, CheckSquare, PlusCircle, ArrowUp, ArrowDown } from 'lucide-react';
import FormField from './FormField';

const FIELD_TYPES = [
  { type: 'text', label: 'Short Text', icon: <Type size={18} /> },
  { type: 'textarea', label: 'Long Text', icon: <AlignLeft size={18} /> },
  { type: 'dropdown', label: 'Dropdown', icon: <List size={18} /> },
  { type: 'radio', label: 'Single Choice', icon: <CheckSquare size={18} /> },
  { type: 'checkbox', label: 'Multiple Choice', icon: <CheckSquare size={18} /> },
];

const FormBuilder = ({ initialData, onSave, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || 'Untitled Form');
  const [description, setDescription] = useState(initialData?.description || '');
  const [fields, setFields] = useState(initialData?.fields || []);
  const [style, setStyle] = useState(initialData?.style || {
    primaryColor: '#3B82F6',
    fontFamily: 'Inter, sans-serif',
    backgroundColor: '#FFFFFF',
  });
  const [selectedFieldId, setSelectedFieldId] = useState(null);

  const selectedField = fields.find((f) => f.fieldId === selectedFieldId);

  const handleAddField = (typeObj) => {
    const newField = {
      fieldId: uuidv4(),
      type: typeObj.type,
      label: `New ${typeObj.label}`,
      placeholder: '',
      options: ['Option 1', 'Option 2', 'Option 3'],
      required: false,
      alignment: 'left',
    };
    setFields([...fields, newField]);
    setSelectedFieldId(newField.fieldId);
  };

  const handleRemoveField = (id) => {
    setFields(fields.filter((f) => f.fieldId !== id));
    if (selectedFieldId === id) setSelectedFieldId(null);
  };

  const handleFieldChange = (id, key, value) => {
    setFields(fields.map((f) => (f.fieldId === id ? { ...f, [key]: value } : f)));
  };

  const handleMoveField = (index, direction) => {
    const newFields = [...fields];
    if (direction === 'up' && index > 0) {
      [newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]];
    } else if (direction === 'down' && index < newFields.length - 1) {
      [newFields[index + 1], newFields[index]] = [newFields[index], newFields[index + 1]];
    }
    setFields(newFields);
  };

  const handleSave = () => {
    onSave({ title, description, fields, style });
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] border-t border-gray-200" style={{ fontFamily: style.fontFamily }}>
      {/* Sidebar - Palette */}
      <div className="w-full md:w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <h3 className="font-semibold text-gray-700 mb-4 uppercase text-sm tracking-wider">Add Field</h3>
        <div className="space-y-2">
          {FIELD_TYPES.map((ft) => (
            <button
              key={ft.type}
              onClick={() => handleAddField(ft)}
              className="flex items-center w-full p-2 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
            >
              <div className="mr-3 text-gray-500">{ft.icon}</div>
              <span className="font-medium text-gray-700">{ft.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8" style={{ backgroundColor: style.backgroundColor }}>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 border-l-4" style={{ borderLeftColor: style.primaryColor }}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-3xl font-bold border-none focus:ring-0 px-0 focus:outline-none placeholder-gray-300"
              placeholder="Form Title"
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-gray-500 border-none focus:ring-0 px-0 mt-2 focus:outline-none placeholder-gray-300"
              placeholder="Form Description (optional)"
            />
          </div>

          {fields.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl text-gray-500">
              <PlusCircle className="mx-auto mb-3 text-gray-400" size={32} />
              <p>Click a field type on the left to add it here.</p>
            </div>
          ) : (
            fields.map((field, index) => (
              <div key={field.fieldId} className="relative group">
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                  <button onClick={() => handleMoveField(index, 'up')} disabled={index === 0} className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30"><ArrowUp size={16} /></button>
                  <button onClick={() => handleMoveField(index, 'down')} disabled={index === fields.length - 1} className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30"><ArrowDown size={16} /></button>
                </div>
                <FormField
                  field={field}
                  mode="preview"
                  isSelected={selectedFieldId === field.fieldId}
                  onSelect={(f) => setSelectedFieldId(f.fieldId)}
                  onRemove={handleRemoveField}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Sidebar - Configurator */}
      <div className="w-full md:w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
           <h3 className="font-semibold text-gray-700 uppercase text-sm tracking-wider">
             {selectedField ? 'Field Settings' : 'Form Settings'}
           </h3>
           <div className="space-x-2">
             <button onClick={onCancel} className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">Cancel</button>
             <button onClick={handleSave} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors" style={{ backgroundColor: style.primaryColor }}>Save</button>
           </div>
        </div>

        {selectedField ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
              <input
                type="text"
                value={selectedField.label}
                onChange={(e) => handleFieldChange(selectedField.fieldId, 'label', e.target.value)}
                className="w-full p-2 border rounded border-gray-300 text-sm focus:border-blue-500 outline-none"
              />
            </div>
            {['text', 'textarea'].includes(selectedField.type) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
                <input
                  type="text"
                  value={selectedField.placeholder || ''}
                  onChange={(e) => handleFieldChange(selectedField.fieldId, 'placeholder', e.target.value)}
                  className="w-full p-2 border rounded border-gray-300 text-sm focus:border-blue-500 outline-none"
                />
              </div>
            )}
            {['dropdown', 'radio', 'checkbox'].includes(selectedField.type) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Options (comma separated)</label>
                <textarea
                  value={selectedField.options.join(', ')}
                  onChange={(e) => {
                    const opts = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    handleFieldChange(selectedField.fieldId, 'options', opts.length ? opts : e.target.value.split(','));
                  }}
                  className="w-full p-2 border rounded border-gray-300 text-sm focus:border-blue-500 outline-none"
                  rows={3}
                />
              </div>
            )}
            <div className="flex items-center mt-2 space-x-2">
              <input
                type="checkbox"
                id="req"
                checked={selectedField.required}
                onChange={(e) => handleFieldChange(selectedField.fieldId, 'required', e.target.checked)}
                className="rounded border-gray-300 text-blue-600"
              />
              <label htmlFor="req" className="text-sm font-medium text-gray-700">Required field</label>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={style.primaryColor}
                  onChange={(e) => setStyle({ ...style, primaryColor: e.target.value })}
                  className="w-8 h-8 rounded border p-0 border-gray-300"
                />
                <input
                  type="text"
                  value={style.primaryColor}
                  onChange={(e) => setStyle({ ...style, primaryColor: e.target.value })}
                  className="flex-1 p-2 border rounded border-gray-300 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
              <div className="flex items-center space-x-2">
                 <input
                  type="color"
                  value={style.backgroundColor}
                  onChange={(e) => setStyle({ ...style, backgroundColor: e.target.value })}
                  className="w-8 h-8 rounded border p-0 border-gray-300"
                />
                <input
                  type="text"
                  value={style.backgroundColor}
                  onChange={(e) => setStyle({ ...style, backgroundColor: e.target.value })}
                  className="flex-1 p-2 border rounded border-gray-300 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
              <select
                value={style.fontFamily}
                onChange={(e) => setStyle({ ...style, fontFamily: e.target.value })}
                className="w-full p-2 border rounded border-gray-300 text-sm bg-white"
              >
                <option value="Inter, sans-serif">Inter</option>
                <option value="Roboto, sans-serif">Roboto</option>
                <option value="serif">Serif</option>
                <option value="monospace">Monospace</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormBuilder;

import React from 'react';
import { Trash2, GripVertical } from 'lucide-react';

const FormField = ({
  field,
  mode = 'preview', 
  value,
  onChange,
  error,
  onSelect,
  onRemove,
  isSelected,
}) => {
  const { type, label, placeholder, options, required, alignment } = field;

  
  const renderInput = () => {
    switch (type) {
      case 'text':
        return (
          <input
            type="text"
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blur-500 outline-none ${error ? 'border-red-500' : 'border-gray-300'}`}
            placeholder={placeholder}
            value={value || ''}
            onChange={(e) => mode === 'input' && onChange(field.fieldId, e.target.value)}
            disabled={mode === 'preview'}
          />
        );
      case 'textarea':
        return (
          <textarea
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${error ? 'border-red-500' : 'border-gray-300'}`}
            placeholder={placeholder}
            rows={3}
            value={value || ''}
            onChange={(e) => mode === 'input' && onChange(field.fieldId, e.target.value)}
            disabled={mode === 'preview'}
          />
        );
      case 'dropdown':
        return (
          <select
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white ${error ? 'border-red-500' : 'border-gray-300'}`}
            value={value || ''}
            onChange={(e) => mode === 'input' && onChange(field.fieldId, e.target.value)}
            disabled={mode === 'preview'}
          >
            <option value="" disabled>Select an option</option>
            {options?.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {options?.map((opt, i) => (
              <label key={i} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={field.fieldId}
                  value={opt}
                  checked={value === opt}
                  onChange={(e) => mode === 'input' && onChange(field.fieldId, e.target.value)}
                  disabled={mode === 'preview'}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {options?.map((opt, i) => {
              const isChecked = Array.isArray(value) ? value.includes(opt) : false;
              return (
                <label key={i} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={opt}
                    checked={isChecked}
                    onChange={(e) => {
                      if (mode !== 'input') return;
                      let newVal;
                      if (e.target.checked) {
                        newVal = Array.isArray(value) ? [...value, opt] : [opt];
                      } else {
                        newVal = Array.isArray(value) ? value.filter((v) => v !== opt) : [];
                      }
                      onChange(field.fieldId, newVal);
                    }}
                    disabled={mode === 'preview'}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{opt}</span>
                </label>
              );
            })}
          </div>
        );
      default:
        return <div>Unknown field type: {type}</div>;
    }
  };

  const getAlignmentClass = () => {
    switch (alignment) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };

  if (mode === 'preview') {
    return (
      <div 
        className={`relative p-4 mb-4 bg-white border rounded-lg cursor-pointer transition-shadow hover:shadow-md ${
          isSelected ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'
        }`}
        onClick={() => onSelect(field)}
      >
        <div className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center text-gray-400 opacity-0 hover:opacity-100 cursor-grab">
           {/* In a real drag-and-drop we'd attach a handle here. For now it's just visual. */}
           <GripVertical size={20} />
        </div>
        <div className="ml-4">
          <div className="flex justify-between items-start mb-2">
            <label className={`block font-semibold text-gray-800 ${getAlignmentClass()}`}>
              {label} {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(field.fieldId);
              }}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              title="Remove Field"
            >
              <Trash2 size={18} />
            </button>
          </div>
          <div className="pointer-events-none opacity-80">
            {renderInput()}
          </div>
        </div>
      </div>
    );
  }

  
  return (
    <div className="mb-6 p-1">
      <label className={`block font-semibold text-gray-800 mb-2 ${getAlignmentClass()}`}>
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormField;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getForm, submitResponse } from '../services/api';
import FormField from '../components/FormField';
import { CheckCircle } from 'lucide-react';

const FillForm = ({ success }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(!success);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    if (!success && id) {
      const fetchForm = async () => {
        try {
          const data = await getForm(id);
          setForm(data);
          // Initialize answers map
          const initAnswers = {};
          data.fields.forEach(f => {
            initAnswers[f.fieldId] = f.type === 'checkbox' ? [] : '';
          });
          setAnswers(initAnswers);
        } catch (err) {
          setFetchError('Form not found or unavailable.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchForm();
    }
  }, [id, success]);

  const handleChange = (fieldId, value) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
    // Clear error for this field
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    let isValid = true;
    form.fields.forEach(field => {
      if (field.required) {
        const value = answers[field.fieldId];
        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[field.fieldId] = 'This field is required';
          isValid = false;
        }
      }
    });
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const payload = {
        formId: id,
        answers: Object.entries(answers).map(([fieldId, value]) => ({ fieldId, value })),
      };
      await submitResponse(payload);
      navigate(`/form/${id}/success`);
    } catch (err) {
      setFetchError('Failed to submit response. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <CheckCircle className="mx-auto text-green-500 mb-6" size={64} />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Thank You!</h2>
        <p className="text-gray-600">Your response has been successfully submitted.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  if (isLoading) return <div className="text-center mt-20">Loading form...</div>;
  if (fetchError) return <div className="text-center mt-20 text-red-500">{fetchError}</div>;
  if (!form) return null;

  return (
    <div 
      className="min-h-[80vh] py-10" 
      style={{ 
        backgroundColor: form.style?.backgroundColor || '#f9fafb',
        fontFamily: form.style?.fontFamily || 'Inter, sans-serif'
      }}
    >
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div 
          className="h-3 w-full" 
          style={{ backgroundColor: form.style?.primaryColor || '#3b82f6' }}
        ></div>
        
        <div className="p-8 sm:p-10">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{form.title}</h1>
            {form.description && (
              <p className="text-lg text-gray-600 whitespace-pre-wrap leading-relaxed">{form.description}</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {form.fields.map((field) => (
              <div key={field.fieldId} className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                <FormField
                  field={field}
                  mode="input"
                  value={answers[field.fieldId]}
                  onChange={handleChange}
                  error={errors[field.fieldId]}
                />
              </div>
            ))}

            <div className="pt-6 border-t border-gray-200 mt-10">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-4 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 transform hover:-translate-y-1"
                style={{ backgroundColor: form.style?.primaryColor || '#3b82f6' }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Response'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FillForm;

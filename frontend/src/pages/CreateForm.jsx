import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FormBuilder from '../components/FormBuilder';
import { createForm, getForm, updateForm } from '../services/api';

const CreateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(!!id);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchForm = async () => {
        try {
          const data = await getForm(id);
          setInitialData(data);
        } catch (err) {
          setError('Failed to fetch form.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchForm();
    }
  }, [id]);

  const handleSave = async (formData) => {
    try {
      setIsLoading(true);
      
      const payload = { ...formData, isPublished: true };

      if (id) {
        await updateForm(id, payload);
      } else {
        await createForm(payload);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save form.');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => navigate('/dashboard')} className="text-blue-600 hover:underline">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-4">
      {/* Subtract page padding to let the builder fill the screen width/height */}
      <FormBuilder
        initialData={initialData}
        onSave={handleSave}
        onCancel={() => navigate('/dashboard')}
      />
    </div>
  );
};

export default CreateForm;

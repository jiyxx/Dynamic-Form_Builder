import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getForm, getResponses, getAnalytics, downloadCsv } from '../services/api';
import ResponseTable from '../components/ResponseTable';
import { Download, ArrowLeft, BarChart } from 'lucide-react';

const Responses = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formData, responsesData, analyticsData] = await Promise.all([
          getForm(id),
          getResponses(id, { limit: 1000 }), // In a real app, handle pagination
          getAnalytics(id)
        ]);
        setForm(formData);
        setResponses(responsesData.responses);
        setAnalytics(analyticsData);
      } catch (err) {
        setError('Failed to load response data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDownloadCsv = async () => {
    try {
      const blob = await downloadCsv(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${form.title.replace(/[^a-z0-9]/gi, '_')}_responses.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download CSV');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error || 'Form not found'}</p>
        <button onClick={() => navigate('/dashboard')} className="text-blue-600 hover:underline">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-sm text-gray-500 hover:text-blue-600 mb-2 transition-colors"
          >
             <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {responses.length} {responses.length === 1 ? 'response' : 'responses'}
          </p>
        </div>
        <button
          onClick={handleDownloadCsv}
          disabled={responses.length === 0}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={18} className="mr-2" /> Export CSV
        </button>
      </div>

      {/* Analytics Summary */}
      {analytics && analytics.fieldBreakdowns.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
           <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
             <BarChart size={20} className="mr-2 text-blue-600" /> Analytics Summary
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {analytics.fieldBreakdowns.map((fb) => (
               <div key={fb.fieldId} className="border border-gray-200 rounded-lg p-4">
                 <h3 className="font-semibold text-gray-700 mb-3 text-sm">{fb.label}</h3>
                 <div className="space-y-2 text-sm">
                   {Object.entries(fb.counts).map(([option, count]) => {
                     const percentage = responses.length > 0 ? Math.round((count / responses.length) * 100) : 0;
                     return (
                       <div key={option}>
                         <div className="flex justify-between text-gray-600 mb-1">
                           <span>{option}</span>
                           <span className="font-medium">{count} ({percentage}%)</span>
                         </div>
                         <div className="w-full bg-gray-100 rounded-full h-1.5">
                           <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                         </div>
                       </div>
                     );
                   })}
                 </div>
               </div>
             ))}
           </div>
        </div>
      )}

      {/* Responses Table */}
      <ResponseTable form={form} responses={responses} />
    </div>
  );
};

export default Responses;

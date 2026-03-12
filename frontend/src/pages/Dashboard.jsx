import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getForms, deleteForm, duplicateForm } from '../services/api';
import { Plus, Edit2, Copy, Trash2, ExternalLink, BarChart2, Link as LinkIcon } from 'lucide-react';

const Dashboard = () => {
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchForms = async () => {
    try {
      setIsLoading(true);
      const data = await getForms({ search });
      setForms(data.forms || []);
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, [search]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this form and all its responses?')) {
      await deleteForm(id);
      fetchForms();
    }
  };

  const handleDuplicate = async (id) => {
    await duplicateForm(id);
    fetchForms();
  };

  const copyToClipboard = (id) => {
    const url = `${window.location.origin}/form/${id}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Forms</h1>
          <p className="text-gray-500 mt-1">Manage and create your dynamic forms</p>
        </div>
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search forms..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={() => navigate('/forms/new')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 shadow-sm"
          >
            <Plus size={18} className="mr-2" /> Create
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : forms.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 mb-4 text-lg">No forms found.</p>
          <button
            onClick={() => navigate('/forms/new')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            <Plus size={20} className="mr-2" /> Create your first form
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <div key={form._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden flex flex-col group">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-gray-800 line-clamp-1 mb-2 group-hover:text-blue-600 transition-colors">
                    {form.title}
                  </h3>
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full flex items-center">
                    {form.responseCount} res
                  </span>
                </div>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">
                  {form.description || 'No description provided.'}
                </p>
                <div className="text-xs text-gray-400">
                  Created: {new Date(form.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 flex justify-between items-center">
                <div className="flex space-x-1">
                  <button onClick={() => navigate(`/form/${form._id}`)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Public Form">
                    <ExternalLink size={18} />
                  </button>
                  <button onClick={() => copyToClipboard(form._id)} className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Copy Link">
                    <LinkIcon size={18} />
                  </button>
                  <button onClick={() => navigate(`/forms/${form._id}/responses`)} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="View Responses">
                    <BarChart2 size={18} />
                  </button>
                </div>
                <div className="flex space-x-1">
                  <button onClick={() => navigate(`/forms/${form._id}/edit`)} className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors" title="Edit Form">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDuplicate(form._id)} className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Duplicate Form">
                    <Copy size={18} />
                  </button>
                  <button onClick={() => handleDelete(form._id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Form">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

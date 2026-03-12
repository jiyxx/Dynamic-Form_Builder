import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CreateForm from './pages/CreateForm';
import FillForm from './pages/FillForm';
import Responses from './pages/Responses';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 w-full shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              FormForge
            </h1>
            <nav className="flex space-x-4">
              <a href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Dashboard
              </a>
              <a href="/forms/new" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                New Form
              </a>
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/forms/new" element={<CreateForm />} />
            <Route path="/forms/:id/edit" element={<CreateForm />} />
            <Route path="/forms/:id/responses" element={<Responses />} />
            <Route path="/form/:id" element={<FillForm />} />
            <Route path="/form/:id/success" element={<FillForm success={true} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

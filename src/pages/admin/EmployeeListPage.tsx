import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useEmployees } from '../../hooks/useEmployees';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmployeeForm } from '../../components/admin/EmployeeForm';

export const EmployeeListPage = () => {
  const { employees, isLoading, error } = useEmployees();
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Employees</h1>
        <button
          onClick={() => {
            setEditingEmployee(null);
            setShowForm(true);
          }}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Employee
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <EmployeeForm
            employee={editingEmployee}
            onClose={() => {
              setShowForm(false);
              setEditingEmployee(null);
            }}
          />
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {employees.map((emp) => (
            <li key={emp.id}>
              <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{emp.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{emp.email}</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setEditingEmployee(emp);
                      setShowForm(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {/* Implement delete */}}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
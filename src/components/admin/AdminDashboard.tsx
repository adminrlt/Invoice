import React from 'react';
import DepartmentForm from './DepartmentForm';
import EmployeeForm from './EmployeeForm';

export const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DepartmentForm />
        <EmployeeForm />
      </div>
    </div>
  );
};
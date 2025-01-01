import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { AuthPage } from './pages/AuthPage';
import { AdminAuthPage } from './pages/AdminAuthPage';
import { DepartmentListPage } from './pages/admin/DepartmentListPage';
import { EmployeeListPage } from './pages/admin/EmployeeListPage';
import { InvoiceListPage } from './pages/admin/InvoiceListPage';
import { AdminUploadPage } from './pages/admin/UploadPage';
import { DocumentUploadPage } from './pages/DocumentUploadPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminRoute, PrivateRoute } from './components/routing';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Layout>
          <Routes>
            {/* Public routes */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin/auth" element={<AdminAuthPage />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout>
                  <Navigate to="/admin/departments" replace />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/departments" element={
              <AdminRoute>
                <AdminLayout>
                  <DepartmentListPage />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/employees" element={
              <AdminRoute>
                <AdminLayout>
                  <EmployeeListPage />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/invoices" element={
              <AdminRoute>
                <AdminLayout>
                  <InvoiceListPage />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/upload" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminUploadPage />
                </AdminLayout>
              </AdminRoute>
            } />
            
            {/* User routes */}
            <Route path="/" element={
              <PrivateRoute>
                <DocumentUploadPage />
              </PrivateRoute>
            } />
            <Route path="/documents" element={
              <PrivateRoute>
                <DocumentUploadPage />
              </PrivateRoute>
            } />
            
            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
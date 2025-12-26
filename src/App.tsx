// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthPage } from './components/AuthPage';
import { ProtectedLayout } from './components/ProtectedLayout'; // Keep for future private routes
import { Toaster } from 'sonner';

import { HomePage } from './components/HomePage';
import { SearchResultsPage } from './components/SearchResultsPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { ComparePage } from './components/ComparePage';
import { Header } from './components/Header'; // Import Header here
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { AdminAffiliatePage } from './components/AdminAffiliatePage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" richColors />
        <ScrollToTop />
        {/* Header is now outside of Routes or at the top level to show on all pages */}
        <Header /> 
        <Routes>
          <Route path="/auth" element={<AuthPage />} />

          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/compare" element={<ComparePage />} />

          {/* Protected Routes (e.g., Profile, Settings, or specific Rating pages) */}
          <Route element={<ProtectedLayout />}>
            {/* Add routes here that strictly require login */}
          </Route>
          <Route element={<ProtectedLayout requiredRole="admin" />}>
            <Route path="/admin/affiliates" element={<AdminAffiliatePage />} />
          </Route>
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}
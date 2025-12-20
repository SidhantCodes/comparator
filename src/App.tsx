import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthPage } from './components/AuthPage';
import { ProtectedLayout } from './components/ProtectedLayout';
import { Toaster } from 'sonner';

import { HomePage } from './components/HomePage';
import { SearchResultsPage } from './components/SearchResultsPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { ComparePage } from './components/ComparePage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" richColors />

        <Routes>
          <Route path="/auth" element={<AuthPage />} />

          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/compare" element={<ComparePage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

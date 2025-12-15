import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { SearchResultsPage } from './components/SearchResultsPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { ComparePage } from './components/ComparePage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/compare" element={<ComparePage />} />
      </Routes>
    </Router>
  );
}

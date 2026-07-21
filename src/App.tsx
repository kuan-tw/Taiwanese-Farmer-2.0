import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ProductList } from './pages/ProductList';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { EpidemicDetailPage } from './pages/EpidemicDetailPage';
import { Header } from './components/Header';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  const location = useLocation();

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 dark:text-white transition-colors duration-200">
          <Header />
          <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <Routes location={location}>
              <Route path="/" element={<ProductList />} />
              <Route path="/product/:cropCode" element={<ProductDetailPage />} />
              <Route path="/epidemic/:index" element={<EpidemicDetailPage />} />
            </Routes>
          </main>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
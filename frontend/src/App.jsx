import { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeContext } from './context/ThemeContext';
import Navbar from './components/Navbar';
import AboutPage from './pages/AboutPage';

export default function App() {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <div className={`min-h-screen flex flex-col items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
              Tailwind + Vite + React ✅
            </h1>
          </div>
        } />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </div>
  );
}
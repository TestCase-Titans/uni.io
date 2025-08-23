import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex gap-4">
          <Link 
            to="/" 
            className={`${isDarkMode ? 'text-gray-200 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-600'}`}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`${isDarkMode ? 'text-gray-200 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-600'}`}
          >
            About
          </Link>
        </div>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          {isDarkMode ? '🌞 Light' : '🌙 Dark'}
        </button>
      </div>
    </nav>
  );
}
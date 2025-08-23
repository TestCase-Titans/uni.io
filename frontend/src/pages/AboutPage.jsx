import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export default function AboutPage() {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className={`min-h-screen p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`max-w-2xl mx-auto ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        <h1 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
          About Us
        </h1>
        <p className="mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
          incididunt ut labore et dolore magna aliqua.
        </p>
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-500'}`}>
            Our Mission
          </h2>
          <p>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut 
            aliquip ex ea commodo consequat.
          </p>
        </div>
      </div>
    </div>
  );
}
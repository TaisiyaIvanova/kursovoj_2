import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../Context/ThemeContext'; 
import { FiAlertTriangle } from 'react-icons/fi'; 

const NotFoundPage: React.FC = () => {
    const { theme } = useTheme(); 

    return (
        <div 
            className={`min-h-screen flex flex-col items-center justify-center px-4 py-12 transition-colors duration-300 ${
                theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'
            }`}
        >
            <FiAlertTriangle className={`text-6xl mb-4 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'}`} />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                404 - Страница не найдена
            </h1>
            <p className="text-lg md:text-xl text-center mb-8">
                Извините, страница, которую вы ищете, не существует или была перемещена.
            </p>
            <Link 
                to="/"
                className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                    theme === 'dark' 
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                        : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                }`}
            >
                Вернуться на главную
            </Link>
        </div>
    );
};

export default NotFoundPage; 
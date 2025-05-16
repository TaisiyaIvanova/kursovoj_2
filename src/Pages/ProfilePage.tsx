import { useNavigate } from 'react-router-dom';
import { useTheme } from '../Context/ThemeContext';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiLogOut } from 'react-icons/fi';
import { useEffect, useState } from 'react';

const Profile = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [email, setEmail] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
        const currentEmail = localStorage.getItem('currentUser');
        console.log('currentEmail:', currentEmail);

        if (!currentEmail) {
            console.log('No current user found. Redirecting to login...');
            navigate('/login');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users') || '{}');
        console.log('users:', users);

        const currentUser = users[currentEmail];
        console.log('currentUser:', currentUser);

        if (currentUser) {
            setEmail(currentUser.email);
            setName(currentUser.name);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/login');
    };

    const getInitial = (name: string | null): string => {
        if (!name || name.trim() === '') return '?';
        return name[0].toUpperCase();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}
        >
            <div className="max-w-md mx-auto p-6">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-md hover:shadow-lg transition-shadow`}
                    >
                        <FiArrowLeft />
                    </button>
                    <h1
                        className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
                    >
                        Профиль
                    </h1>
                    <div className="w-8"></div>
                </div>

                <div className="flex flex-col items-center mb-8">
                    <div
                        className={`w-24 h-24 rounded-full bg-gradient-to-r from-yellow-400 to-amber-600 flex items-center justify-center mb-4`}
                    >
                        <span className="text-white text-3xl font-bold">{getInitial(name)}</span>
                    </div>
                    {name && (
                        <p
                            className={`text-xl font-semibold text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
                        >
                            {name}
                        </p>
                    )}
                    {email && (
                        <p
                            className={`text-sm text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                        >
                            {email}
                        </p>
                    )}
                </div>

                <div
                    className={`rounded-xl shadow-md p-6 mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300`}
                >
                    <h3
                        className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-4`}
                    >
                        Настройки
                    </h3>
                    <div className="flex items-center justify-between py-3">
                        <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {theme === 'light' ? 'Светлая тема' : 'Тёмная тема'}
                        </span>
                        <button
                            onClick={toggleTheme}
                            className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors duration-300 focus:outline-none ${theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'}`}
                            aria-label="Переключить тему"
                        >
                            <span
                                className={`${
                                    theme === 'light' ? 'translate-x-1' : 'translate-x-6'
                                } inline-block w-4 h-4 transform bg-white rounded-full shadow-md transition-transform duration-300`}
                            />
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className={`w-full py-3 px-4 ${theme === 'dark' ? 'bg-red-600' : 'bg-red-500'} hover:${theme === 'dark' ? 'bg-red-700' : 'bg-red-600'} text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2`}
                >
                    <FiLogOut />
                    Выйти из аккаунта
                </button>
            </div>
        </motion.div>
    );
};

export default Profile;

import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../Context/ThemeContext';

const Header = ({
    onSearchChange,
}: {
    onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const currentEmail = localStorage.getItem('currentUser');

        if (currentEmail) {
            const users = JSON.parse(localStorage.getItem('users') || '{}');
            const user = users[currentEmail];

            if (user) {
                setCurrentUser(user);
            }
        }
    }, [navigate]);

    const getInitial = (name: string | null): string => {
        if (!name || name.trim() === '') return 'U';
        return name[0].toUpperCase();
    };

    return (
        <header
            style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            className={`w-full px-4 min-h-18 md:px-8 py-4 ${
                theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
            } transition-colors duration-300`}
        >
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 relative">
                <div className={`flex-1 flex justify-center ${onSearchChange ? '' : 'hidden'}`}>
                    <div
                        className={`flex items-center rounded-full px-4 py-2 w-full max-w-md transition-all ${
                            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                        }`}
                    >
                        <input
                            type="text"
                            placeholder="Поиск"
                            onChange={onSearchChange}
                            className={`bg-transparent outline-none w-full text-gray-700 placeholder-gray-400 ${
                                theme === 'dark' ? 'text-white placeholder-gray-500' : ''
                            }`}
                        />
                        <FiSearch
                            className={`text-xl ${
                                theme === 'dark' ? 'text-white' : 'text-gray-700'
                            }`}
                        />
                    </div>
                </div>

                {currentUser && (
                    <div
                        onClick={() => navigate('/profile')}
                        className={`cursor-pointer flex-shrink-0 ${onSearchChange ? '' : 'absolute top-1 right-0'}`}
                    >
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                                theme === 'dark' ? 'bg-yellow-600' : 'bg-yellow-400'
                            }`}
                        >
                            {getInitial(currentUser.name)}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;

import Header from '../Components/Header.tsx';
import { useTheme } from '../Context/ThemeContext.tsx';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const LandingPage = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();

    const handleStartClick = () => {
        navigate('/login');
    };

    return (
        <main
            className={`w-screen min-h-screen px-6 py-6 flex flex-col ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-800'} transition-colors duration-300`}
        >
            <div>
                <Header />
            </div>
            <div
                className={` h-screen mt-3 flex flex-col items-center overflow-hidden  shadow-xl ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} pb-10`}
            >
                <img
                    className="max-w-full object-contain mt-0"
                    src="/Different_people_01.jpg"
                    alt="Group of diverse people working"
                />
                <h1 className="text-3xl font-bold mt-16">Привет!</h1>
                <h3 className="text-lg font-bold w-1/3 mt-8">
                    Здесь ты можешь безопасно и удобно записывать свои мысли, события, цели и важные
                    моменты каждого дня. Простой интерфейс, гибкая настройка тем и защита данных
                    делают твой опыт максимально комфортным и личным. Начни вести дневник уже
                    сегодня — для себя, для памяти, для роста.
                </h3>

                <motion.button
                    onClick={handleStartClick}
                    className="w-full sm:w-auto px-8 sm:px-12 md:px-16 min-h-16 md:min-h-20 rounded-xl text-xl sm:text-2xl font-bold text-white mt-6 shadow-lg transition-transform duration-150 ease-in-out"
                    style={{ backgroundColor: 'rgba(65, 222, 9, 1)' }}
                    whileHover={{ scale: 1.05, boxShadow: '0px 0px 15px rgba(65, 222, 9, 0.7)' }}
                    whileTap={{ scale: 0.95 }}
                >
                    Начать!
                </motion.button>
            </div>
        </main>
    );
};

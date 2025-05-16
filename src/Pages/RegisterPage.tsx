import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDark);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        const { name, email, password, confirmPassword } = form;
        if (!name || !email || !password || !confirmPassword) {
            setError('Все поля обязательны');
            return;
        }
        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users') || '{}');
        if (users[email]) {
            setError('Пользователь уже существует');
            return;
        }

        users[email] = { name, email, password, tags: [], notes: [] };
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', email);

        console.log('Пользователь успешно зарегистрирован:');
        console.log('Email:', email);
        console.log('Пароль:', password);

        navigate('/main');
    };

    return (
        <main
            className={`flex flex-col items-center justify-center min-h-screen px-4 transition-all duration-300 ${
                isDarkMode
                    ? 'bg-gray-800 text-white'
                    : 'bg-gradient-to-br from-green-100 to-white text-black'
            }`}
        >
            <section
                className={`shadow-xl rounded-xl px-8 py-10 w-full max-w-md transition-all duration-300 ${
                    isDarkMode ? 'bg-gray-900' : 'bg-white'
                }`}
            >
                <h1 className="text-3xl font-bold text-green-600 text-center mb-6">Регистрация</h1>
                <div className="flex flex-col gap-4">
                    <input
                        name="name"
                        placeholder="Имя"
                        className={`px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 ${
                            isDarkMode
                                ? 'bg-gray-700 text-white border-gray-600'
                                : 'bg-white text-black'
                        }`}
                        onChange={handleChange}
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        className={`px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 ${
                            isDarkMode
                                ? 'bg-gray-700 text-white border-gray-600'
                                : 'bg-white text-black'
                        }`}
                        onChange={handleChange}
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Пароль"
                        className={`px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 ${
                            isDarkMode
                                ? 'bg-gray-700 text-white border-gray-600'
                                : 'bg-white text-black'
                        }`}
                        onChange={handleChange}
                    />
                    <input
                        name="confirmPassword"
                        type="password"
                        placeholder="Повторите пароль"
                        className={`px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 ${
                            isDarkMode
                                ? 'bg-gray-700 text-white border-gray-600'
                                : 'bg-white text-black'
                        }`}
                        onChange={handleChange}
                    />
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button
                        onClick={handleSubmit}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md transition-all duration-300"
                    >
                        Зарегистрироваться
                    </button>
                </div>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Уже есть аккаунт?{' '}
                        <Link to="/login" className="text-green-500 hover:text-green-600">
                            Войти
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
};

export default RegisterPage;

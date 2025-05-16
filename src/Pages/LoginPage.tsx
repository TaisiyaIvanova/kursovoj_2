import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDark);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = () => {
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        const user = users[form.email];
        if (!user || user.password !== form.password) {
            setError('Неверный email или пароль');
            return;
        }
        localStorage.setItem('currentUser', form.email);

        setTimeout(() => {
            navigate('/main');
        }, 100);
    };

    return (
        <main
            className={`flex flex-col items-center justify-center min-h-screen px-4 transition-all duration-300 ${
                isDarkMode
                    ? 'bg-gray-800 text-white'
                    : 'bg-gradient-to-tr from-green-100 to-white text-black'
            }`}
        >
            <section
                className={`shadow-2xl rounded-xl p-8 w-full max-w-sm text-center font-sans transition-all duration-300 ${
                    isDarkMode ? 'bg-gray-900' : 'bg-white'
                }`}
            >
                <h1 className="text-4xl font-bold mb-6 text-green-600">Добро пожаловать!</h1>
                <input
                    name="email"
                    placeholder="Email"
                    className={`w-full mb-4 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 ${
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
                    className={`w-full mb-4 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 ${
                        isDarkMode
                            ? 'bg-gray-700 text-white border-gray-600'
                            : 'bg-white text-black'
                    }`}
                    onChange={handleChange}
                />
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <button
                    onClick={handleLogin}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-all"
                >
                    Войти
                </button>
                <p className="mt-4 text-sm text-gray-600">
                    Нет аккаунта?{' '}
                    <Link to="/register" className="text-green-500 hover:underline">
                        Зарегистрироваться
                    </Link>
                </p>
            </section>
        </main>
    );
};

export default LoginPage;

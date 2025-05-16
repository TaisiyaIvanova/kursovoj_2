import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './Pages/MainPage';
import CreateNotePage from './Pages/CreateNotePage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import { ThemeProvider } from './Context/ThemeContext';
import Profile from './Pages/ProfilePage';
import EditNotePage from './Pages/EditNotePage';
import { LandingPage } from './Pages/LandingPage';
import { ProtectedRoute } from './utils/ProtectedRoute';
import NotFoundPage from './Pages/NotFoundPage';

function App() {
    return (
        <ThemeProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/main" element={<MainPage />} />
                        <Route path="/create-note" element={<CreateNotePage />} />
                        <Route path="/edit-note/:id" element={<EditNotePage />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;

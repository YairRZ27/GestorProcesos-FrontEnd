import React, { useState, useEffect, useCallback } from 'react';
import { apiGetUserProfile } from './api/auth';
import Notification from './components/Notification';
import Navbar from './components/Navbar';
import AppRouter from './routes/AppRouter';

const appId = 'GestorProcesos-Frontend';

function App() {
    const [user, setUser] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [currentPage, setCurrentPage] = useState('login');
    const [notification, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('success');

    const setNotification = useCallback((message, type) => {
        setNotificationMessage(message);
        setNotificationType(type);
        if (window.notificationTimeout) clearTimeout(window.notificationTimeout);
        window.notificationTimeout = setTimeout(() => setNotificationMessage(''), 5000);
    }, []);

    useEffect(() => {
        const checkAuthStatus = async () => {
            setIsLoadingUser(true);
            const token = localStorage.getItem('authToken');

            if (token) {
                try {
                    const userProfile = await apiGetUserProfile(token);
                    setUser(userProfile);
                    setCurrentPage('dashboard');
                } catch (error) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userId');
                    setUser(null);
                    setCurrentPage('login');
                    if (error.message.includes('Sesión inválida')) {
                        setNotification(error.message, 'error');
                    }
                }
            } else {
                setUser(null);
                if (currentPage !== 'register' && currentPage !== 'login') {
                     setCurrentPage('login');
                }
            }
            setIsLoadingUser(false);
        };
        checkAuthStatus();
    }, [setNotification, currentPage]);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        setCurrentPage('dashboard');
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        setUser(null);
        setCurrentPage('login');
    };

    const handleRegisterSuccess = () => {
        setCurrentPage('login');
        setNotification('¡Registro exitoso! Por favor, inicia sesión.', 'success');
    };

    if (isLoadingUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-sky-400 mx-auto mb-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-xl text-sky-300">Verificando sesión...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col">
            <Notification message={notification} type={notificationType} onClose={() => setNotificationMessage('')} />
            {user && (
                <Navbar
                    onLogout={handleLogout}
                    userEmail={user.correo || user.email}
                    onNavigate={setCurrentPage}
                    currentPage={currentPage}
                    setNotification={setNotification}
                />
            )}
            <main className="flex-grow">
                <AppRouter
                    user={user}
                    onLoginSuccess={handleLoginSuccess}
                    onRegisterSuccess={handleRegisterSuccess}
                    setNotification={setNotification}
                    handleLogout={handleLogout}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </main>
        </div>
    );
}

export default App;
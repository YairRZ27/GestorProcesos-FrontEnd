import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../components/LoginPage';
import RegisterPage from '../components/RegisterPage';
import DashboardPage from '../components/DashboardPage';
import ProcesosPage from '../components/ProcesosPage';
import SolicitudesPage from '../components/SolicitudesPage';
import UsuariosPage from '../components/UsuariosPage';

const AppRouter = ({
    user,
    onLoginSuccess,
    onRegisterSuccess,
    setNotification,
    handleLogout,
    userEmail,
    currentPage,
    setCurrentPage
}) => (
    <Routes>
        {!user ? (
            <>
                <Route path="/register" element={
                    <RegisterPage
                        onRegisterSuccess={onRegisterSuccess}
                        onSwitchToLogin={() => setCurrentPage('login')}
                        setNotification={setNotification}
                    />
                } />
                <Route path="*" element={
                    <LoginPage
                        onLoginSuccess={onLoginSuccess}
                        onSwitchToRegister={() => setCurrentPage('register')}
                        setNotification={setNotification}
                    />
                } />
            </>
        ) : (
            <>
                <Route path="/dashboard" element={<DashboardPage userName={user.email} userId={user.id} />} />
                <Route path="/procesos" element={<ProcesosPage setNotification={setNotification} />} />
                <Route path="/solicitudes" element={<SolicitudesPage setNotification={setNotification} />} />
                <Route path="/usuarios" element={<UsuariosPage setNotification={setNotification} />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
            </>
        )}
    </Routes>
);

export default AppRouter;
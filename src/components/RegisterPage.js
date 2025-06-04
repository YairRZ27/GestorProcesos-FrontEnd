import React, { useState } from 'react';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { apiRegister } from '../api/auth';

const RegisterPage = ({ onRegisterSuccess, onSwitchToLogin, setNotification }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setNotification('Por favor, ingresa email y contraseña.', 'error');
            return;
        }
        setIsLoading(true);
        try {
            await apiRegister(email, password);
            setNotification('Registro exitoso. Ahora puedes iniciar sesión.', 'success');
            onRegisterSuccess();
        } catch (error) {
            setNotification(error.message || 'Error al registrarse. Inténtalo de nuevo.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
            <form 
                onSubmit={handleRegister}
                className="bg-slate-800 p-8 rounded-xl shadow-xl w-full max-w-md animate-fadeIn"
            >
                <h2 className="text-3xl font-bold text-sky-400 mb-6 flex items-center">
                    <UserPlus size={28} className="mr-2" />
                    Registro
                </h2>
                <div className="mb-4">
                    <label className="block text-slate-300 mb-1">Email</label>
                    <input
                        type="email"
                        className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        autoFocus
                        autoComplete="username"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-slate-300 mb-1">Contraseña</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-400 pr-10"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-2 text-slate-400 hover:text-sky-400"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <UserPlus size={20} className="mr-2" />
                    )}
                    {isLoading ? "Registrando..." : "Registrarse"}
                </button>
                <div className="mt-6 text-center">
                    <span className="text-slate-400">¿Ya tienes cuenta?</span>
                    <button
                        type="button"
                        className="ml-2 text-sky-400 hover:underline"
                        onClick={onSwitchToLogin}
                    >
                        Inicia sesión
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;
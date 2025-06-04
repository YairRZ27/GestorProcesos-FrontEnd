import React from 'react';
import { LayoutDashboard } from 'lucide-react';

const appId = 'GestorProcesos-Frontend';
const API_BASE_URL = '/api';

const DashboardPage = ({ userName, userId }) => (
    <div className="p-8 bg-slate-800 rounded-xl shadow-xl m-4 animate-fadeIn">
        <div className="flex items-center text-sky-400 mb-6">
            <LayoutDashboard size={40} className="mr-4" />
            <h1 className="text-4xl font-bold">Dashboard</h1>
        </div>
        <p className="text-slate-300 text-lg">
            ¡Bienvenido de nuevo, <span className="font-semibold text-sky-300">{userName || 'Usuario'}</span>!
        </p>
        <p className="text-slate-400 mt-2">
            Desde aquí puedes navegar a los diferentes módulos de la aplicación. Selecciona una opción del menú de navegación.
        </p>
        <div className="mt-8 p-6 bg-slate-700 rounded-lg">
            <h3 className="text-xl font-semibold text-sky-300 mb-3">Información de la App y Usuario:</h3>
            <p className="text-slate-400">Frontend AppID: <span className="font-mono text-xs">{appId}</span></p>
            {userId && <p className="text-slate-400">Tu UserID (del backend): <span className="font-mono text-xs">{userId}</span></p>}
            <p className="text-slate-400">Backend: <span className="font-semibold">FastAPI</span> (esperado en {API_BASE_URL})</p>
        </div>
    </div>
);

export default DashboardPage;
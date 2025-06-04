import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, ListChecks, FileText, Users } from 'lucide-react';

const Navbar = ({ onLogout, userEmail, currentPage }) => {
    const navigate = useNavigate();
    const navItems = [
        { name: 'Dashboard', page: 'dashboard', icon: LayoutDashboard },
        { name: 'Procesos', page: 'procesos', icon: ListChecks },
        { name: 'Solicitudes', page: 'solicitudes', icon: FileText },
        { name: 'Usuarios', page: 'usuarios', icon: Users },
    ];

    return (
        <nav className="bg-slate-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center">
                        <span className="font-bold text-2xl text-sky-400">Mi App</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        {navItems.map(item => (
                            <button
                                key={item.page}
                                onClick={() => navigate(`/${item.page}`)}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150
                                            ${currentPage === item.page 
                                                ? 'bg-sky-500 text-white' 
                                                : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
                            >
                                <item.icon size={18} className="inline mr-2" />
                                {item.name}
                            </button>
                        ))}
                        <div className="text-slate-400 text-sm ml-4 border-l border-slate-700 pl-4">
                            {userEmail || "Usuario"}
                        </div>
                        <button
                            onClick={onLogout}
                            className="ml-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 flex items-center"
                        >
                            <LogOut size={18} className="mr-2" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
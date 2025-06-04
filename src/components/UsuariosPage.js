import React, { useEffect, useState } from 'react';
import { apiConsultarUsuarios } from '../api/auth';

const UsuariosPage = ({ setNotification }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const data = await apiConsultarUsuarios(token);
                setUsuarios(data.usuarios || []);
            } catch (e) {
                setNotification('Error al cargar usuarios', 'error');
            }
            setLoading(false);
        };
        fetchUsuarios();
    }, [setNotification]);

    if (loading) return <div className="p-8">Cargando usuarios...</div>;

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4 text-sky-400">Usuarios</h2>
            <ul className="space-y-2">
                {usuarios.map((u) => (
                    <li key={u._id} className="bg-slate-700 p-4 rounded flex justify-between items-center">
                        <span>{u.nombre} ({u.correo})</span>
                        <span className="text-xs text-slate-400">{u.rol}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UsuariosPage;
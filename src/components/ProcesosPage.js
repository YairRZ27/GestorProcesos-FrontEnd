import React, { useEffect, useState } from 'react';
import {
    apiConsultarProcesos,
    apiCrearProceso,
    apiCambiarEstadoProceso,
    apiEliminarProceso,
    apiConsultarProcesosPorPrioridad
} from '../api/auth';

const ProcesosPage = ({ setNotification }) => {
    const [procesos, setProcesos] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEstadoModal, setShowEstadoModal] = useState(false);
    const [procesoSeleccionado, setProcesoSeleccionado] = useState(null);
    const [nuevoEstado, setNuevoEstado] = useState('');
    const [nuevoProceso, setNuevoProceso] = useState({
        nombre: '',
        descripcion: '',
        prioridad: '',
        idSolicitud: '',
        fechaRegistro: ''
    });

    const fetchProcesos = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const data = await apiConsultarProcesos(token);
            setProcesos(data.procesos || []);
            setMensaje(data.mensaje || '');
            if (data.estatus === "ERROR") {
                setNotification(data.mensaje || 'Error al cargar procesos', 'error');
            }
        } catch (e) {
            setNotification('Error al cargar procesos', 'error');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProcesos();
        // eslint-disable-next-line
    }, [setNotification]);

    const handleOrdenarPorPrioridad = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const data = await apiConsultarProcesosPorPrioridad(token);
            setProcesos(data.procesos || []);
            setMensaje(data.mensaje || '');
        } catch (e) {
            setNotification('Error al ordenar procesos', 'error');
        }
        setLoading(false);
    };

    const handleAgregarProceso = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            await apiCrearProceso(nuevoProceso, token);
            setNotification('Proceso creado correctamente', 'success');
            setShowAddModal(false);
            setNuevoProceso({
                nombre: '',
                descripcion: '',
                prioridad: '',
                idSolicitud: '',
                fechaRegistro: ''
            });
            fetchProcesos();
        } catch (e) {
            setNotification(e.message || 'Error al crear proceso', 'error');
        }
    };

    const handleEliminar = async (idProceso) => {
        if (!window.confirm('¿Seguro que deseas eliminar este proceso?')) return;
        try {
            const token = localStorage.getItem('authToken');
            // Usa _id o idProceso según cuál exista
            await apiEliminarProceso(idProceso, token);
            setNotification('Proceso eliminado', 'success');
            fetchProcesos();
        } catch (e) {
            setNotification(e.message || 'Error al eliminar proceso', 'error');
        }
    };

    const handleAbrirEstadoModal = (proceso) => {
        setProcesoSeleccionado(proceso);
        setNuevoEstado('');
        setShowEstadoModal(true);
    };

    const handleCambiarEstado = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            // Usa _id o idProceso según cuál exista
            const id = procesoSeleccionado._id || procesoSeleccionado.idProceso;
            await apiCambiarEstadoProceso(
                id,
                { 
                    nuevoEstado
                },
                token
            );
            setNotification('Estado cambiado correctamente', 'success');
            setShowEstadoModal(false);
            fetchProcesos();
        } catch (e) {
            setNotification(e.message || 'Error al cambiar estado', 'error');
        }
    };

    if (loading) return <div className="p-8">Cargando procesos...</div>;

    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <h2 className="text-2xl font-bold text-sky-400">Procesos</h2>
                <div className="flex gap-2">
                    <button
                        className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded"
                        onClick={() => setShowAddModal(true)}
                    >
                        Agregar Proceso
                    </button>
                    <button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
                        onClick={handleOrdenarPorPrioridad}
                    >
                        Ordenar por prioridad
                    </button>
                </div>
            </div>
            {mensaje && (
                <div className="mb-4 text-slate-300">{mensaje}</div>
            )}
            <ul className="space-y-2">
                {procesos.length === 0 ? (
                    <li className="text-slate-400">No hay procesos registrados.</li>
                ) : (
                    procesos.map((p) => (
                        <li key={p._id || p.idProceso} className="bg-slate-700 p-4 rounded flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <span className="font-semibold text-lg">{p.nombre || p.titulo || p.idProceso || 'Sin nombre'}</span>
                                <div className="text-slate-100 text-sm mt-1">
                                    <span className="font-semibold text-sky-300">ID:</span> <span className="text-white">{p.idProceso}</span>
                                    {p.prioridad && (
                                        <span className="ml-4">
                                            <span className="font-semibold text-sky-300">Prioridad:</span> <span className="text-white">{p.prioridad}</span>
                                        </span>
                                    )}
                                    {p.estatus && (
                                        <span className="ml-4">
                                            <span className="font-semibold text-sky-300">Estatus:</span> <span className="text-white">{p.estatus}</span>
                                        </span>
                                    )}
                                    {p.idSolicitud && (
                                        <span className="ml-4">
                                            <span className="font-semibold text-sky-300">Solicitud:</span> <span className="text-white">{p.idSolicitud}</span>
                                        </span>
                                    )}
                                    {p.descripcion && (
                                        <div className="mt-1">
                                            <span className="font-semibold text-sky-300">Descripción:</span> <span className="text-white">{p.descripcion}</span>
                                        </div>
                                    )}
                                    {p.fechaRegistro && (
                                        <div>
                                            <span className="font-semibold text-sky-300">Fecha:</span>{' '}
                                            <span className="text-white">
                                                {new Date(p.fechaRegistro).toLocaleString('es-MX', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2 mt-2 md:mt-0">
                                <button
                                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded"
                                    onClick={() => handleAbrirEstadoModal(p)}
                                >
                                    Cambiar estado
                                </button>
                                <button
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                    onClick={() => handleEliminar(p._id || p.idProceso)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    ))
                )}
            </ul>

            {/* Modal Agregar */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <form
                        className="bg-slate-800 p-6 rounded shadow-lg w-full max-w-md"
                        onSubmit={handleAgregarProceso}
                    >
                        <h3 className="text-xl font-bold mb-4 text-sky-300">Agregar Proceso</h3>
                        <input
                            className="w-full mb-2 p-2 rounded bg-slate-700 text-white"
                            placeholder="Nombre"
                            value={nuevoProceso.nombre}
                            onChange={e => setNuevoProceso({ ...nuevoProceso, nombre: e.target.value })}
                            required
                        />
                        <input
                            className="w-full mb-2 p-2 rounded bg-slate-700 text-white"
                            placeholder="Descripción"
                            value={nuevoProceso.descripcion}
                            onChange={e => setNuevoProceso({ ...nuevoProceso, descripcion: e.target.value })}
                            required
                        />
                        <input
                            className="w-full mb-2 p-2 rounded bg-slate-700 text-white"
                            placeholder="Prioridad (Urgente, Cumplimiento, Auditoría)"
                            value={nuevoProceso.prioridad}
                            onChange={e => setNuevoProceso({ ...nuevoProceso, prioridad: e.target.value })}
                            required
                        />
                        <input
                            className="w-full mb-2 p-2 rounded bg-slate-700 text-white"
                            placeholder="ID Solicitud"
                            value={nuevoProceso.idSolicitud}
                            onChange={e => setNuevoProceso({ ...nuevoProceso, idSolicitud: e.target.value })}
                            required
                        />
                        <input
                            type="date"
                            className="w-full mb-4 p-2 rounded bg-slate-700 text-white"
                            placeholder="Fecha de registro"
                            value={nuevoProceso.fechaRegistro}
                            onChange={e => setNuevoProceso({ ...nuevoProceso, fechaRegistro: e.target.value })}
                            required
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                className="px-4 py-2 rounded bg-slate-600 text-white"
                                onClick={() => setShowAddModal(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 rounded bg-sky-600 text-white"
                            >
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Modal Cambiar Estado */}
            {showEstadoModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <form
                        className="bg-slate-800 p-6 rounded shadow-lg w-full max-w-md"
                        onSubmit={handleCambiarEstado}
                    >
                        <h3 className="text-xl font-bold mb-4 text-sky-300">Cambiar Estado</h3>
                        <select
                            className="w-full mb-4 p-2 rounded bg-slate-700 text-white"
                            value={nuevoEstado}
                            onChange={e => setNuevoEstado(e.target.value)}
                            required
                        >
                            <option value="">Selecciona un estado</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="En Proceso">En Proceso</option>
                            <option value="Finalizado">Finalizado</option>
                        </select>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                className="px-4 py-2 rounded bg-slate-600 text-white"
                                onClick={() => setShowEstadoModal(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 rounded bg-yellow-600 text-white"
                            >
                                Cambiar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ProcesosPage;
import React, { useEffect, useState } from 'react';
import {
    apiConsultarSolicitudes,
    apiCrearSolicitud,
    apiEliminarSolicitud,
    apiCambiarEstadoSolicitud,
    apiAprobarSolicitud
} from '../api/auth';

const SolicitudesPage = ({ setNotification }) => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEstadoModal, setShowEstadoModal] = useState(false);
    const [showAprobarModal, setShowAprobarModal] = useState(false);
    const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
    const [nuevoEstado, setNuevoEstado] = useState('');
    const [nuevaSolicitud, setNuevaSolicitud] = useState({
        descripcion: '',
        tipoArea: '',
        responsableSeguimiento: '',
        fechaCreacion: '',
        fechaEstimacion: ''
    });
    const [aprobacion, setAprobacion] = useState({
        aprobadoPor: '',
        fechaAprobacion: ''
    });
    const [userRol, setUserRol] = useState('');

    // Obtener el rol del usuario autenticado
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userProfile') || '{}');
        setUserRol((user.rol || '').toLowerCase());
    }, []);

    const fetchSolicitudes = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const data = await apiConsultarSolicitudes(token);
            setSolicitudes(data.solicitudes || []);
            setMensaje(data.mensaje || '');
            if (data.estatus === "ERROR") {
                setNotification(data.mensaje || 'Error al cargar solicitudes', 'error');
            }
        } catch (e) {
            setNotification('Error al cargar solicitudes', 'error');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSolicitudes();
        // eslint-disable-next-line
    }, [setNotification]);

    const handleAgregar = () => setShowAddModal(true);

    const handleAgregarSolicitud = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const solicitud = {
                ...nuevaSolicitud,
                fechaCreacion: new Date(nuevaSolicitud.fechaCreacion).toISOString(),
                fechaEstimacion: new Date(nuevaSolicitud.fechaEstimacion).toISOString()
            };
            const res = await apiCrearSolicitud(solicitud, token);
            if (res.estatus === "OK") {
                setNotification(res.mensaje || 'Solicitud agregada correctamente', 'success');
                setShowAddModal(false);
                setNuevaSolicitud({
                    descripcion: '',
                    tipoArea: '',
                    responsableSeguimiento: '',
                    fechaCreacion: '',
                    fechaEstimacion: ''
                });
                fetchSolicitudes();
            } else {
                setNotification(res.mensaje || 'No se pudo agregar la solicitud', 'error');
            }
        } catch (e) {
            setNotification('Error al agregar solicitud', 'error');
        }
    };

    const handleEliminar = async (idSolicitud) => {
        if (!window.confirm('¿Seguro que deseas eliminar esta solicitud?')) return;
        try {
            const token = localStorage.getItem('authToken');
            const res = await apiEliminarSolicitud(idSolicitud, token);
            if (res.estatus === "OK") {
                setNotification(res.mensaje || 'Solicitud eliminada correctamente', 'success');
                fetchSolicitudes();
            } else {
                setNotification(res.mensaje || 'No se pudo eliminar la solicitud', 'error');
            }
        } catch (e) {
            setNotification('Error al eliminar solicitud', 'error');
        }
    };

    const handleAbrirEstadoModal = (solicitud) => {
        setSolicitudSeleccionada(solicitud);
        setNuevoEstado('');
        setShowEstadoModal(true);
    };

    const handleCambiarEstado = async (e) => {
        e.preventDefault();
        if (!nuevoEstado) {
            setNotification('Selecciona un estado', 'warning');
            return;
        }
        try {
            const token = localStorage.getItem('authToken');
            const cambio = { nuevoEstado };
            const res = await apiCambiarEstadoSolicitud(solicitudSeleccionada.idSolicitud, cambio, token);
            if (res.estatus === "OK") {
                setNotification(res.mensaje || 'Estado cambiado correctamente', 'success');
                setShowEstadoModal(false);
                fetchSolicitudes();
            } else {
                setNotification(res.mensaje || 'No se pudo cambiar el estado', 'error');
            }
        } catch (e) {
            setNotification('Error al cambiar estado', 'error');
        }
    };

    // APROBAR
    const handleAbrirAprobarModal = (solicitud) => {
        setSolicitudSeleccionada(solicitud);
        setAprobacion({
            aprobadoPor: '',
            fechaAprobacion: new Date().toISOString().slice(0, 16)
        });
        setShowAprobarModal(true);
    };

    const handleAprobarSolicitud = async (e) => {
        e.preventDefault();
        if (!aprobacion.aprobadoPor || !aprobacion.fechaAprobacion) {
            setNotification('Completa todos los campos de aprobación', 'warning');
            return;
        }
        try {
            const token = localStorage.getItem('authToken');
            const res = await apiAprobarSolicitud(
                solicitudSeleccionada.idSolicitud,
                {
                    aprobadoPor: aprobacion.aprobadoPor,
                    fechaAprobacion: new Date(aprobacion.fechaAprobacion).toISOString()
                },
                token
            );
            if (res.estatus === "OK") {
                setNotification(res.mensaje || 'Solicitud aprobada correctamente', 'success');
                setShowAprobarModal(false);
                fetchSolicitudes();
            } else {
                setNotification(res.mensaje || 'No se pudo aprobar la solicitud', 'error');
            }
        } catch (e) {
            setNotification('Error al aprobar solicitud', 'error');
        }
    };

    if (loading) return <div className="p-8">Cargando solicitudes...</div>;

    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <h2 className="text-2xl font-bold text-sky-400">Solicitudes</h2>
                <button
                    className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded"
                    onClick={handleAgregar}
                >
                    Agregar Solicitud
                </button>
            </div>
            {mensaje && (
                <div className="mb-4 text-slate-300">{mensaje}</div>
            )}
            <ul className="space-y-2">
                {solicitudes.length === 0 ? (
                    <li className="text-slate-400">No hay solicitudes registradas.</li>
                ) : (
                    solicitudes.map((s) => (
                        <li key={s.idSolicitud || s._id || s.folio} className="bg-slate-700 p-4 rounded flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <span className="font-semibold text-lg">{s.folio || s.idSolicitud || 'Sin folio'}</span>
                                <div className="text-slate-100 text-sm mt-1">
                                    <span className="font-semibold text-sky-300">Descripción:</span> <span className="text-white">{s.descripcion}</span>
                                    <span className="ml-4 font-semibold text-sky-300">Tipo de Área:</span> <span className="text-white">{s.tipoArea}</span>
                                    <span className="ml-4 font-semibold text-sky-300">Responsable:</span> <span className="text-white">{s.responsableSeguimiento}</span>
                                    <div className="mt-1">
                                        <span className="font-semibold text-sky-300">Fecha de Creación:</span>{' '}
                                        <span className="text-white">
                                            {s.fechaCreacion ? new Date(s.fechaCreacion).toLocaleString('es-MX') : ''}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-sky-300">Fecha Estimada:</span>{' '}
                                        <span className="text-white">
                                            {s.fechaEstimacion ? new Date(s.fechaEstimacion).toLocaleString('es-MX') : ''}
                                        </span>
                                    </div>
                                    <span className="ml-4 font-semibold text-sky-300">Estatus:</span> <span className="text-white">{s.estatus}</span>
                                    <div>
                                        <span className="font-semibold text-sky-300">Fecha Aprobación:</span>{' '}
                                        <span className="text-white">
                                            {s.fechaAprobacion ? new Date(s.fechaAprobacion).toLocaleString('es-MX') : 'No aplica'}
                                        </span>
                                    </div>
                                    <span className="ml-4 font-semibold text-sky-300">Retroalimentación:</span> <span className="text-white">{s.retroAlimentacion || 'No aplica'}</span>
                                    <span className="ml-4 font-semibold text-sky-300">Aprobado Por:</span> <span className="text-white">{s.aprobadoPor || 'No aplica'}</span>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-2 md:mt-0">
                                <button
                                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded"
                                    onClick={() => handleAbrirEstadoModal(s)}
                                >
                                    Cambiar estado
                                </button>
                                {userRol === 'admin' && (
                                    <button
                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                                        onClick={() => handleAbrirAprobarModal(s)}
                                    >
                                        Aprobar
                                    </button>
                                )}
                                <button
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                    onClick={() => handleEliminar(s.idSolicitud)}
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
                        onSubmit={handleAgregarSolicitud}
                    >
                        <h3 className="text-xl font-bold mb-4 text-sky-300">Agregar Solicitud</h3>
                        <input
                            className="w-full mb-2 p-2 rounded bg-slate-700 text-white"
                            placeholder="Descripción"
                            value={nuevaSolicitud.descripcion}
                            onChange={e => setNuevaSolicitud({ ...nuevaSolicitud, descripcion: e.target.value })}
                            required
                        />
                        <input
                            className="w-full mb-2 p-2 rounded bg-slate-700 text-white"
                            placeholder="Tipo de Área"
                            value={nuevaSolicitud.tipoArea}
                            onChange={e => setNuevaSolicitud({ ...nuevaSolicitud, tipoArea: e.target.value })}
                            required
                        />
                        <input
                            className="w-full mb-2 p-2 rounded bg-slate-700 text-white"
                            placeholder="Responsable Seguimiento"
                            value={nuevaSolicitud.responsableSeguimiento}
                            onChange={e => setNuevaSolicitud({ ...nuevaSolicitud, responsableSeguimiento: e.target.value })}
                            required
                        />
                        <label className="block text-slate-300 mb-1 mt-2">Fecha de Creación</label>
                        <input
                            type="datetime-local"
                            className="w-full mb-2 p-2 rounded bg-slate-700 text-white"
                            value={nuevaSolicitud.fechaCreacion}
                            onChange={e => setNuevaSolicitud({ ...nuevaSolicitud, fechaCreacion: e.target.value })}
                            required
                        />
                        <label className="block text-slate-300 mb-1 mt-2">Fecha Estimada</label>
                        <input
                            type="datetime-local"
                            className="w-full mb-4 p-2 rounded bg-slate-700 text-white"
                            value={nuevaSolicitud.fechaEstimacion}
                            onChange={e => setNuevaSolicitud({ ...nuevaSolicitud, fechaEstimacion: e.target.value })}
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
                            <option value="Finalizada">Finalizada</option>
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

            {/* Modal Aprobar */}
            {showAprobarModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <form
                        className="bg-slate-800 p-6 rounded shadow-lg w-full max-w-md"
                        onSubmit={handleAprobarSolicitud}
                    >
                        <h3 className="text-xl font-bold mb-4 text-green-300">Aprobar Solicitud</h3>
                        <input
                            className="w-full mb-2 p-2 rounded bg-slate-700 text-white"
                            placeholder="Aprobado por"
                            value={aprobacion.aprobadoPor}
                            onChange={e => setAprobacion({ ...aprobacion, aprobadoPor: e.target.value })}
                            required
                        />
                        <label className="block text-slate-300 mb-1 mt-2">Fecha de Aprobación</label>
                        <input
                            type="datetime-local"
                            className="w-full mb-4 p-2 rounded bg-slate-700 text-white"
                            value={aprobacion.fechaAprobacion}
                            onChange={e => setAprobacion({ ...aprobacion, fechaAprobacion: e.target.value })}
                            required
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                className="px-4 py-2 rounded bg-slate-600 text-white"
                                onClick={() => setShowAprobarModal(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 rounded bg-green-600 text-white"
                            >
                                Aprobar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default SolicitudesPage;
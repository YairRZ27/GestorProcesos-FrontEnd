const API_BASE_URL = 'http://localhost:8001'; // Usar la URL base real del backend

export async function apiLogin(email, password) {
    const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + btoa(`${email}:${password}`),
        },
    });

    let user;
    try {
        user = await response.json();
    } catch {
        user = {};
    }

    if (!response.ok) {
        throw new Error(user.mensaje || user.detail || `Error ${response.status}`);
    }

    if (!user || !user.usuario || !user.usuario._id) {
        throw new Error('Credenciales incorrectas');
    }

    localStorage.setItem('userId', user.usuario._id);
    localStorage.setItem('authToken', btoa(`${email}:${password}`));
    // Guarda el perfil de usuario con nombre y rol
    localStorage.setItem('userProfile', JSON.stringify({
        nombre: user.usuario.nombre,
        rol: (user.usuario.rol || '').toLowerCase()
    }));
    return user.usuario;
}

// Registro: crea usuario nuevo
export async function apiRegister(email, password) {
    const response = await fetch(`${API_BASE_URL}/usuarios/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nombre: email.split('@')[0],
            correo: email,
            password: password,
            estatus: true,
            rol: 'general'
        }),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Error de red o respuesta no JSON' }));
        throw new Error(errorData.detail || `Error ${response.status}`);
    }
    return response.json();
}

export async function apiGetUserProfile(token) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        throw new Error('No hay usuario autenticado');
    }

    const response = await fetch(`${API_BASE_URL}/usuarios/${userId}/`, {
        headers: {
            'Authorization': 'Basic ' + token, // Correcto: usa el token pasado como argumento
        },
    });

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
            throw new Error('Sesión inválida o expirada.');
        }
        const errorData = await response.json().catch(() => ({ detail: 'Error de red o respuesta no JSON' }));
        throw new Error(errorData.detail || `Error ${response.status}`);
    }
    return response.json();
}


export async function apiCrearProceso(proceso, token) {
    const response = await fetch(`${API_BASE_URL}/procesos/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + token,
        },
        body: JSON.stringify(proceso),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

// Consultar todos los procesos
export async function apiConsultarProcesos(token) {
    const response = await fetch(`${API_BASE_URL}/procesos/`, {
        headers: { 'Authorization': 'Basic ' + token },
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

// Consultar procesos por prioridad
export async function apiConsultarProcesosPorPrioridad(token) {
    const response = await fetch(`${API_BASE_URL}/procesos/prioridad/`, {
        headers: { 'Authorization': 'Basic ' + token },
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

// Consultar proceso individual
export async function apiConsultarProceso(idProceso, token) {
    const response = await fetch(`${API_BASE_URL}/procesos/${idProceso}/`, {
        headers: { 'Authorization': 'Basic ' + token },
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

// Cambiar estado de proceso
export async function apiCambiarEstadoProceso(idProceso, cambio, token) {
    if (!idProceso) throw new Error('ID de proceso inválido');
    const response = await fetch(`${API_BASE_URL}/procesos/${idProceso}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + token,
        },
        body: JSON.stringify(cambio),
    });
    if (!response.ok) {
        throw new Error('Error al cambiar estado');
    }
    return await response.json();
}

// Eliminar proceso
export async function apiEliminarProceso(idProceso, token) {
    const response = await fetch(`${API_BASE_URL}/procesos/${idProceso}/`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Basic ' + token },
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

// ==================== SOLICITUDES ====================

// Crear solicitud
export async function apiCrearSolicitud(solicitud, token) {
    const response = await fetch(`${API_BASE_URL}/solicitudes/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + token,
        },
        body: JSON.stringify(solicitud),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

// Consultar todas las solicitudes
export async function apiConsultarSolicitudes(token) {
    const response = await fetch(`${API_BASE_URL}/solicitudes/`, {
        headers: { 'Authorization': 'Basic ' + token },
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

// Consultar solicitud individual
export async function apiConsultarSolicitud(idSolicitud, token) {
    const response = await fetch(`${API_BASE_URL}/solicitudes/${idSolicitud}/`, {
        headers: { 'Authorization': 'Basic ' + token },
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

// Cambiar estado de solicitud
export async function apiCambiarEstadoSolicitud(idSolicitud, cambio, token) {
    const response = await fetch(`${API_BASE_URL}/solicitudes/${idSolicitud}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + token,
        },
        body: JSON.stringify(cambio),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

// Eliminar solicitud
export async function apiEliminarSolicitud(idSolicitud, token) {
    const response = await fetch(`${API_BASE_URL}/solicitudes/${idSolicitud}/`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Basic ' + token },
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

// Aprobar solicitud
export async function apiAprobarSolicitud(idSolicitud, aprobacion, token) {
    const response = await fetch(`${API_BASE_URL}/solicitudes/${idSolicitud}/aprobar`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + token,
        },
        body: JSON.stringify(aprobacion),
    });
    if (!response.ok) return response.json();
    return response.json();
}

// ==================== USUARIOS ====================

// Consultar todos los usuarios
export async function apiConsultarUsuarios(token) {
    const response = await fetch(`${API_BASE_URL}/usuarios/`, {
        headers: { 'Authorization': 'Basic ' + token },
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

// Consultar usuario individual
export async function apiConsultarUsuario(idUsuario, token) {
    const response = await fetch(`${API_BASE_URL}/usuarios/${idUsuario}/`, {
        headers: { 'Authorization': 'Basic ' + token },
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

// Cambiar password
export async function apiCambiarPassword(idUsuario, cambioPassword, token) {
    const response = await fetch(`${API_BASE_URL}/usuarios/${idUsuario}/cambiarPassword`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + token,
        },
        body: JSON.stringify(cambioPassword),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

// Cambiar correo
export async function apiCambiarCorreo(idUsuario, cambioCorreo, token) {
    const response = await fetch(`${API_BASE_URL}/usuarios/${idUsuario}/cambiarCorreo`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + token,
        },
        body: JSON.stringify(cambioCorreo),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}
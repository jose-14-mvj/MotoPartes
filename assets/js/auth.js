// ==========================================================================
// auth.js — Sincronizado con RolSeeder (1=Admin, 2=Cliente, 3=Vendedor)
// Usa sessionStorage — sin persistencia entre pestañas/sesiones
// ==========================================================================

function getToken() {
    return sessionStorage.getItem('token');
}

function obtenerToken() {
    return sessionStorage.getItem('token');
}

function getUsuario() {
    const usuario = sessionStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
}

function obtenerUsuario() {
    return getUsuario();
}

function guardarSesion(token, usuario) {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('usuario', JSON.stringify(usuario));
}

function estaLogueado() {
    return getToken() !== null && getUsuario() !== null;
}

function cerrarSesion() {
    const token = getToken();
    if (token) {
        fetch('http://localhost:8000/api/logout', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        }).catch(() => {});
    }
    sessionStorage.clear();

    const esSubcarpeta = window.location.pathname.includes('/pages/');
    window.location.href = esSubcarpeta ? '../../login.html' : 'login.html';
}

function verificarSesion() {
    const token = getToken();
    if (!token) {
        const esSubcarpeta = window.location.pathname.includes('/pages/');
        window.location.href = esSubcarpeta ? '../../login.html' : 'login.html';
    }
}

function verificarRol(rolRequerido) {
    const token = getToken();
    const esSubcarpeta = window.location.pathname.includes('/pages/');
    const rutaLogin = esSubcarpeta ? '../../login.html' : 'login.html';

    if (!token) {
        window.location.href = rutaLogin;
        return;
    }

    const usuario = getUsuario();
    if (!usuario || parseInt(usuario.rol_id) !== parseInt(rolRequerido)) {
        sessionStorage.clear();
        window.location.href = rutaLogin;
    }
}

function redirigirSegunRol(rol_id) {
    const esSubcarpeta = window.location.pathname.includes('/pages/');
    const prefijo = esSubcarpeta ? '../../' : '';
    const idLimpio = parseInt(rol_id);

    switch (idLimpio) {
        case 1:
            window.location.href = prefijo + 'pages/admin/dashboard.html';
            break;
        case 2:
            window.location.href = prefijo + 'index.html';
            break;
        case 3:
            window.location.href = prefijo + 'pages/vendedor/vendedor-dashboard.html';
            break;
        default:
            sessionStorage.clear();
            window.location.href = esSubcarpeta ? '../../login.html' : 'login.html';
            break;
    }
}

function redirigirSiYaEstaLogueado() {
    const token = getToken();
    const usuario = getUsuario();
    if (token && usuario && usuario.rol_id) {
        redirigirSegunRol(usuario.rol_id);
    }
}

async function login(email, password) {
    const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
        return data;
    } else {
        throw new Error(data.message || 'Error en el login');
    }
}

async function manejarLogin(evento) {
    evento.preventDefault();

    const email     = document.getElementById('email').value.trim();
    const password  = document.getElementById('password').value.trim();
    const btnLogin  = document.getElementById('btn-login');
    const errorDiv  = document.getElementById('error-mensaje');

    if (errorDiv) errorDiv.classList.add('d-none');
    btnLogin.disabled = true;
    btnLogin.textContent = 'Ingresando...';

    sessionStorage.clear();

    try {
        const respuesta = await login(email, password);

        if (respuesta && respuesta.token && respuesta.user) {
            guardarSesion(respuesta.token, respuesta.user);
            redirigirSegunRol(respuesta.user.rol_id);
        } else {
            if (errorDiv) {
                errorDiv.querySelector('span') 
                    ? errorDiv.querySelector('span').textContent = 'Credenciales incorrectas.'
                    : errorDiv.textContent = 'Credenciales incorrectas.';
                errorDiv.classList.remove('d-none');
            }
        }
    } catch (error) {
        sessionStorage.clear();
        if (errorDiv) {
            errorDiv.querySelector('span')
                ? errorDiv.querySelector('span').textContent = 'Error de credenciales o conexión con el servidor.'
                : errorDiv.textContent = 'Error de credenciales o conexión con el servidor.';
            errorDiv.classList.remove('d-none');
        }
    } finally {
        btnLogin.disabled = false;
        btnLogin.innerHTML = '<i class="bi bi-box-arrow-in-right me-2"></i> Ingresar al Sistema';
    }
}
const API_URL = 'http://localhost:8000/api';

// ------------------------------------------------------------
// Función maestra de peticiones fetch
// ------------------------------------------------------------
async function request(endpoint, metodo = 'GET', body = null, esFormData = false) {
    const headers = { 'Accept': 'application/json' };

    if (typeof getToken === 'function' && getToken()) {
        headers['Authorization'] = 'Bearer ' + getToken();
    } else if (localStorage.getItem('token')) {
        headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
    }

    if (!esFormData) {
        headers['Content-Type'] = 'application/json';
    }

    const opciones = {
        method: metodo,
        headers: headers,
    };

    if (body) {
        opciones.body = esFormData ? body : JSON.stringify(body);
    }

    try {
        const respuesta = await fetch(API_URL + endpoint, opciones);
        return await respuesta.json();
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error;
    }
}

// AUTENTICACIÓN
async function login(email, password) {
    return await request('/login', 'POST', { email, password });
}

// PRODUCTOS
async function getProductos() { return await request('/productos'); }
async function getProducto(id) { return await request('/productos/' + id); }
async function crearProducto(formData) { return await request('/productos', 'POST', formData, true); }
async function actualizarProducto(id, formData) {
    formData.append('_method', 'PUT');
    return await request('/productos/' + id, 'POST', formData, true);
}
async function eliminarProducto(id) { return await request('/productos/' + id, 'DELETE'); }

// PROMOCIONES
async function getPromociones() { return await request('/promociones'); }
async function getPromocion(id) { return await request('/promociones/' + id); }
async function crearPromocion(data) { return await request('/promociones', 'POST', data); }
async function actualizarPromocion(id, data) { return await request('/promociones/' + id, 'PUT', data); }
async function eliminarPromocion(id) { return await request('/promociones/' + id, 'DELETE'); }

// CATEGORÍAS Y MARCAS
async function getCategorias() { return await request('/categorias'); }
async function getMarcas() { return await request('/marcas'); }

// CARRITO
async function getCarrito() { return await request('/carritos'); }
async function agregarAlCarrito(producto_id, cantidad) { return await request('/carritos', 'POST', { producto_id, cantidad }); }
async function eliminarDelCarrito(id) { return await request('/carritos/' + id, 'DELETE'); }

// PEDIDOS
async function getPedidos() { return await request('/pedidos'); }
async function getPedido(id) { return await request('/pedidos/' + id); }
async function crearPedido() { return await request('/pedidos', 'POST'); }
async function actualizarEstadoPedido(id, estado_id) { return await request('/pedidos/' + id, 'PUT', { estado_id }); }

// USUARIOS (ADMIN) — Manteniendo ambas firmas estructurales
async function getUsuarios() { return await request('/usuarios'); }
async function getUsuario2(id) { return await request('/usuarios/' + id); }
async function crearUsuario(data) { return await request('/usuarios', 'POST', data); }
async function actualizarUsuario(id, data) { return await request('/usuarios/' + id, 'PUT', data); }
async function eliminarUsuario(id) { return await request('/usuarios/' + id, 'DELETE'); }
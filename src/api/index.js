// src/api/index.js

const BASE_URL = 'http://192.168.1.132:3000/api';

export const obtenerMesas = async () => {
    const response = await fetch(`${BASE_URL}/mesas/mesas`);
    if (!response.ok) throw new Error('Error al obtener mesas');
    return response.json();
};

export const obtenerPedidosPorMesa = async (mesaId) => {
    const response = await fetch(`${BASE_URL}/pedidos/mesa/${mesaId}`);
    if (!response.ok) throw new Error('Error al obtener pedidos');
    return response.json();
};

export const agregarPlato = async (platoData) => {
    const response = await fetch(`${BASE_URL}/platos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(platoData),
    });
    if (!response.ok) throw new Error('Error al agregar plato');
    return response.json();
};

export const modificarPlato = async (id, platoData) => {
    const response = await fetch(`${BASE_URL}/platos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(platoData),
    });
    if (!response.ok) throw new Error('Error al modificar plato');
    return response.json();
};

export const eliminarPlato = async (id) => {
    const response = await fetch(`${BASE_URL}/platos/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar plato');
    return response.json();
};

export const actualizarPedido = async (id, pedidoData) => {
    const response = await fetch(`${BASE_URL}/pedidos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedidoData),
    });
    if (!response.ok) throw new Error('Error al actualizar pedido');
    return response.json();
};

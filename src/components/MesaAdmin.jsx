// src/components/MesaAdmin.js

import React, { useEffect, useState } from 'react';
import { obtenerMesas, obtenerPedidosPorMesa } from '../api/index';


const MesaAdmin = () => {
    const [mesas, setMesas] = useState([]);
    const [pedidos, setPedidos] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMesas = async () => {
            try {
                const mesasData = await obtenerMesas();
                setMesas(mesasData);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchMesas();
    }, []);

    const manejarVerPedidos = async (mesaId) => {
        try {
            const { pedidos: pedidosData } = await obtenerPedidosPorMesa(mesaId); // Desestructurar directamente
            setPedidos((prev) => ({ ...prev, [mesaId]: pedidosData })); // Guardar solo los pedidos
        } catch (error) {
            setError(error.message);
        }
    };



    return (
        <div>
            <h1>Mesas</h1>
            {error && <p>Error: {error}</p>}
            <ul>
                {mesas.map((mesa) => (
                    <li key={mesa._id}>

                        Mesa {mesa.numero}
                        <button onClick={() => manejarVerPedidos(mesa._id)}>Ver Pedidos</button>
                        {pedidos[mesa._id] && (
                            <ul>
                                {pedidos[mesa._id].map((pedido) => (
                                    <li key={pedido._id}>
                                        
                                        <ul>
                                            {pedido.productos.map((producto) => (
                                                <li key={producto._id}>
                                                    {producto.platoId.nombre}, Cantidad: {producto.cantidad} {/* Asegúrate de acceder al nombre */}
                                                </li>
                                            ))}
                                        </ul>
                                        Total: ${pedido.total}
                                    </li>
                                ))}


                            </ul>
                        )}

                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MesaAdmin;

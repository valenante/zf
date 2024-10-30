import React, { useState, useEffect } from 'react';

const PlatosAdmin = () => {
    const [platos, setPlatos] = useState([]);
    const [nuevoPlato, setNuevoPlato] = useState({ nombre: '', descripcion: '', precios: { racion: '', tapa: '' } });
    const [modoEdicion, setModoEdicion] = useState(null);

    // Obtener todos los platos
    useEffect(() => {
        const fetchPlatos = async () => {
            try {
                const response = await fetch('http://192.168.1.132:3000/api/admin/platos');
                if (!response.ok) throw new Error('Error al obtener los platos');
                const data = await response.json();
                setPlatos(data);
            } catch (error) {
                console.error('Error al cargar los platos:', error);
            }
        };

        fetchPlatos();
    }, []);

// Función para agregar o modificar un plato
// Función para agregar o modificar un plato
const manejarSubmit = async (e) => {
    e.preventDefault();

    const url = modoEdicion
        ? `http://192.168.1.132:3000/api/admin/modificar-plato/${modoEdicion}`
        : 'http://192.168.1.132:3000/api/admin/agregar-plato';

    const method = modoEdicion ? 'PUT' : 'POST';

    // Crear el objeto del plato a enviar
    const platoParaEnviar = {
        nombre: nuevoPlato.nombre,
        descripcion: nuevoPlato.descripcion,
        precios: {}
    };

    // Solo agregar precios si están definidos y son válidos
    const racion = parseFloat(nuevoPlato.precios.racion);
    const tapa = parseFloat(nuevoPlato.precios.tapa);
    const otroPrecio = parseFloat(nuevoPlato.precios.otroPrecio); // Asegúrate de capturar este valor

    if (!isNaN(racion)) {
        platoParaEnviar.precios.racion = racion;
    }
    if (!isNaN(tapa)) {
        platoParaEnviar.precios.tapa = tapa;
    }
    if (!isNaN(otroPrecio)) { // Agregar validación para otro precio
        platoParaEnviar.precios.otroPrecio = otroPrecio;
    }

    // Si estamos en modo de edición y no hay precios, no enviar precios
    if (modoEdicion && Object.keys(platoParaEnviar.precios).length === 0) {
        delete platoParaEnviar.precios;
    }

    // Para depuración
    console.log('Plato a enviar:', platoParaEnviar); // Ver el objeto antes de enviar

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(platoParaEnviar), // Enviar el objeto de plato
        });

        if (!response.ok) throw new Error('Error al guardar el plato');
        const data = await response.json();

        // Actualizar el estado de platos
        if (modoEdicion) {
            setPlatos(platos.map(plato => (plato._id === modoEdicion ? data : plato)));
        } else {
            setPlatos([...platos, data]);
        }

        // Resetear el formulario
        setNuevoPlato({ nombre: '', descripcion: '', precios: { racion: '', tapa: '', otroPrecio: '' } });
        setModoEdicion(null);
    } catch (error) {
        console.error('Error al guardar el plato:', error);
    }
};




    // Función para eliminar un plato
    const eliminarPlato = async (id) => {
        try {
            const response = await fetch(`http://192.168.1.132:3000/api/admin/eliminar-plato/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Error al eliminar el plato');
            setPlatos(platos.filter(plato => plato._id !== id));
        } catch (error) {
            console.error('Error al eliminar el plato:', error);
        }
    };

    // Función para editar un plato
    const editarPlato = (plato) => {
        setNuevoPlato({
            nombre: plato.nombre,
            descripcion: plato.descripcion,
            precios: {
                racion: plato.precios?.racion || '', // Usar valor vacío si no existe
                tapa: plato.precios?.tapa || ''      // Usar valor vacío si no existe
            },
            precioGeneral: plato.precio || '' // Agregar precio general si existe
        });
        setModoEdicion(plato._id);
    };

    return (
        <div className="container mt-5">
            <h2>Administración de Platos</h2>

            <form onSubmit={manejarSubmit}>
                <input
                    type="text"
                    placeholder="Nombre del Plato"
                    value={nuevoPlato.nombre}
                    onChange={(e) => setNuevoPlato({ ...nuevoPlato, nombre: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Descripción del Plato"
                    value={nuevoPlato.descripcion}
                    onChange={(e) => setNuevoPlato({ ...nuevoPlato, descripcion: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Precio Ración"
                    value={nuevoPlato.precios.racion || ''} // Valor vacío si no hay ración
                    onChange={(e) => setNuevoPlato({ ...nuevoPlato, precios: { ...nuevoPlato.precios, racion: e.target.value } })}
                />
                <input
                    type="number"
                    placeholder="Precio Tapa"
                    value={nuevoPlato.precios.tapa || ''} // Valor vacío si no hay tapa
                    onChange={(e) => setNuevoPlato({ ...nuevoPlato, precios: { ...nuevoPlato.precios, tapa: e.target.value } })}
                />
                <input
                    type="number"
                    placeholder="Precio General"
                    value={nuevoPlato.precio || ''} // Valor vacío si no hay precio general
                    onChange={(e) => setNuevoPlato({ ...nuevoPlato, precioGeneral: e.target.value })}
                />
                <button type="submit" className="btn btn-primary">
                    {modoEdicion ? 'Modificar Plato' : 'Agregar Plato'}
                </button>
            </form>


            <h3 className="mt-4">Lista de Platos</h3>
            <ul className="list-group">
                {platos.map(plato => (
                    <li key={plato._id} className="list-group-item d-flex justify-content-between align-items-center">
                        {plato.nombre} -
                        {plato.precios ? (
                            <>
                                {plato.precios.racion !== undefined ? `$${plato.precios.racion} (Ración)` : 'Sin precio de ración'} /
                                {plato.precios.tapa !== undefined ? `$${plato.precios.tapa} (Tapa)` : 'Sin precio de tapa'}
                            </>
                        ) : (
                            plato.precio !== undefined ? `$${plato.precio}` : 'Sin precios disponibles'
                        )}
                        <div>
                            <button className="btn btn-warning btn-sm" onClick={() => editarPlato(plato)}>Editar</button>
                            <button className="btn btn-danger btn-sm" onClick={() => eliminarPlato(plato._id)}>Eliminar</button>
                        </div>
                    </li>
                ))}
            </ul>


        </div>
    );
};

export default PlatosAdmin;

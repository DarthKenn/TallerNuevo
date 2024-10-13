import React, { useState } from 'react';

const ListaProductos = ({ productos, eliminarProducto, editarProducto, agregarAlCarrito }) => {
  // Estado para gestionar los productos seleccionados
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  // Estado para controlar qué descripción de producto está visible
  const [descripcionVisible, setDescripcionVisible] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  // Función para alternar la selección de un producto
  const toggleSeleccion = (id) => {
    const seleccionados = [...productosSeleccionados];
    const index = seleccionados.indexOf(id);
    if (index === -1) {
      seleccionados.push(id); // Agregar a la selección si no está seleccionado
    } else {
      seleccionados.splice(index, 1); // Eliminar de la selección si ya está seleccionado
    }
    setProductosSeleccionados(seleccionados);
  };

  // Función para comprobar si un producto está seleccionado
  const Seleccionado = (id) => {
    return productosSeleccionados.includes(id);
  };

  // Función para mostrar u ocultar la descripción de un producto
  const mostrarDescripcion = (id) => {
    if (descripcionVisible === id) {
      setDescripcionVisible(null); // Ocultar si ya estaba visible
    } else {
      setDescripcionVisible(id); // Mostrar la descripción de un producto específico
    }
  };

  // Función para comprobar si la descripción de un producto está activa (visible)
  const descripcionActiva = (id) => {
    return descripcionVisible === id;
  };

  return (
    <div className="mt-4">
      <h2>Lista de Productos</h2>
      <ul className="list-group">
        {productos.map((producto) => (
          <li
            key={producto.id}
            className={`list-group-item d-flex justify-content-between align-items-center 
              ${Seleccionado(producto.id) ? 'bg-success' : ''} 
              ${producto.stock === 0 ? 'bg-danger text-white' : ''} // Fondo rojo si el stock es 0
              ${producto.stock <= 5 && producto.stock > 0 ? 'bg-warning' : ''}`} // Fondo amarillo si el stock es <= 5 y > 0
          >
            <div>
              <strong>Nombre:</strong> {producto.nombre}<br />
              <strong>Precio:</strong> ${producto.precio}<br />
              <strong>Cantidad:</strong> {producto.stock}
              {/* Mostrar el mensaje de poco stock */}
              {producto.stock === 0 ? (
                <div className="text-white">No hay stock disponible</div>
              ) : (
                producto.stock <= 5 && <div className="text-danger">Queda poco stock</div>
              )}
              {/* Mostrar la descripción solo si está activa */}
              {descripcionActiva(producto.id) && (
                <div>
                  <strong>Descripción:</strong> {producto.descripcion}
                </div>
              )}
            </div>

            <div className="d-flex align-items-center">
              {/* Botón para alternar la visibilidad de la descripción */}
              <button className="btn btn-info btn-sm me-2" onClick={() => mostrarDescripcion(producto.id)}>
                {descripcionActiva(producto.id) ? 'Cerrar Descripción' : 'Ver Descripción'}
              </button>
              {/* Botón para editar el producto */}
              <button className="btn btn-primary btn-sm me-2" onClick={() => editarProducto(producto.id)}>
                Editar
              </button>
              {/* Botón para eliminar el producto */}
              <button className="btn btn-danger btn-sm" onClick={() => eliminarProducto(producto.id)}>
                Eliminar
              </button>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Cantidad"
                  min="1"
                  max={producto.stock}
                  onChange={(e) => setCantidad(parseInt(e.target.value))}
                  disabled={producto.stock === 0} // Deshabilitar si no hay stock
                />
                <button className="btn btn-success btn-sm ms-2" onClick={() => agregarAlCarrito(producto, cantidad)} disabled={producto.stock === 0}>
                  Agregar al Carrito
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaProductos;



























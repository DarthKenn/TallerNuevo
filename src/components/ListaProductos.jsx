import React, { useState } from 'react';

const ListaProductos = ({ productos, eliminarProducto, editarProducto, }) => {
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [descripcionVisible, setDescripcionVisible] = useState(null);

  const toggleSeleccion = (id) => {
    const seleccionados = [...productosSeleccionados];
    const index = seleccionados.indexOf(id);
    if (index === -1) {
      seleccionados.push(id);
    } else {
      seleccionados.splice(index, 1);
    }
    setProductosSeleccionados(seleccionados);
  };

  const Seleccionado = (id) => {
    return productosSeleccionados.includes(id);
  };

  const mostrarDescripcion = (id) => {
    if (descripcionVisible === id) {
      setDescripcionVisible(null);
    } else {
      setDescripcionVisible(id);
    }
  };

  const descripcionActiva = (id) => {
    return descripcionVisible === id;
  };

  return (
    <div className="mt-4">
      <h2>Lista de Productos</h2>
      <ul className="list-group">
        {productos.map((producto) => (
          <li key={producto.id} className={`list-group-item d-flex justify-content-between align-items-center ${Seleccionado(producto.id) ? 'bg-success' : ''}`}>
            <div>
              <strong>Nombre:</strong> {producto.nombre}<br />
              <strong>Precio:</strong> ${producto.precio}<br />
              <strong>Categoría:</strong> {producto.categoria}
              {descripcionActiva(producto.id) && (
                <div>
                  <strong>Descripción:</strong> {producto.descripcion}
                </div>
              )}
            </div>
            <div className="d-flex align-items-center">
              <button className="btn btn-info btn-sm me-2" onClick={() => mostrarDescripcion(producto.id)}>
                {descripcionActiva(producto.id) ? 'Cerrar Descripción' : 'Ver Descripción'}
              </button>
              <button className="btn btn-primary btn-sm me-2" onClick={() => editarProducto(producto.id)}>Editar</button>
              <button className="btn btn-danger btn-sm" onClick={() => eliminarProducto(producto.id)}>Eliminar</button>
              <input
                type="checkbox"
                checked={Seleccionado(producto.id)}
                onChange={() => toggleSeleccion(producto.id)}
                className="form-check-input ms-2"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaProductos;


























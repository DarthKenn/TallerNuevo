import React, { useState } from 'react';

const ListaProductos = ({ productos, eliminarProducto, editarProducto, agregarAlCarrito }) => {
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

  const calcularTotalSeleccionado = () => {
    return productos.reduce((total, producto) => {
      if (Seleccionado(producto.id)) {
        const precioNumerico = parseFloat(producto.precio);
        return total + precioNumerico;
      }
      return total;
    }, 0);
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
      <div className="mt-3">
        <h4>Carrito de Compras</h4>
        <p>Total de productos seleccionados: {productosSeleccionados.length}</p>
        <ul className="list-group">
          {productos.filter(producto => Seleccionado(producto.id)).map(producto => (
            <li key={producto.id} className="list-group-item">
              <strong>{producto.nombre}</strong> - ${producto.precio}
            </li>
          ))}
        </ul>
        <p>Total: ${calcularTotalSeleccionado()}</p>
      </div>
    </div>
  );
};

export default ListaProductos;


























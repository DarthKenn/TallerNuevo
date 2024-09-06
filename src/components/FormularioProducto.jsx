import React, { useState, useEffect } from 'react';

const FormularioProducto = ({ agregarProducto, productoEditable, cancelarEdicion }) => {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');

  const categorias = [
    "Mani",
    "Frutos Secos",
    "Dulces"
  ];

  useEffect(() => {
    if (productoEditable) {
      setNombre(productoEditable.nombre);
      setCategoria(productoEditable.categoria);
      setPrecio(productoEditable.precio);
      setDescripcion(productoEditable.descripcion);
    } else {
      setNombre('');
      setCategoria('');
      setPrecio('');
      setDescripcion('');
    }
  }, [productoEditable]);

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (!nombre || !categoria || !precio || precio <= 0 || !descripcion) {
      setError('Por favor, complete todos los campos correctamente.');
      return;
    }
    agregarProducto({ nombre, categoria, precio, descripcion });
    setNombre('');
    setCategoria('');
    setPrecio('');
    setDescripcion('');
    setError('');
  };


  return (
    <form onSubmit={manejarEnvio}>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <label className="form-label">Nombre del Producto</label>
        <input
          type="text"
          className="form-control"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Categoría</label>
        <select
          className="form-select"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="">Seleccione una categoría</option>
          {categorias.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Precio</label>
        <input
          type="number"
          className="form-control"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <textarea
          className="form-control"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary me-2">{productoEditable ? 'Actualizar Producto' : 'Agregar Producto'}</button>
      {productoEditable && (
        <button type="button" className="btn btn-danger" onClick={cancelarEdicion}>Cancelar</button>
      )}
      {!productoEditable && (
        <button type="button" className="btn btn-danger" onClick={cancelarEdicion}>Cancelar</button>
      )}
    </form>
  );
};

export default FormularioProducto;
















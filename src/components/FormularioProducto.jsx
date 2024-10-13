import React, { useState, useEffect } from 'react';

const FormularioProducto = ({ agregarProducto, productoEditable, cancelarEdicion, nombresDropdown, agregarNuevoNombre }) => {
  // Estados
  const [nombre, setNombre] = useState('');
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [stock, setStock] = useState('');
  const [error, setError] = useState('');
  const [modoAgregarNombre, setModoAgregarNombre] = useState(false);

  // Efecto para manejar el producto editable
  useEffect(() => {
    if (productoEditable) {
      setNombre(productoEditable.nombre);
      setPrecio(productoEditable.precio);
      setDescripcion(productoEditable.descripcion);
      setStock(productoEditable.stock);
    } else {
      setNombre('');
      setNuevoNombre('');
      setPrecio('');
      setDescripcion('');
      setStock('');
    }
  }, [productoEditable]);

  // Manejo del envío del formulario
  const manejarEnvio = (e) => {
    e.preventDefault();
    if (!nombre || !precio || precio <= 0 || !descripcion || stock <= 0) {
      setError('Por favor, complete todos los campos correctamente.');
      return;
    }

    const nombreProducto = nuevoNombre || nombre;
    agregarProducto({ nombre, nombreProducto, precio, descripcion, stock });

    // Limpiar campos después de agregar el producto
    setNombre('');
    setNuevoNombre('');
    setPrecio('');
    setStock('');
    setDescripcion('');
    setError('');
    setModoAgregarNombre(false);
  };

  // Guardar un nuevo nombre de producto
  const guardarNuevoNombre = () => {
    if (nuevoNombre.trim() === '') return;
    agregarNuevoNombre(nuevoNombre);
    setNombre(nuevoNombre);
    setNuevoNombre('');
    setModoAgregarNombre(false);
  };

  return (
    <form onSubmit={manejarEnvio}>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <label className="form-label">Nombre del Producto</label>
        <div className="input-group">
          <select
            className="form-select"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={modoAgregarNombre}
          >
            <option value="">Seleccione un producto existente</option>
            {nombresDropdown.map((nombre, index) => (
              <option key={index} value={nombre}>{nombre}</option>
            ))}
          </select>

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setModoAgregarNombre(true)}
          >
            Agregar nuevo
          </button>
        </div>

        {modoAgregarNombre && (
          <div className="mt-2">
            <input
              type="text"
              className="form-control"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              placeholder="Ingrese nuevo nombre"
            />
            <button
              type="button"
              className="btn btn-primary mt-2"
              onClick={guardarNuevoNombre}
            >
              Guardar nuevo nombre
            </button>
          </div>
        )}
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
        <label className="form-label">Cantidad (Stock)</label>
        <input
          type="number"
          className="form-control"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
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

      <button type="submit" className="btn btn-primary me-2">
        {productoEditable ? 'Actualizar Producto' : 'Agregar Producto'}
      </button>

      <button type="button" className="btn btn-danger" onClick={cancelarEdicion}>
        Cancelar
      </button>
    </form>
  );
};

export default FormularioProducto;






















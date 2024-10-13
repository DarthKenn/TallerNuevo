import React, { useState, useEffect } from 'react';
import FormularioProducto from './FormularioProducto';
import ListaProductos from './ListaProductos';

const Catalogo = () => {
  // Estados
  const [productos, setProductos] = useState([]);
  const [nombresDropdown, setNombresDropdown] = useState(() => JSON.parse(localStorage.getItem('nombresDropdown')) || []);
  const [productoEditable, setProductoEditable] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensajeVisible, setMensajeVisible] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [productosPorPag] = useState(10);
  const [busqueda, setBusqueda] = useState('');
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [ordenCampo, setOrdenCampo] = useState('nombre');
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [carrito, setCarrito] = useState(() => {
    return JSON.parse(localStorage.getItem('carrito')) || [];
  });
  const [ventas, setVentas] = useState([]);
  const [mostrarVentas, setMostrarVentas] = useState(false);



  // Cargar productos al iniciar
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('productos')) || [];
    setProductos(storedProducts);
  }, []);

  // Guardar nombres en localStorage
  useEffect(() => {
    localStorage.setItem('nombresDropdown', JSON.stringify(nombresDropdown));
  }, [nombresDropdown]);

  // Efecto de búsqueda
  useEffect(() => {
    realizarBusqueda();
  }, [busqueda]);

  // Funciones
  const realizarBusqueda = () => {
    if (busqueda.trim() === '') {
      setResultadosBusqueda([]);
      return;
    }

    const terminoMinuscula = busqueda.trim().toLowerCase();
    const resultados = productos.filter(producto =>
      producto.nombre.toLowerCase().includes(terminoMinuscula) ||
      producto.categoria.toLowerCase().includes(terminoMinuscula) ||
      producto.precio.toString().includes(terminoMinuscula)
    );

    setResultadosBusqueda(resultados);
  };

  const toggleVentas = () => {
    setMostrarVentas(!mostrarVentas);
  };

  const agregarAlCarrito = (producto, cantidad) => {
    if (cantidad > producto.stock) {
      mostrarMensajeTemporalmente('danger', 'Stock insuficiente');
      return;
    }

    const productoEnCarrito = carrito.find((item) => item.id === producto.id);
    let nuevoCarrito;

    if (productoEnCarrito) {
      // Si el producto ya está en el carrito, actualizamos la cantidad
      nuevoCarrito = carrito.map((item) =>
        item.id === producto.id
          ? { ...item, cantidad: Math.min(item.cantidad + cantidad, producto.stock) }
          : item
      );
    } else {
      // Si no está, lo agregamos con la cantidad seleccionada
      nuevoCarrito = [...carrito, { ...producto, cantidad }];
    }

    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    localStorage.setItem('carrito', JSON.stringify([]));
  };

  const finalizarCompra = () => {
    const productosActualizados = productos.map((producto) => {
      const productoEnCarrito = carrito.find((item) => item.id === producto.id);
      if (productoEnCarrito) {
        return { ...producto, stock: producto.stock - productoEnCarrito.cantidad };
      }
      return producto;
    });

    const ventaActual = {
      id: ventas.length + 1, // Generar un ID para la venta
      detalles: carrito, // Detalles del carrito
      total: calcularTotal(carrito), // Calcula el total de la venta
      fecha: new Date().toLocaleString() // Fecha y hora de la compra
    };

    setVentas([...ventas, ventaActual]); // Agregar la venta al estado
    setProductos(productosActualizados);
    localStorage.setItem('productos', JSON.stringify(productosActualizados));

    vaciarCarrito();
    mostrarMensajeTemporalmente('success', 'Compra realizada con éxito.');
  };

  const calcularTotal = (carrito) => {
    return carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
  };



  const limpiarBusqueda = () => {
    setBusqueda('');
    setResultadosBusqueda([]);
  };

  const agregarProducto = (producto) => {
    let nuevosProductos;

    if (productoEditable) {
      nuevosProductos = productos.map((prod) =>
        prod.id === productoEditable.id ? { ...producto, id: productoEditable.id } : prod
      );
      mostrarMensajeTemporalmente('success', 'Producto editado correctamente.');
    } else {
      nuevosProductos = [...productos, { ...producto, id: productos.length + 1 }];
      mostrarMensajeTemporalmente('success', 'Producto agregado correctamente.');
    }

    setProductos(nuevosProductos);
    localStorage.setItem('productos', JSON.stringify(nuevosProductos));
    setProductoEditable(null);
    setMostrarFormulario(false);
  };

  const agregarNuevoNombre = (nombre) => {
    if (!nombresDropdown.includes(nombre)) {
      setNombresDropdown([...nombresDropdown, nombre]);
    }
  };

  const eliminarProducto = (id) => {
    const nuevosProductos = productos.filter((producto) => producto.id !== id);
    setProductos(nuevosProductos);
    localStorage.setItem('productos', JSON.stringify(nuevosProductos));
  };

  const editarProducto = (id) => {
    const productoAEditar = productos.find((producto) => producto.id === id);
    setProductoEditable(productoAEditar);
    setMostrarFormulario(true);
  };

  const cancelarEdicion = () => {
    setProductoEditable(null);
    setMostrarFormulario(false);
  };

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
    setProductoEditable(null);
  };

  const mostrarMensajeTemporalmente = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setMensajeVisible(true);

    setTimeout(() => {
      setMensajeVisible(false);
    }, 4000);
  };

  const ordenarProductos = (campo) => {
    if (campo === ordenCampo) {
      setOrdenAscendente(!ordenAscendente);
    } else {
      setOrdenCampo(campo);
      setOrdenAscendente(true);
    }
  };

  // Paginación y ordenamiento
  const indexOfLastProducto = currentPage * productosPorPag;
  const indexOfFirstProducto = indexOfLastProducto - productosPorPag;
  const productosOrdenados = [...productos];

  if (ordenCampo === 'nombre') {
    productosOrdenados.sort((a, b) =>
      ordenAscendente ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre)
    );
  } else if (ordenCampo === 'categoria') {
    productosOrdenados.sort((a, b) =>
      ordenAscendente ? a.categoria.localeCompare(b.categoria) : b.categoria.localeCompare(a.categoria)
    );
  } else if (ordenCampo === 'precio') {
    productosOrdenados.sort((a, b) =>
      ordenAscendente ? a.precio - b.precio : b.precio - a.precio
    );
  }

  const productosMostrados = busqueda.trim() === '' ? productosOrdenados.slice(indexOfFirstProducto, indexOfLastProducto) : resultadosBusqueda;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <h1 className="my-4">Catálogo de Productos</h1>

      {mensajeVisible && (
        <div className={`alert alert-${mensaje.tipo}`} role="alert">
          {mensaje.texto}
          <button type="button" className="btn-close" aria-label="Close" onClick={() => setMensajeVisible(false)}></button>
        </div>
      )}

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Buscar"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <div className="btn-group">
          <button className={`btn btn-outline-primary ${ordenCampo === 'nombre' ? 'active' : ''}`} onClick={() => ordenarProductos('nombre')}>
            Nombre {ordenCampo === 'nombre' && (ordenAscendente ? '▲' : '▼')}
          </button>
          <button className={`btn btn-outline-primary ${ordenCampo === 'categoria' ? 'active' : ''}`} onClick={() => ordenarProductos('categoria')}>
            Categoría {ordenCampo === 'categoria' && (ordenAscendente ? '▲' : '▼')}
          </button>
          <button className={`btn btn-outline-primary ${ordenCampo === 'precio' ? 'active' : ''}`} onClick={() => ordenarProductos('precio')}>
            Precio {ordenCampo === 'precio' && (ordenAscendente ? '▲' : '▼')}
          </button>
        </div>
      </div>

      <div className="mb-3">
        {mostrarFormulario ? (
          <FormularioProducto
            agregarProducto={agregarProducto}
            productoEditable={productoEditable}
            cancelarEdicion={cancelarEdicion}
            nombresDropdown={nombresDropdown}
            agregarNuevoNombre={agregarNuevoNombre}
          />
        ) : (
          <button className="btn btn-primary mb-3" onClick={toggleFormulario}>Agregar Producto</button>
        )}
      </div>

      <ListaProductos
        productos={productosMostrados}
        eliminarProducto={eliminarProducto}
        editarProducto={editarProducto}
        agregarAlCarrito={agregarAlCarrito}
      />

      <nav>
        <ul className="pagination justify-content-center">
          {Array.from({ length: Math.ceil(productosOrdenados.length / productosPorPag) }, (_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button onClick={() => paginate(index + 1)} className="page-link">
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-4">
        <h3>Carrito</h3>
        {carrito.length === 0 ? (
          <p>El carrito está vacío</p>
        ) : (
          <ul className="list-group">
            {carrito.map((item) => (
              <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                {item.nombre} / ${item.precio} / Cantidad: {item.cantidad} / Total: ${item.precio * item.cantidad}
              </li>
            ))}
          </ul>
        )}
      </div>
      <h3>Total a Pagar: ${carrito.reduce((total, item) => total + item.precio * item.cantidad, 0)}</h3>
      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-success" onClick={finalizarCompra} disabled={carrito.length === 0}>
          Finalizar Compra
        </button>
        <button className="btn btn-danger" onClick={vaciarCarrito} disabled={carrito.length === 0}>
          Vaciar Carrito
        </button>
      </div>
      <h1></h1>
      <h1></h1>
      <button className="btn btn-info" onClick={toggleVentas}>
        {mostrarVentas ? 'Ocultar Ventas' : 'Ver Ventas'}
      </button>

      {mostrarVentas && (
        <div>
          <h3>Registro de Ventas</h3>
          <ul>
            {ventas.map((venta) => (
              <li key={venta.id}>
                <strong>Fecha:</strong> {venta.fecha}<br />
                <strong>Total:</strong> ${venta.total}<br />
                <strong>Detalles:</strong>
                <ul>
                  {venta.detalles.map((producto, index) => (
                    <li key={index}>{producto.nombre} - Cantidad: {producto.cantidad}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}


    </div>
  );
};

export default Catalogo;














































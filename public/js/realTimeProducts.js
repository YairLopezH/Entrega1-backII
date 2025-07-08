const socket = io();

const formulario = document.getElementById('formularioProducto');
const listaProductos = document.getElementById('listaProductos');

formulario.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(formulario);
  const nuevoProducto = {};

  formData.forEach((value, key) => {
    nuevoProducto[key] = value;
  });

  socket.emit('nuevoProducto', nuevoProducto);

  formulario.reset();
});

socket.on('actualizarProductos', (productos) => {
  listaProductos.innerHTML = '';

  productos.forEach(producto => {
    const li = document.createElement('li');
    li.id = producto._id;
    li.innerHTML = `
      ${producto.title} - $${producto.price}
      <button onclick="eliminarProducto('${producto._id}')">Eliminar</button>
      <button onclick="agregarAlCarrito('${producto._id}')">Agregar al carrito</button>
    `;
    listaProductos.appendChild(li);
  });
});

function eliminarProducto(id) {
  socket.emit('eliminarProducto', id);
}

function agregarAlCarrito(id) {
  socket.emit('agregarAlCarrito', id);
}

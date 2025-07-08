function addToCart(productId, cartId) {
  fetch(`/api/carts/${cartId}/products/${productId}`, {
    method: 'POST'
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === 'success') {
      alert('Producto agregado al carrito');
    } else {
      alert('Error al agregar el producto al carrito');
    }
  })
  .catch(e => {
    console.error(e);
    alert('Error al conectar con el servidor');
  });
}

window.addToCart = addToCart;

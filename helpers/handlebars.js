export const handlebarsHelpers = {
  subtotal: (price, quantity) => {
    return (price * quantity).toFixed(2);
  },
  total: (products) => {
    let suma = 0;
    for (const p of products) {
      suma += p.product.price * p.quantity;
    }
    return suma.toFixed(2);
  }
};

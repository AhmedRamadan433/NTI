const products = require("../data/products");
const cart = require("../data/cart");

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);

  if (!product) {
    console.log(`Product with ID ${productId} was not found.`);
    return;
  }

  const cartItem = cart.find((item) => item.id === productId);

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  console.log(`${product.name} added to cart.`);
}

module.exports = addToCart;

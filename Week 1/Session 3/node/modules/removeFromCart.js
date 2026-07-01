const cart = require("../data/cart");

function removeFromCart(productId) {
  const itemIndex = cart.findIndex((item) => item.id === productId);

  if (itemIndex === -1) {
    console.log(`Item with ID ${productId} was not found in the cart.`);
    return;
  }

  const item = cart[itemIndex];

  if (item.quantity > 1) {
    item.quantity -= 1;
    console.log(`One ${item.name} removed from cart.`);
    return;
  }

  cart.splice(itemIndex, 1);
  console.log(`${item.name} removed from cart.`);
}

module.exports = removeFromCart;

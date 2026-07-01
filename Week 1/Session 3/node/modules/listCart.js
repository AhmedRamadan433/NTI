const cart = require("../data/cart");

function listCart() {
  if (cart.length === 0) {
    console.log("cart is empty.");
    return;
  }

  console.log("Cart Items:");

  cart.forEach((item) => {
    console.log(`${item.id}. ${item.name} - ${item.price} - ${item.quantity}`);
  });
}

module.exports = listCart;

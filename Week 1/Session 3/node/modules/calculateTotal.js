const cart = require("../data/cart");

function calculateTotal() {
  const total = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  console.log(`Total: ${total}`);
  return total;
}

module.exports = calculateTotal;

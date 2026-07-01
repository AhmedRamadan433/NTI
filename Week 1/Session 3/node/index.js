const addToCart = require("./modules/addToCart");
const removeFromCart = require("./modules/removeFromCart");
const listCart = require("./modules/listCart");
const calculateTotal = require("./modules/calculateTotal");

console.log("--------------------");

addToCart(1);
addToCart(2);
addToCart(2);
addToCart(4);

console.log("");
listCart();
calculateTotal();

console.log("");
removeFromCart(2);
removeFromCart(1);

console.log("");
listCart();
calculateTotal();

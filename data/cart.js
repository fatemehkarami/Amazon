// Function to update cart data in local storage
function updateCartStorage(cart, cartQuantity, totalPrice) {
  

  localStorage.setItem('cart', JSON.stringify(cart));
  localStorage.setItem('cartQuantity', cartQuantity.toString());
  localStorage.setItem('totalPrice', totalPrice.toString());

}


// Function to retrieve cart data from local storage
function getCartFromStorage() {
  const savedCart = localStorage.getItem('cart');
  return savedCart ? JSON.parse(savedCart) : [];
}

// Function to retrieve cart quantity from local storage
function getCartQuantityFromStorage() {
  const savedCartQuantity = localStorage.getItem('cartQuantity');
  return savedCartQuantity ? Number(savedCartQuantity) : 0;
}

// Function to retrieve totalPrice data from local storage
function getTotalPriceFromStorage() {
  const savedTotalPrice = localStorage.getItem('totalPrice');
  return savedTotalPrice ? JSON.parse(savedTotalPrice) : [];
}


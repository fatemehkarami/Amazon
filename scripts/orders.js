let cart = getCartFromStorage();
let cartQuantity = getCartQuantityFromStorage();
let totalPrice = getTotalPriceFromStorage();
let cartDetails = getCartDetails(cart, products);
let packages = extractPackages(cart);


console.log(cart);
console.log(packages);


// car quantity taghir mikone fek konam 0 mishe chon cart reset mishe
//document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;

autoCheckoutHtml();





function getCartDetails (cart, products) {
  const cartDetails = [];
  cart.forEach((cartItem) => {
    const {productId, quantity, orderPlaced} = cartItem;
    const matchingProduct = products.find((product) => product.id === productId);
    if (matchingProduct) {
      const {name: productName, priceCents: productPriceCents, image: productImage} = matchingProduct;
      cartDetails.push({
        productId,
        quantity,
        productName,
        productPriceCents,
        productImage,
        orderPlaced
      });
    }
  });
  return cartDetails; 
}


function extractPackages(cart) {
  const packages = {};

  cart.forEach(item => {
    const { dayOfWeek, day, month } = item.deliveryDate;

    const deliveryDateKey = `${dayOfWeek}-${day}-${month}`;

    if (packages[deliveryDateKey]) {
      packages[deliveryDateKey].push(item);
    } else {
      packages[deliveryDateKey] = [item];
    }
  });

  return packages;
}


function autoCheckoutHtml() {
  let html = '';
  const cartDetails = getCartDetails(cart, products);
  cartDetails.forEach((cartItem) => {
    html += `
      <div class="order-container">      
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${cartItem.orderPlaced.month} ${cartItem.orderPlaced.day}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${totalPrice}</div>
            </div>
          </div>
    
          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>27cba69d-4c3d-4098-b42d-ac7fa62b7664</div>
          </div>
        </div>
    
        <div class="order-details-grid">
          <div class="product-image-container">
            <img src="${cartItem.productImage}">
          </div>
    
          <div class="product-details">
            <div class="product-name">
            ${cartItem.productName}
            </div>
            <div class="product-delivery-date">
              Arriving on: August 15
            </div>
            <div class="product-quantity">
              Quantity: ${cartItem.quantity}
            </div>
            <button class="buy-again-button button-primary">
              <img class="buy-again-icon" src="images/icons/buy-again.png">
              <span class="buy-again-message">Buy it again</span>
            </button>
          </div>
    
          <div class="product-actions">
            <a href="tracking.html">
              <button class="track-package-button button-secondary">
                Track package
              </button>
            </a>
          </div>
        </div>
      </div>
    `;
  });
  document.querySelector('.js-orders-grid').innerHTML = html;
}

    








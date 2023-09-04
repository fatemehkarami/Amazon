let cart = getCartFromStorage();
let cartQuantity = getCartQuantityFromStorage();
let totalPrice = getTotalPriceFromStorage();

const currentDate = new Date();

const twoDaysLater = new Date(currentDate);
twoDaysLater.setDate(currentDate.getDate() + 2);

const eightDaysLater = new Date(currentDate);
eightDaysLater.setDate(currentDate.getDate() + 8);

const options = { weekday: 'long', month: 'long', day: 'numeric' };

const currentFormatted = currentDate.toLocaleDateString('en-US', options);
const twoDaysLaterFormatted = twoDaysLater.toLocaleDateString('en-US', options);
const eightDaysLaterFormatted = eightDaysLater.toLocaleDateString('en-US', options);

const currentDateParts = currentFormatted.split(' ');
const currentDayOfWeek = currentDateParts[0].slice(0, -1);
const currentMonth = currentDateParts[1];
const currentDay = currentDateParts[2];

const twoDaysLaterParts = twoDaysLaterFormatted.split(' ');
const twoDaysLaterDayOfWeek = twoDaysLaterParts[0].slice(0, -1);
const twoDaysLaterMonth = twoDaysLaterParts[1];
const twoDaysLaterDay = twoDaysLaterParts[2];

const eightDaysLaterParts = eightDaysLaterFormatted.split(' ');
const eightDaysLaterDayOfWeek = eightDaysLaterParts[0].slice(0, -1);
const eightDaysLaterMonth = eightDaysLaterParts[1];
const eightDaysLaterDay = eightDaysLaterParts[2];

const cartDetails = getCartDetails(cart, products);
autoCheckoutHtml();
attachDeleteEventListeners();
orderSummary(cart, cartQuantity);


function getCartDetails (cart, products) {
  const cartDetails = [];
  cart.forEach((cartItem) => {
    const {productId, quantity, orderPlaced, deliveryDate} = cartItem;
    const matchingProduct = products.find((product) => product.id === productId);
    if (matchingProduct) {
      const {name: productName, priceCents: productPriceCents, image: productImage} = matchingProduct;
      cartDetails.push({
        productId,
        quantity,
        productName,
        productPriceCents,
        productImage,
        orderPlaced,
        deliveryDate
      });
    }
  });
  return cartDetails; 
}


function autoCheckoutHtml() {
  let html = ''; 
  const cartDetails = getCartDetails(cart, products);

  setDeliveryDate(cartDetails);
  
  if (!cartQuantity) {
    html = `
      <div class="cart-item-container">
      <div class="cart-is-empty">Your cart is empty.</div>
      <button class="js-empty-cart-link" onclick="location.href='amazon.html'">View products</button>
      </div class="cart-item-container">
    `;
  } else {
    cartDetails.forEach((cartItem, index) => {
      html += `
        <div class="cart-item-container">
          <div class="delivery-date ">
            Delivery date: ${cartItem.deliveryDate.dayOfWeek}, ${cartItem.deliveryDate.month} ${cartItem.deliveryDate.day}
          </div>
  
          <div class="cart-item-details-grid">
            <img class="product-image"
              src="${cartItem.productImage}">
            <div class="cart-item-details">
              <div class="product-name">
                ${cartItem.productName}
              </div>
              <div class="product-price">
                $${(cartItem.productPriceCents / 100).toFixed(2)}
              </div>
              <div class="product-quantity js-update-quantity" data-product-id="${cartItem.productId}">
                <span>
                  Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id="${cartItem.productId}">
                  Update
                </span>
                <span class="delete-quantity-link link-primary js-delete-quantity-link"->
                  Delete
                </span>
              </div>
            </div>
  
            <div class="delivery-options">
              <div class="delivery-options-title">
                Choose a delivery option:
              </div>
              <div class="delivery-option">
                <input type="radio" checked
                  class="delivery-option-input js-delivery-option-input"
                  name="delivery-option-${index}"
                  value="normal">
                <div>
                  <div class="delivery-option-date">
                  ${eightDaysLaterFormatted}
                  </div>
                  <div class="delivery-option-price">
                    FREE Shipping
                  </div>
                </div>
              </div>
              <div class="delivery-option">
                <input type="radio"
                  class="delivery-option-input js-delivery-option-input"
                  name="delivery-option-${index}"
                  value="fast">
                <div>
                  <div class="delivery-option-date">
                  ${twoDaysLaterFormatted}
                  </div>
                  <div class="delivery-option-price">
                    $4.99 - Shipping
                  </div>
                </div>
              </div>
              <div class="delivery-option">
                <input type="radio"
                  class="delivery-option-input js-delivery-option-input"
                  name="delivery-option-${index}"
                  value="super-fast">
                <div>
                  <div class="delivery-option-date">
                  ${currentFormatted}
                  </div>
                  <div class="delivery-option-price">
                    $9.99 - Shipping
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    });
  }
  document.querySelector('.js-order-summary').innerHTML = html;
}


function attachDeleteEventListeners() {
  const deleteIcons = document.querySelectorAll('.js-delete-quantity-link');
  deleteIcons.forEach((deleteIcon) => {
    deleteIcon.addEventListener('click', () => {
      const productId = deleteIcon.parentElement.dataset.productId;
      const deletedProductIndex = cart.findIndex((cartItem) => cartItem.productId === productId);
      if (deletedProductIndex !== -1) {
        const deletedCartItem = cart[deletedProductIndex]; // Get the deleted cart item
        cart.splice(deletedProductIndex, 1);
        cartQuantity -= deletedCartItem.quantity;
        updateCartStorage(cart, cartQuantity, totalPrice);
        autoCheckoutHtml();
        orderSummary(cart, cartQuantity);
        attachDeleteEventListeners();
      }
    });
  });
}


function setDeliveryDate(cart) {
  cart.forEach((cartItem, index) => {
    const cartItemContainer = document.querySelector(`.cart-item-container:nth-child(${index + 1})`);

    if (cartItemContainer) {
      const selectedOption = cartItemContainer.querySelector(`input[name="delivery-option-${index}"]:checked`);

      if (selectedOption) {
        const optionValue = selectedOption.value;
        if (optionValue === 'normal') {
          cartItem.deliveryDate = {
            dayOfWeek: eightDaysLaterDayOfWeek,
            day: eightDaysLaterDay,
            month: eightDaysLaterMonth
          };
        } else if (optionValue === 'fast') {
          cartItem.deliveryDate = {
            dayOfWeek: twoDaysLaterDayOfWeek,
            day: twoDaysLaterDay,
            month: twoDaysLaterMonth
          };
        } else if (optionValue === 'super-fast') {
          cartItem.deliveryDate = {
            dayOfWeek: currentDayOfWeek,
            day: currentDay,
            month: currentMonth
          };
        }

        const deliveryDateElement = cartItemContainer.querySelector('.delivery-date');
        deliveryDateElement.textContent = `Delivery date: ${cartItem.deliveryDate.dayOfWeek}, ${cartItem.deliveryDate.month} ${cartItem.deliveryDate.day}`;

        updateCartStorage(cart, cartQuantity, totalPrice);
      }
    }
  });
}


function orderSummary(cart, cartQuantity){
  const cartDetails = getCartDetails(cart,products);
  const totalItemsCostCents = calculateTotalItemsCostCents(cart);
  document.querySelector('.js-return-to-home-link').innerHTML = `${cartQuantity} items`;
  document.querySelector('.js-items-quantity').innerHTML = `Items (${cartQuantity}):`;
  document.querySelector('.js-payment-summary-money').innerHTML = `$${(totalItemsCostCents / 100).toFixed(2)}`;
  const deliveryOptionElements = document.querySelectorAll('.js-delivery-option-input');
  deliveryOptionElements.forEach((element) => {
    element.addEventListener('change', () => {
      updateOrderSummary(cart);
      setDeliveryDate(cart);
    });
  });
  updateOrderSummary(cart);
  const placeOrderButton = document.querySelector('.js-place-order-button');
  if (!cartQuantity) {
    placeOrderButton.disabled = true;
    placeOrderButton.classList.add('js-disabled-place-order-button');
  } else {
    placeOrderButton.disabled = false;
    placeOrderButton.classList.remove('js-disabled-place-order-button');
  }
  updateCartStorage(cart, cartQuantity, totalPrice);

}


function calculateTotalItemsCostCents(cart) {
  const cartDetails = getCartDetails(cart, products);
  let totalItemsCostCents = 0;
  cartDetails.forEach((cartItem) => {
    totalItemsCostCents += cartItem.productPriceCents * cartItem.quantity;
  });
  return totalItemsCostCents;
}


function updateOrderSummary(cart) {
  let totalShippingCostCents = 0;
  const totalItemsCostCents = calculateTotalItemsCostCents(cart);
  updateCartStorage(cart, cartQuantity, totalPrice);
  cart.forEach((cartItem) => {
    const selectedOption = document.querySelector(`input[name="delivery-option-${cart.indexOf(cartItem)}"]:checked`);
    if (selectedOption) {
      const optionValue = selectedOption.value;
      if (optionValue === 'normal') {
        totalShippingCostCents += 0;
      } else if (optionValue === 'fast') {
        totalShippingCostCents += 499;
      } else if (optionValue === 'super-fast') {
        totalShippingCostCents += 999;
      }
    }
  });

  document.querySelector('.js-shipping-handling-cost').innerHTML = `$${(totalShippingCostCents / 100).toFixed(2)}`;
  const totalBeforeTaxCents = totalItemsCostCents + totalShippingCostCents;
  document.querySelector('.js-total-before-tax').innerHTML = (totalBeforeTaxCents / 100).toFixed(2);
  document.querySelector('.js-estimated-tax').innerHTML = `$${(totalBeforeTaxCents / 1000).toFixed(2)}`;
  totalPrice = ((totalBeforeTaxCents + totalBeforeTaxCents / 10) / 100).toFixed(2);
  document.querySelector('.js-total-price').innerHTML = `$${totalPrice}`;
  updateCartStorage(cart, cartQuantity, totalPrice);
}


const updateIcons = document.querySelectorAll('.js-update-quantity-link');
updateIcons.forEach((updateIcon) => {
  updateIcon.addEventListener('click', (event) => {
    event.stopPropagation();

    const productId = updateIcon.dataset.productId;
    const updatedProductItem = cart.find((cartItem) => cartItem.productId === productId);
    if (updatedProductItem) {
      const parentElement = updateIcon.parentElement;
      parentElement.innerHTML = `
        <span>Quantity:</span>
        <span>
          <select class="js-update-quantity-options">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </span>
        <span class="Save-quantity-link link-primary js-save-quantity-link">
          Save
        </span>
        <span class="delete-quantity-link link-primary js-delete-quantity-link">
          Delete
        </span>   
      `;

      const updateQuantityElement = parentElement.querySelector('.js-update-quantity-options');
      updateQuantityElement.addEventListener('click', (event) => {
        event.stopPropagation();
      });

      const saveIconElement = parentElement.querySelector('.js-save-quantity-link');
      saveIconElement.addEventListener('click', () => {
        const updateQuantity = Number(updateQuantityElement.value);
        updatedProductItem.quantity = updateQuantity;
        let cartQuantity = 0;
        cart.forEach((item) => {
          cartQuantity += item.quantity;
        });
        updateCartStorage(cart, cartQuantity, totalPrice);  

        // Recalculate the order summary
        orderSummary(cart, cartQuantity);
      });
    }
  });
});


// Call the function initially to set up the event listeners
attachDeleteEventListeners();


document.querySelector('.js-place-order-button').addEventListener('click', () => {
  window.location.href = 'orders.html';
});
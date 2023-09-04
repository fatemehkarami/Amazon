let cart = getCartFromStorage();
let cartQuantity = getCartQuantityFromStorage();
let totalPrice = getTotalPriceFromStorage();
document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;

const currentDate = new Date();

const eightDaysLater = new Date(currentDate);
eightDaysLater.setDate(currentDate.getDate() + 8);

const options = { weekday: 'long', month: 'long', day: 'numeric' };

const currentFormatted = currentDate.toLocaleDateString('en-US', options);
const eightDaysLaterFormatted = eightDaysLater.toLocaleDateString('en-US', options);

const currentDateParts = currentFormatted.split(' ');
const currentDayOfWeek = currentDateParts[0].slice(0, -1);
const currentMonth = currentDateParts[1];
const currentDay = currentDateParts[2];

const eightDaysLaterParts = eightDaysLaterFormatted.split(' ');
const eightDaysLaterDayOfWeek = eightDaysLaterParts[0].slice(0, -1);
const eightDaysLaterMonth = eightDaysLaterParts[1];
const eightDaysLaterDay = eightDaysLaterParts[2];


let html = '';
products.forEach(product => {
  html += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src=${product.image}>
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="images/ratings/rating-${product.rating.stars * 10}.png">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        $${(product.priceCents /  100).toFixed(2)}
      </div>

      <div class="product-quantity-container js-product-quantity-container" data-product-id="${product.id}">
        <select>
          <option selected value="1">1</option>
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
      </div>

      <div class="product-spacer"></div>

      <div class="added-to-cart js-added-to-cart" data-product-id="${product.id}">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart-button" data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>`;
});
document.querySelector('.js-products-grid').innerHTML = html;

document.querySelectorAll('.js-add-to-cart-button').forEach((button) => {
  const productId = button.dataset.productId;

  button.addEventListener('click', () => {
    let quantityOfProduct;
    const productQuantityContainer = document.querySelector(`.js-product-quantity-container[data-product-id="${productId}"]`);
    const selectedOption = productQuantityContainer.querySelector('select option:checked');
    quantityOfProduct = Number(selectedOption.value);

    let matchingItem;
    cart.forEach((item) => {
      if (item.productId === productId) {
        matchingItem = item;
      }
    });

    if (!matchingItem) {
      cart.push({
        productId: productId,
        quantity: quantityOfProduct,
        orderPlaced: {
          dayOfWeek: currentDayOfWeek,
          day: currentDay,
          month: currentMonth
        },
        deliveryDate: {
          dayOfWeek: eightDaysLaterDayOfWeek,
          day: eightDaysLaterDay,
          month: eightDaysLaterMonth
        }
      });
    } else {
      matchingItem.quantity += quantityOfProduct;
    }

    let cartQuantity = 0;
    cart.forEach((item) => {
      cartQuantity += item.quantity;
    });

    updateCartStorage(cart, cartQuantity, totalPrice);

    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
    document.querySelectorAll('.js-added-to-cart').forEach((item) => {
      if (item.dataset.productId === productId) {
        item.classList.add('show-added-to-cart');
        setTimeout(() => {
          item.classList.remove('show-added-to-cart');
        }, 1000);
      }
    });
  });
});
function validateTextInput(input) {
    input.value = input.value.replace(/[^a-zA-Z]/g, '');
}

const addToCartBtn = document.querySelector('.felt-bunting-addtocart-btn');
const quantity = document.querySelector('.cc-select__btn');
try {
    document.querySelector('#userChoice').addEventListener('keyup', function () {
        var userInput = document.getElementById('userChoice').value.toUpperCase();
        const addToCartBtn = document.querySelector('.felt-bunting-addtocart-btn');
        if (userInput.length < 3) {
            document.querySelector(".felt-bunting-message").innerHTML = "Please enter at least three characters";
            document.querySelector(".ct-felt-bunting-price").innerHTML = "₹ 100";
            // addToCartBtn.style.opacity = '0.5';
            // addToCartBtn.style.pointerEvents = 'none';
        } else if (userInput.length > 11) {
            document.querySelector(".felt-bunting-message").innerHTML = "Please enter less than or equal to eleven characters";
        } else {
            // addToCartBtn.style.opacity = '1';
            // addToCartBtn.style.pointerEvents = 'auto';
            document.querySelector(".felt-bunting-message").innerHTML = "";
            var characters = [];
            var product_price = [400];

            for (var i = 0; i < userInput.length; i++) {
                characters.push(userInput[i]);
            }

            characters.forEach(function (character) {
                let pro_title = document.querySelector(`.ct_pro_${character}[product-name="${character}"]`);
                if (pro_title) {
                    let price = parseInt(pro_title.getAttribute('product-price'));
                    product_price.push(price);
                }
            });
            var sum = product_price.reduce((acc, currentValue) => acc + currentValue, 0);
            document.querySelector(".ct-felt-bunting-price").innerHTML = `₹ ${sum}`;
        }
    });
} catch (error) {
    console.log(error);
}

try {
    addToCartBtn.addEventListener('click', function() {
      document.querySelectorAll('.opt-btn').forEach(function(element) {
          element.addEventListener('change', function() {
              document.querySelector(".felt-bunting-message").innerHTML = "";
          });
      });
      var userInput = document.getElementById('userChoice').value.toUpperCase();
      var characters = [];
      var Allproduct_Data = { 'items': [] };
      var inputElement = document.querySelector('.ct-custom-input-data');
      var selectedColor = document.querySelector('.opt-btn:checked');
      // debugger

      if (!selectedColor && !userInput) {
        document.querySelector(".felt-bunting-message").innerHTML = "Please Enter your choice and select a variant before adding the product to your cart.";
        return false;
      } else if (!selectedColor) {
        document.querySelector(".felt-bunting-message").innerHTML = "Please select a variant before adding the product to your cart.";
        return false;
      } else if (!userInput) {
        document.querySelector(".felt-bunting-message").innerHTML = "Please Enter your choice.";
        return false;
      }
      
      
      document.querySelector(".felt-bunting-message").innerHTML = "";
      var autoAddToCart =  document.querySelector('.autoAddToCart-detail');
      if (autoAddToCart) {
          var autoAddToCartObj = JSON.parse(autoAddToCart.innerText);
          autoAddToCartObj.forEach(element => {
                element.quantity *= quantity.innerText;
                Allproduct_Data.items.push(element);
          });
      } else {
         alert('This product is not available.');
      }
   
      for (var i = 0; i < userInput.length; i++) {
          characters.push(userInput[i]);
      }
      
      characters.forEach(function(character) {
          debugger
          let pro_title = document.querySelector(`.ct_pro_${character}[product-variant-color="${selectedColor.value}"][product-name="${character}"]`);
          if (pro_title) {
              let inventory = parseInt(pro_title.getAttribute('product-inventory'));
              if (inventory > quantity.innerText ) {
                return;
              }
              let product_Data = {
                  id: parseInt(pro_title.getAttribute('product-variant-id')),
                  title: pro_title.getAttribute('product-name'),
                  quantity: 1 * quantity.innerText 
              };
            
              Allproduct_Data.items.push(product_Data);
          }
      });
      
        fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Allproduct_Data)
      })
      .then(response => { response.json();


              
                         
              fetch(window.Shopify.routes.root + 'cart/update.js', {
                  method: 'POST',
                  data: {
                    note: userInput
                  },
                                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(Allproduct_Data)
                })
                .then(response => {
                  if (!response.ok) {
                    throw new Error('Network response was not ok');
                  }
                  return response.json()
                .then(cart => {
                   addToCartBtn.innerHTML = "Adding";
                   addToCartBtn.style.opacity = '0.4';
                   setTimeout(function() {
                           addToCartBtn.innerHTML = "Add to cart";
                           addToCartBtn.style.opacity = '1';
                          }, 3000);
                  
                  var paragraphElement = document.createElement("p");
                          paragraphElement.textContent = "Product added to cart";
                          paragraphElement.classList.add("product-success-msg", "animated");
                          
                          if (window.innerWidth < 768) {
                            paragraphElement.style.position = "fixed";
                            paragraphElement.style.bottom = "50px";
                            paragraphElement.style.padding = "10px 35px";
                          } else {
                            paragraphElement.style.position = "fixed";
                            paragraphElement.style.bottom = "50px";
                            paragraphElement.style.padding = "20px 35px";
                          }
                          
                          paragraphElement.style.background = "#e26636";
                          paragraphElement.style.color = "white";
                          paragraphElement.style.right = "50%";
                          paragraphElement.style.borderRadius = "32px";
                          paragraphElement.style.transform = "translateX(50%)";
                          paragraphElement.style.whiteSpace = "nowrap";
                          document.querySelector(".ct-felt-bunting").lastElementChild.before(paragraphElement);

                          // document.querySelector(".felt-bunting-addtocart-btn").insertBefore(paragraphElement, document.querySelector(".felt-bunting-addtocart-btn").children[document.querySelector(".felt-bunting-addtocart-btn").children.length - 1]);
                          
                          setTimeout(function() {
                            paragraphElement.remove();
                          }, 3000);

                  // mmajaxcart.AjaxcartRender();
                  // mmajaxcart.loyalty_point();
                   setTimeout(function() {
                      document.querySelector('.mm-ajaxcart-open').click();
                   },1000)
                  let CartCount = cart.item_count; 
                  document.querySelectorAll('.header-cart__count').forEach((elem) => {
                    elem.innerText = cart.item_count;
                  });
                  document.querySelectorAll('.mm-cart-count').forEach((elem) => {
                    elem.innerHTML = CartCount;
                  });
                })
                .catch(error => {
                  console.error('There was a problem with the fetch operation:', error);
                });
           })
      })
      .catch((error) => {
        console.error('Error:', error);
      });

      return true;
  });
} catch (err) {
  console.log(err);
}
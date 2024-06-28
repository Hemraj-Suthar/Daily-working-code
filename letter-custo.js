const collectionName = document.querySelector(".collectionName");
const messageElement = document.querySelector(".felt-bunting-message");
const userInput = document.getElementById("userChoice");
const addToCartBtn = document.querySelector(".felt-bunting-addtocart-btn");
const focusInputButton = document.querySelector("#mobile-btn");
let initialPrice = parseInt(document.querySelector(".minimumPrice").innerText);
const cart_clear_btn = document.querySelector(".ct-cart-clear");
const proTitleParent = document.querySelector(".ct-product-details");
const feltBuntingPriceElement = document.querySelector(".ct-felt-bunting-price");
feltBuntingPriceElement.innerHTML = `₹ ${initialPrice}`;

function validateTextInput(input) {
    input.value = input.value.replace(/[^a-zA-Z]/g, "");
    if (input.value.length > 11) {
      input.value = input.value.slice(0, 11);
    }
}

focusInputButton.addEventListener("click", function() {
    userInput.focus();
    const offsetTop = userInput.getBoundingClientRect().top + window.pageYOffset - 200;
    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
});

try {
    userInput.addEventListener("keyup", function () {
        const userInputValue = this.value.toUpperCase();
        const characters = userInputValue.split('');
        let totalAdditionalPrice = 0;

        if (userInputValue.length >= 3) {
            for (let i = 3; i < characters.length; i++) {
                const proTitle = proTitleParent.querySelector(`.ct_pro_${characters[i]}[product-name="${characters[i]}"]`);
                if (proTitle) {
                    const productPrice = parseInt(proTitle.getAttribute("product-price"), 10);
                    totalAdditionalPrice += productPrice;
                }
            }
            messageElement.innerHTML = "";
            addToCartBtn.disabled = false;
            feltBuntingPriceElement.innerHTML = `₹ ${initialPrice + totalAdditionalPrice}`;
        } else {
            messageElement.innerHTML = "Please enter at least three characters";
            addToCartBtn.disabled = true;
            feltBuntingPriceElement.innerHTML = `₹ ${initialPrice}`;
        }
    });
} catch (error) {
    console.error(error);
}

try {
    addToCartBtn.addEventListener("click", function () {
      document.querySelectorAll(".opt-btn").forEach(function (element) {
          element.addEventListener("change", function () {
             document.querySelector(".felt-bunting-message").innerHTML = "";
          });
      });
      const userInputValue = userInput.value.toUpperCase();
      var characters = [];
      var Allproduct_Data = { items: [], note: "" };
      var selectedColor = document.querySelector(".opt-btn:checked");
      const quantity = parseInt(document.querySelector(".cc-select__btn").innerText)
  
      if (!selectedColor && !userInputValue) {
        messageElement.innerHTML = "Please Enter your Name and select a color variant before adding the product to your cart.";
        return;
      } else if (!selectedColor) {
        messageElement.innerHTML = "Please select a color variant before adding the product to your cart.";
        return;
      } else if (!userInputValue) {
        messageElement.innerHTML = "Please Enter your Name.";
        return;
      }
  
      messageElement.innerHTML = "";
      
      const autoAddToCart = document.querySelector(".autoAddToCart-detail");
      if (autoAddToCart) {
          var autoAddToCartObj = JSON.parse(autoAddToCart.innerText);
          let element = document.querySelector(".ct-product-details-box");
            if (element) {
              let elementno = parseInt(element.getAttribute("product-inventory"));
                if (elementno < quantity) {
                    messageElement.innerHTML = "Sorry, the cart and star is insufficient for the selected quantity.";
                    setTimeout(() => (messageElement.innerHTML = ""), 3000);
                    return;
                }
            }
            autoAddToCartObj.quantity *= quantity;
            Allproduct_Data.items.push(autoAddToCartObj);
      } else {
          alert("This product is not available.");
          return;
      }
  
      for (var i = 0; i < userInputValue.length; i++) {
        characters.push(userInputValue[i]);
      }
  
      const charactersAndCount = {};
      for (let i = 0; i < characters.length; i++) {
          const currentValue = characters[i];
          if (charactersAndCount[currentValue]) {
            charactersAndCount[currentValue] += 1;
          } else {
            charactersAndCount[currentValue] = 1;
          }
      }
  
      characters.forEach(function (character) {
          let pro_title = proTitleParent.querySelector(`.ct_pro_${character}[product-variant-color="${selectedColor.value}"][product-name="${character}"]`);
          if (pro_title && pro_title != null) {
              let inventory = parseInt(pro_title.getAttribute("product-inventory"));
              let letter = pro_title.getAttribute("product-name");
              if (inventory < quantity * charactersAndCount[letter]) {
                document.querySelector(".felt-bunting-message").innerHTML = "Sorry, the Letter is insufficient for the selected quantity.";
                setTimeout(() =>(document.querySelector(".felt-bunting-message").innerHTML = ""), 3000);
                return;
              }
              Allproduct_Data.items.push({
                id: parseInt(pro_title.getAttribute("product-variant-id")),
                title: pro_title.getAttribute("product-name"),
                quantity: 1 * quantity,
              });
          } else {
              document.querySelector(".felt-bunting-message").innerHTML = "Sorry, the Letter is insufficient for the selected quantity.";
          }
      });
      
      if (messageElement.innerHTML == "") {
          Allproduct_Data.note = collectionName.innerText + " " + userInputValue;
    
          fetch("/cart/add.js", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(Allproduct_Data),
          })
            .then((response) => {
                if (!response.ok) {
                  throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((cart) => {
                   animation();
            })
            .catch((error) => {
              console.error("Error:", error);
            });
      } else {
          messageElement.innerHTML = "Sorry, the Letter is insufficient for the selected quantity.";
      }
    });
} catch (err) {
    console.error(err);
}

cart_clear_btn.addEventListener("click", async function () {
    try {
      const response = await fetch("/cart/clear.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note: "" }),
      });

      if (!response.ok) {
        throw new Error(`Request failed. Status: ${response.status}`);
      }

      async function updateCartNote() {
            const noteData = { note: "",};
            const response = await fetch("/cart/update.js", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(noteData),
            });
  
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
  
            const cart = await response.json();
            console.log("Cart updated. Current cart contents:", cart);
      }
      updateCartNote();
      userInput.value = "";
      feltBuntingPriceElement.innerHTML = `₹ ${initialPrice}`;
      mmajaxcart.AjaxcartRender();
    } catch (error) {
        console.error("Request failed:", error);
    }
});

function animation() {
            addToCartBtn.innerHTML = "Adding";
            addToCartBtn.style.opacity = "0.4";
            setTimeout(function () {
              addToCartBtn.innerHTML = "Add to cart";
              addToCartBtn.style.opacity = "1";
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
            paragraphElement.style.zIndex = "999999999";
            paragraphElement.style.right = "50%";
            paragraphElement.style.borderRadius = "32px";
            paragraphElement.style.transform = "translateX(50%)";
            paragraphElement.style.whiteSpace = "nowrap";
            document.querySelector(".ct-felt-bunting").lastElementChild.before(paragraphElement);
  
            setTimeout(function () {
              paragraphElement.remove();
            }, 3000);
  
            setTimeout(function () {
              document.querySelector(".mm-ajaxcart-open").click();
            }, 1000);
}
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
        } else {
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
    addToCartBtn.addEventListener('click', function () {
        document.querySelectorAll('.opt-btn').forEach(function (element) {
            element.addEventListener('change', function () {
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
        var autoAddToCart = document.querySelector('.autoAddToCart-detail');
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

        characters.forEach(function (character) {
            debugger
            let pro_title = document.querySelector(`.ct_pro_${character}[product-variant-color="${selectedColor.value}"][product-name="${character}"]`);
            if (pro_title) {
                let inventory = parseInt(pro_title.getAttribute('product-inventory'));
                if (inventory > quantity.innerText) {
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
            .then(response => {
                response.json();




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
                                setTimeout(function () {
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

                                setTimeout(function () {
                                    paragraphElement.remove();
                                }, 3000);

                                // mmajaxcart.AjaxcartRender();
                                // mmajaxcart.loyalty_point();
                                setTimeout(function () {
                                    document.querySelector('.mm-ajaxcart-open').click();
                                }, 1000)
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


var messageElement = document.querySelector(".felt-bunting-message");
var userInput = document.getElementById('userChoice').value.toUpperCase();
function validateTextInput(input) {
    input.value = input.value.replace(/[^a-zA-Z]/g, '');
    if (input.value.length > 11) {
        input.value = input.value.slice(0, 11);
    }
}

const addToCartBtn = document.querySelector('.felt-bunting-addtocart-btn');

try {
    document.querySelector('#userChoice').addEventListener('keyup', function () {
        var userInput = document.getElementById('userChoice').value.toUpperCase();
        const addToCartBtn = document.querySelector('.felt-bunting-addtocart-btn');
        if (userInput.length < 3) {
            document.querySelector(".felt-bunting-message").innerHTML = "Please enter at least three characters";
            document.querySelector(".ct-felt-bunting-price").innerHTML = "₹ 100";
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
    addToCartBtn.addEventListener('click', function () {
        document.querySelectorAll('.opt-btn').forEach(function (element) {
            element.addEventListener('change', function () {
                document.querySelector(".felt-bunting-message").innerHTML = "";
            });
        });
        var userInput = document.getElementById('userChoice').value.toUpperCase();
        var characters = [];
        var Allproduct_Data = { 'items': [], 'note': '' };
        var inputElement = document.querySelector('.ct-custom-input-data');
        var selectedColor = document.querySelector('.opt-btn:checked');
        const quantity = document.querySelector('.cc-select__btn').innerText;

        if (!selectedColor && !userInput) {
            document.querySelector(".felt-bunting-message").innerHTML = "Please Enter your choice and select a variant before adding the product to your cart.";
            return;
            // return false;
        } else if (!selectedColor) {
            document.querySelector(".felt-bunting-message").innerHTML = "Please select a variant before adding the product to your cart.";
            return;
            // return false;
        } else if (!userInput) {
            document.querySelector(".felt-bunting-message").innerHTML = "Please Enter your choice.";
            return;
            // return false;
        }


        document.querySelector(".felt-bunting-message").innerHTML = "";

        var autoAddToCart = document.querySelector('.autoAddToCart-detail');
        if (autoAddToCart) {
            var autoAddToCartObj = JSON.parse(autoAddToCart.innerText);
            autoAddToCartObj.forEach(element => {
                let cart = document.querySelector('.ct_pro_Cart');
                let star = document.querySelector('.ct_pro_Star');
                if (cart && star) {
                    let cartNo = parseInt(cart.getAttribute('product-inventory'));
                    let starno = parseInt(star.getAttribute('product-inventory'));
                    if (cartNo && starno < quantity) {
                        document.querySelector(".felt-bunting-message").innerHTML = "Sorry, the cart and star is insufficient for the selected quantity.";
                        setTimeout(() => document.querySelector(".felt-bunting-message").innerHTML = "", 3000);
                        return;
                    }
                }
                element.quantity *= quantity;
                Allproduct_Data.items.push(element);
                console.log(element)
            });
        } else {
            alert('This product is not available.');
            return;
        }


        for (var i = 0; i < userInput.length; i++) {
            characters.push(userInput[i]);
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
            let pro_title = document.querySelector(`.ct_pro_${character}[product-variant-color="${selectedColor.value}"][product-name="${character}"]`);
            if (pro_title && pro_title != null) {
                let inventory = parseInt(pro_title.getAttribute('product-inventory'));
                let letter = pro_title.getAttribute("product-name");
                if (inventory < quantity * charactersAndCount[letter]) {
                    document.querySelector(".felt-bunting-message").innerHTML = "Sorry, the Letter is insufficient for the selected quantity.";
                    setTimeout(() => document.querySelector(".felt-bunting-message").innerHTML = "", 3000);
                    return;
                }
                Allproduct_Data.items.push({
                    id: parseInt(pro_title.getAttribute('product-variant-id')),
                    title: pro_title.getAttribute('product-name'),
                    quantity: 1 * quantity
                });
            } else {
                document.querySelector(".felt-bunting-message").innerHTML = "Sorry, the Letter is insufficient for the selected quantity.";
            }
        });

        if (messageElement.innerHTML == '') {
            Allproduct_Data.note = userInput;
            fetch('/cart/add.js', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Allproduct_Data)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    console.log(response)
                    return response.json();
                })
                .then(cart => {
                    addToCartBtn.innerHTML = "Adding";
                    addToCartBtn.style.opacity = '0.4';
                    setTimeout(function () {
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
                        document.querySelector('.mm-ajaxcart-open').click();
                    }, 1000);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        } else {
            document.querySelector(".felt-bunting-message").innerHTML = "Sorry, the Letter is insufficient for the selected quantity.";
        }
    });
} catch (err) {
    console.log(err);
}


// try {
//   document.querySelector("#userChoice").addEventListener("keyup", function () {
//     var userInput = document.getElementById("userChoice").value.toUpperCase();
//     var characters = [];
//     var product_price = [];
//     for (var i = 0; i < userInput.length; i++) {
//       characters.push(userInput[i]);
//     }

//     if (characters.length > 3) {
//           var fourth_letter = characters[3];
//           // console.log(fourth_letter);
//            let pro_title = document.querySelector(`.ct_pro_${fourth_letter}[product-name="${fourth_letter}"]`);
//            if (pro_title) {
//             let price = parseInt(pro_title.getAttribute("product-price"));
//             product_price.push(price);
//           }
//     }

//     if (userInput.length < 3) {
//       document.querySelector(".felt-bunting-message").innerHTML = "Please enter at least three characters";
//       document.querySelector(".ct-felt-bunting-price").innerHTML = "₹ " + parseInt(minimumPrice.innerText);
//     } else {
//       document.querySelector(".felt-bunting-message").innerHTML = "";
//       var sum = parseInt(minimumPrice.innerText) + product_price[0];
//       document.querySelector(".ct-felt-bunting-price").innerHTML = `₹ ${sum}`;
//     }
//   });
// } catch (error) {
//   console.log(error);
// }


const collectionName = document.querySelector(".collectionName");
var messageElement = document.querySelector(".felt-bunting-message");
var userInput = document.getElementById("userChoice");
const addToCartBtn = document.querySelector(".felt-bunting-addtocart-btn");
const focusInputButton = document.querySelector("#mobile-btn");
const minimumPriceElement = document.querySelector(".minimumPrice");
const feltBuntingPriceElement = document.querySelector(".ct-felt-bunting-price");
let initialPrice = parseInt(minimumPriceElement.innerText);
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
    document.querySelector("#userChoice").addEventListener("keyup", function () {
        var userInput = this.value.toUpperCase();
        var characters = userInput.split('');
        var totalAdditionalPrice = 0;
    
        if (userInput.length >= 3) {
            for (var i = 3; i < characters.length; i++) {
                let pro_title = document.querySelector(`.ct_pro_${characters[i]}[product-name="${characters[i]}"]`);
                if (pro_title) {
                    let price = parseInt(pro_title.getAttribute("product-price"), 10);
                    totalAdditionalPrice += price;
                }
            }
        }
    
        if (userInput.length < 3) {
            messageElement.innerHTML = "Please enter at least three characters";
            addToCartBtn.disabled = true;
            feltBuntingPriceElement.innerHTML = `₹ ${initialPrice}`;
        } else {
            messageElement.innerHTML = "";
            addToCartBtn.disabled = false;
            let sum = initialPrice + totalAdditionalPrice;
            feltBuntingPriceElement.innerHTML = `₹ ${sum}`;
        }
    });
} catch (error) {
  console.log(error);
}

try {
  addToCartBtn.addEventListener("click", function () {
    document.querySelectorAll(".opt-btn").forEach(function (element) {
      element.addEventListener("change", function () {
        document.querySelector(".felt-bunting-message").innerHTML = "";
      });
    });
    var userInput = document.getElementById("userChoice").value.toUpperCase();
    var characters = [];
    var Allproduct_Data = { items: [], note: "" };
    var inputElement = document.querySelector(".ct-custom-input-data");
    var selectedColor = document.querySelector(".opt-btn:checked");
    const quantity = document.querySelector(".cc-select__btn").innerText;

    if (!selectedColor && !userInput) {
      document.querySelector(".felt-bunting-message").innerHTML = "Please Enter your choice and select a variant before adding the product to your cart.";
      return;
    } else if (!selectedColor) {
      document.querySelector(".felt-bunting-message").innerHTML = "Please select a variant before adding the product to your cart.";
      return;
    } else if (!userInput) {
      document.querySelector(".felt-bunting-message").innerHTML = "Please Enter your choice.";
      return;
    }

    document.querySelector(".felt-bunting-message").innerHTML = "";

    var autoAddToCart = document.querySelector(".autoAddToCart-detail");
    if (autoAddToCart) {
      var autoAddToCartObj = JSON.parse(autoAddToCart.innerText);
      autoAddToCartObj.forEach((element) => {
        let cart = document.querySelector(".ct_pro_Cart");
        let star = document.querySelector(".ct_pro_Star");
        if (cart && star) {
          let cartNo = parseInt(cart.getAttribute("product-inventory"));
          let starno = parseInt(star.getAttribute("product-inventory"));
          if (cartNo && starno < quantity) {
            document.querySelector(".felt-bunting-message").innerHTML =
              "Sorry, the cart and star is insufficient for the selected quantity.";
            setTimeout(
              () =>
                (document.querySelector(".felt-bunting-message").innerHTML =
                  ""),
              3000
            );
            return;
          }
        }
        element.quantity *= quantity;
        Allproduct_Data.items.push(element);
        console.log(element);
      });
    } else {
      alert("This product is not available.");
      return;
    }

    for (var i = 0; i < userInput.length; i++) {
      characters.push(userInput[i]);
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
      let pro_title = document.querySelector(
        `.ct_pro_${character}[product-variant-color="${selectedColor.value}"][product-name="${character}"]`
      );
      if (pro_title && pro_title != null) {
        let inventory = parseInt(pro_title.getAttribute("product-inventory"));
        let letter = pro_title.getAttribute("product-name");
        if (inventory < quantity * charactersAndCount[letter]) {
          document.querySelector(".felt-bunting-message").innerHTML =
            "Sorry, the Letter is insufficient for the selected quantity.";
          setTimeout(
            () =>
              (document.querySelector(".felt-bunting-message").innerHTML = ""),
            3000
          );
          return;
        }
        Allproduct_Data.items.push({
          id: parseInt(pro_title.getAttribute("product-variant-id")),
          title: pro_title.getAttribute("product-name"),
          quantity: 1 * quantity,
        });
      } else {
        document.querySelector(".felt-bunting-message").innerHTML =
          "Sorry, the Letter is insufficient for the selected quantity.";
      }
    });

    if (messageElement.innerHTML == "") {
      Allproduct_Data.note = collectionName.innerText + " " + userInput;

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
          document
            .querySelector(".ct-felt-bunting")
            .lastElementChild.before(paragraphElement);

          setTimeout(function () {
            paragraphElement.remove();
          }, 3000);

          setTimeout(function () {
            document.querySelector(".mm-ajaxcart-open").click();
          }, 1000);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      document.querySelector(".felt-bunting-message").innerHTML =
        "Sorry, the Letter is insufficient for the selected quantity.";
    }
  });
} catch (err) {
  console.log(err);
}

document.addEventListener("click", async function (e) {
  if (e.target.classList.contains("ct-cart-clear")) {
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
        try {
          const noteData = {
            note: "",
          };

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
        } catch (error) {
          console.log("There was a problem with the fetch operation:", error);
        }
      }
      updateCartNote();
      document.getElementById("userChoice").value = "";
      mmajaxcart.AjaxcartRender();
    } catch (error) {
      console.log("Request failed:", error);
    }
  }
});






const messageElement = document.querySelector(".felt-bunting-message");
const userInput = document.getElementById("userChoice");
const addToCartBtn = document.querySelector(".felt-bunting-addtocart-btn");
const focusInputButton = document.querySelector("#mobile-btn");
const minimumPriceElement = document.querySelector(".minimumPrice");
const feltBuntingPriceElement = document.querySelector(".ct-felt-bunting-price");

let initialPrice = parseInt(minimumPriceElement.innerText);
feltBuntingPriceElement.innerHTML = `₹ ${initialPrice}`;

function scrollToInput() {
    userInput.focus();
    const offsetTop = userInput.getBoundingClientRect().top + window.pageYOffset - 200;
    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
}

focusInputButton.addEventListener("click", scrollToInput);

document.querySelector("#userChoice").addEventListener("keyup", function () {
    const userInputValue = this.value.toUpperCase();
    const characters = userInputValue.split('');
    let totalAdditionalPrice = 0;

    if (userInputValue.length >= 3) {
        for (let i = 3; i < characters.length; i++) {
            const pro_title = document.querySelector(`.ct_pro_${characters[i]}[product-name="${characters[i]}"]`);
            if (pro_title) {
                totalAdditionalPrice += parseInt(pro_title.getAttribute("product-price"), 10);
            }
        }
    }

    if (userInputValue.length < 3) {
        messageElement.innerHTML = "Please enter at least three characters";
        addToCartBtn.disabled = true;
        feltBuntingPriceElement.innerHTML = `₹ ${initialPrice}`;
    } else {
        messageElement.innerHTML = "";
        addToCartBtn.disabled = false;
        feltBuntingPriceElement.innerHTML = `₹ ${initialPrice + totalAdditionalPrice}`;
    }
});

addToCartBtn.addEventListener("click", function () {
    const selectedColor = document.querySelector(".opt-btn:checked");
    const quantity = parseInt(document.querySelector(".cc-select__btn").innerText);

    if (!selectedColor || !userInput.value) {
        messageElement.innerHTML = !selectedColor && !userInput.value
            ? "Please Enter your choice and select a variant before adding the product to your cart."
            : !selectedColor
                ? "Please select a variant before adding the product to your cart."
                : "Please Enter your choice.";
        return;
    }

    const characters = userInput.value.toUpperCase().split('');
    const charactersAndCount = {};
    characters.forEach(char => charactersAndCount[char] = (charactersAndCount[char] || 0) + 1);

    const Allproduct_Data = { items: [], note: `${collectionName.innerText} ${userInput.value}` };
    characters.forEach(char => {
        const pro_title = document.querySelector(`.ct_pro_${char}[product-variant-color="${selectedColor.value}"][product-name="${char}"]`);
        if (pro_title) {
            const inventory = parseInt(pro_title.getAttribute("product-inventory"));
            if (inventory < quantity * charactersAndCount[char]) {
                messageElement.innerHTML = "Sorry, the Letter is insufficient for the selected quantity.";
                return;
            }
            Allproduct_Data.items.push({
                id: parseInt(pro_title.getAttribute("product-variant-id")),
                title: pro_title.getAttribute("product-name"),
                quantity: 1 * quantity,
            });
        } else {
            messageElement.innerHTML = "Sorry, the Letter is insufficient for the selected quantity.";
            return;
        }
    });

    if (!messageElement.innerHTML) {
        fetch("/cart/add.js", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(Allproduct_Data),
        })
        .then(response => response.ok ? response.json() : Promise.reject("Network response was not ok"))
        .then(cart => {
            addToCartBtn.innerHTML = "Adding";
            addToCartBtn.style.opacity = "0.4";
            setTimeout(() => {
                addToCartBtn.innerHTML = "Add to cart";
                addToCartBtn.style.opacity = "1";
            }, 3000);

            const paragraphElement = document.createElement("p");
            paragraphElement.textContent = "Product added to cart";
            paragraphElement.classList.add("product-success-msg", "animated");
            paragraphElement.style.position = "fixed";
            paragraphElement.style.bottom = "50px";
            paragraphElement.style.padding = window.innerWidth < 768 ? "10px 35px" : "20px 35px";
            paragraphElement.style.background = "#e26636";
            paragraphElement.style.color = "white";
            paragraphElement.style.zIndex = "999999999";
            paragraphElement.style.right = "50%";
            paragraphElement.style.borderRadius = "32px";
            paragraphElement.style.transform = "translateX(50%)";
            paragraphElement.style.whiteSpace = "nowrap";
            document.querySelector(".ct-felt-bunting").lastElementChild.before(paragraphElement);

            setTimeout(() => paragraphElement.remove(), 3000);
            setTimeout(() => document.querySelector(".mm-ajaxcart-open").click(), 1000);
        })
        .catch(error => console.error("Error:", error));
    }
});

document.addEventListener("click", async function (e) {
    if (e.target.classList.contains("ct-cart-clear")) {
        try {
            const response = await fetch("/cart/clear.js", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ note: "" }),
            });

            if (!response.ok) throw new Error(`Request failed. Status: ${response.status}`);

            const updateCartNote = async () => {
                const noteData = { note: "" };
                const response = await fetch("/cart/update.js", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(noteData),
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const cart = await response.json();
                console.log("Cart updated. Current cart contents:", cart);
            };

            updateCartNote();
            userInput.value = "";
            mmajaxcart.AjaxcartRender();
        } catch (error) {
            console.log("Request failed:", error);
        }
    }
});

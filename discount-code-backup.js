function updateCart() {
    $.get('/cart?view=ct-ajax', function(cart) {
        var productsHtml = $(cart).find('.cart-items').html();
        var total_price = $(cart).find('.drawer__footer').html();
        $(".cart-items").html(productsHtml);
        $(".drawer__footer").html(total_price);
    });
}
  
document.addEventListener('DOMContentLoaded', function() {
    var discountLi = document.querySelector('.discounts__discount');
    var removeDiscountBtn = document.getElementById('remove-discount');
    if (discountLi && discountLi.textContent.trim()) {
        removeDiscountBtn.style.display = 'inline';
    } else {
        removeDiscountBtn.style.display = 'none';
    }
});
  
document.getElementById('discount-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var discountCode = document.getElementById('discount-code').value;
    debugger
    fetch('/discount/' + discountCode)
      .then(function(response) {
          if (response.ok) {
              updateCart();
              document.getElementById('remove-discount').style.display = 'inline';
              document.getElementById('discount-error').style.display = 'none';        
          } else {
              document.getElementById('discount-error').innerText = 'Invalid discount code';
              document.getElementById('discount-error').style.display = 'block';
          }
      });
});

document.getElementById('remove-discount').addEventListener('click', function() {
    var discountCodeR = "iii";  
    fetch('/discount/' + discountCodeR)
      .then(function(response) {
          if (response.ok) {
              document.getElementById('remove-discount').style.display = 'none';
              document.getElementById('discount-error').style.display = 'none';
              updateCart();        
          } else {
              document.getElementById('discount-error').innerText = 'Invalid discount code';
              document.getElementById('remove-discount').style.display = 'inline';
              document.getElementById('discount-error').style.display = 'block';
          }
      });
});

(function(window) {
    if (URL) {
        var url = new URL(window.location.href);
        var discount = url.searchParams.get('discount');
        console.log(discount);
        alert(discount);
        if (typeof(discount) !== 'undefined' 
            && discount !== null 
            && discount.length > 0) {
            
            sessionStorage.setItem('discount', discount);
            window.location.href = '/discount/' + discount;
        }
    }
})(window);




function applyDiscountCode(discountCode) {
    fetch('/cart.js')
      .then(response => response.json())
      .then(cart => {
        fetch('/cart/update.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            note: '',
            attributes: {},
            updates: {},
            discount_code: discountCode
          })
        })
        .then(response => response.json() )
        .then(cart => {
          fetchDiscount(discountCode);
          console.log('Discount code applied:', cart);
        })
        .catch(error => {
          console.error('Error applying discount code:', error);
        });
      });
}

document.getElementById('discount-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var discountCode = document.getElementById('discount-code').value;
    applyDiscountCode(discountCode);
});

function fetchDiscount(discountCode) {
  fetch('/discount/' + discountCode)
    .then(function(response) {
      if (response.ok) {
        updateCart();
        document.getElementById('remove-discount').style.display = 'inline';
        document.getElementById('discount-error').style.display = 'none';        
      } else {
        document.getElementById('discount-error').innerText = 'Invalid discount code';
        document.getElementById('discount-error').style.display = 'block';
      }
    });
}
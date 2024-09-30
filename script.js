// detect change in href tag and get it value and updatew in another tag

// Function to extract variant ID from the href attribute
function extractVariantId(href) {
    const urlParams = new URLSearchParams(href.split('?')[1]);
    return urlParams.get('variant');
}

// Function to update the hidden input value
function updateHiddenInput(anchor) {
    const variantId = extractVariantId(anchor.href);
    if (variantId) {
        const productCard = anchor.closest('.product-card'); // Assuming each product card has a class 'product-card'
        const hiddenInput = productCard.querySelector('input[type="hidden"][name="id"]');
        if (hiddenInput) {
            hiddenInput.value = variantId;
        }
    }
}

// Observe changes in the href attribute of all product anchor tags
function observeHrefChanges() {
    const anchors = document.querySelectorAll('.product-title[data-instant]');

    anchors.forEach(anchor => {
        // Create a MutationObserver to watch for attribute changes
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
                    updateHiddenInput(anchor);
                }
            });
        });

        // Start observing the anchor tag for attribute changes
        observer.observe(anchor, { attributes: true });
    });
}

const tabTitles = document.querySelectorAll('.ct-explore-collection-title');
const tabContents = document.querySelectorAll('.ct-explore-collection');
const displayDiv = document.querySelector('.ct-explore-best-collection-name');
const bannerText = "BESTSELLERS BANNER";

function adjustHeights() {
    var h3height = 0;
    $('.ct-explore-best .product-title').each(function () {
        if (h3height < $(this).outerHeight()) {
            h3height = $(this).outerHeight();
        };
    });
    $('.ct-explore-best .product-title').height(h3height);

    var h3height = 0;
    $('.ct-explore-best .var_form').each(function () {
        if (h3height < $(this).outerHeight()) {
            h3height = $(this).outerHeight();
        };
    });
    $('.ct-explore-best .var_form').height(h3height);
}

function handleTabClick(title, index) {
    tabTitles.forEach(title => title.classList.remove('is_active'));
    tabContents.forEach(content => content.classList.remove('is_active'));

    title.classList.add('is_active');
    tabContents[index].classList.add('is_active');
    displayDiv.innerText = `${title.innerText} ${bannerText}`;
    // adjustHeights();
}

tabTitles.forEach((title, index) => {
    title.addEventListener('click', () => handleTabClick(title, index));
});

if (tabTitles.length > 0) {
    handleTabClick(tabTitles[0], 0);
}





document.querySelector('.ct-coupon').addEventListener('click', () => {
    document.querySelector('.ct-coupon').classList.toggle('is_open');
});




document.addEventListener('DOMContentLoaded', function () {
    const cartOpenIocn = document.querySelector('.ct-cart-icon');
    const cartCloseIocn = document.querySelector('.drawer__close');
    const documentBody = document.body;

    cartOpenIocn.addEventListener("click", function () {
        documentBody.classList.add("drawerOpen");
    });

    cartCloseIocn.addEventListener("click", function () {
        documentBody.classList.remove("drawerOpen");
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const headerGroup = document.querySelector('.shopify-section-group-header-group');
    const documentBody = document.body;

    document.addEventListener("scroll", function () {
        if (headerGroup.classList.contains("shopify-section-header-sticky")) {
            documentBody.classList.add("headerSticky");
        } else {
            documentBody.classList.remove("headerSticky");
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const priceContainer = document.querySelector('.ct-product-page-content-mobile');
    const priceRegular = priceContainer.querySelector('.price-item--regular');
    const priceOnSale = priceContainer.querySelector('.ct-product-page-content-mobile');

    document.addEventListener("scroll", function () {
        if (headerGroup.classList.contains("shopify-section-header-sticky")) {
            documentBody.classList.add("headerSticky");
        } else {
            documentBody.classList.remove("headerSticky");
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const variantBtn = document.querySelectorAll('.ct-variant-btn');
    const desktopPriceDiv = document.querySelector('.ct-desktop-price');
    const priceDiv = desktopPriceDiv.querySelector('.price-item--regular');
    const compare_at_priceDiv = desktopPriceDiv.querySelector('.ct-price-item--regular');
    variantBtn.forEach(function (btn) {
        btn.addEventListener("click", function () {
            const price = this.getAttribute('data-price');
            const compare_at_price = this.getAttribute('data-compare-at-price');
            if (price && compare_at_price) {
                desktopPriceDiv.querySelector('.price__sale').style.display = "block";
                priceDiv.innerHTML = price;
            } else if (price) {
                desktopPriceDiv.querySelector('.price__regular').style.display = "block";
                compare_at_priceDiv.innerHTML = compare_at_price;
            }
        });
    });
});



document.addEventListener("DOMContentLoaded", function () {
    const variantWrappers = document.querySelectorAll('.ct-variant-select-simple .ct-variant-btn-input');

    variantWrappers.forEach((wrapper) => {
        wrapper.addEventListener("click", function (event) {

        });
    });
});

// document.addEventListener("DOMContentLoaded", function () {
//     const variantWrappers = document.querySelectorAll('.ct-variant-select-simple .ct-variant-btn-input');
//     const wrappers = document.querySelectorAll('.product-sticky-bar-right .ct-variant-btn-input');

//     variantWrappers.forEach((wrapper) => {
//         wrapper.addEventListener("click", function (event) {
//             let dataPrice1 = this.getAttribute('data-price');
//             wrappers.forEach((wrapper) => {
//                 let dataPrice2 = this.getAttribute('data-price');
//                 if (condition) {
                    
//                 }
//             });
//         });
//     });
// });

document.addEventListener("DOMContentLoaded", function () {
    function updatePrice() {
        const checkedRadio = document.querySelector('.ct-variant-select-simple .ct-variant-btn-input:checked');
        if (checkedRadio) {
            const price = checkedRadio.getAttribute('data-price');
            document.querySelector('.sticky-atc-mobile-price').textContent = price;
        }
    }
    
    updatePrice();

    const allRadio = document.querySelectorAll('.ct-variant-select-simple .ct-variant-btn-input');

    allRadio.forEach((radio) => {
        radio.addEventListener('change', function(){
            const newPrice = this.getAttribute('data-price');
            document.querySelector('.sticky-atc-mobile-price').textContent = newPrice;
        });
    });
});

debugger
const bundleAppDiv = document.querySelector('.liquid .cb-bundles');

if (bundleAppDiv.length > 0) {
    const priceElement = document.querySelector('[data-block-type="price"]');
    const quantityElement = document.querySelector('[data-block-type="quantity-selector"]');
    priceElement.style.display = 'none';
    quantityElement.style.display = 'none';
}






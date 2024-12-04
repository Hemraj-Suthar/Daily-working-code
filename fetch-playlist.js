const pageName = __st.p + " Page";
const playlistID = document.getElementById("playlist-id")?.dataset?.playlistId || null;
const data = { shopName: Shopify.shop, page: pageName, id: playlistID };

async function Fetch_Video() {
  try {
      // const response = await fetch(`https://a51d-2405-201-200b-315f-c4a-3d-1c33-3b2a.ngrok-free.app/api/play-list/website`,
      const response = await fetch(`http://localhost:8000/api/play-list/website`,
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(data),
        }
      );
  
      if (!response.ok) { throw new Error("Network response was not ok")}
  
      const responseData = await response.json();
      console.log(responseData.data)
      createVideoHtml(responseData.data);
      initializeSwiper();
  } catch (error) {
     console.error("Error fetching templates:", error);
  }
}

Fetch_Video();

let configureSettingsOuter = "";

function createVideoHtml(responseData) {
    let shortVideoHtml = "";
    let fullVideoHtml = "";
    const configureSettings = responseData.customizeSettings[0];
    configureSettingsOuter = responseData.customizeSettings[0];
    const headingConfig = responseData.customizeSettings[0].heading;

    if (responseData.customizeSettings[0].heading.showHeading) { headingSetup(headingConfig) }
    
    responseData.videoDetails.forEach((playlist) => {
      const video = playlist.videoDetails;
      const products = playlist.productDetails;
      
      shortVideoHtml += `
        <div class="swiper-slide" style="width:320px;" style="width:${configureSettings.carouselView.cardWidthDesktop}px;">
            <video src="${video.shortVideoLink}" autoplay muted loop></video>
            ${configureSettings.template.templateType === "classic" ? `
                ${products.length > 0 ? `
                    <div class="slide_product">
                        <div class="slide_product_inner">
                            <div class="slide_product_img"><img src="${products[0].imageUrl}" alt="${products[0].title}"></div>
                            <div class="slide_product_content">
                                <div style="color:${configureSettings.productTitle.color}; font-size:${configureSettings.productTitle.fontSize}px; font-weight:${configureSettings.productTitle.fontWeight};" class="title">${products[0].title}</div>
                                <div class="price-wrapper">
                                    <div style="color:${configureSettings.prices.salePriceColor};" class="price">${products[0].price}</div>
                                </div>
                            </div>
                        </div>
                        ${configureSettings.addToCart.displayAddToCart ? `
                            <div class="slide_product_btn">
                                <button type="submit" class="Video-add-to-cart-button" aria-haspopup="dialog" ${products[0].variants[0].inventoryQuantity <= 0 ? "disabled":""}
                                    data-videoids="${video.videoId}" data-variantids="${products[0].variants[0].variantId}">
                                    ${products[0].variants[0].inventoryQuantity > 0 ? "Add To Cart" : "Sold out"}
                                </button>
                            </div>` : ""}
                    </div>` : ''}
            ` : configureSettings.template.templateType === "onlyTitle" ? `<div class="slide_product_title"></div>
            ` : configureSettings.template.templateType === "overlay" ? `
                ${products.length > 0 ? `
                    <div class="slide_product_overlay">
                        <div class="slide_product_inner">
                            <div class="slide_product_img"><img src="${products[0].imageUrl}" alt="${products[0].title}"></div>
                            <div class="slide_product_content">
                                <div style="color:${configureSettings.productTitle.color}; font-size:${configureSettings.productTitle.fontSize}px;" class="title">${products[0].title}</div>
                                <div class="price-wrapper">
                                    <div style="color:${configureSettings.prices.salePriceColor};" class="price">${products[0].price}</div>
                                </div>
                            </div>
                        </div>
                         ${configureSettings.addToCart.displayAddToCart ? `
                            <div class="slide_product_btn">
                                <button type="submit" class="Video-add-to-cart-button" aria-haspopup="dialog" ${products[0].variants[0].inventoryQuantity <= 0 ? "disabled":""}
                                    data-videoids="${video.videoId}" data-variantids="${products[0].variants[0].variantId}">
                                    ${products[0].variants[0].inventoryQuantity > 0 ? "Add To Cart" : "Sold out"}
                                </button>
                            </div>` : ""}
                    </div>` : ''}
            ` : ''}
        </div>`;

      
        fullVideoHtml += `
        <div class="swiper-slide fullvideo-wrapper" ${products.length > 0 ? 'style="display: flex;"' : ''}>
            <div class="fullvideo-video ${products.length > 0 ? 'multiple-product' : ''}">
                <video src="${video.fullVideoLink}" class="video" autoplay muted loop></video>
            </div>
            ${products.length === 1 ? `
                  <div class="fullvideo-wrapper-product">
                      ${products.map((product) => `
                          <div class="slide_product_img">
                              <img src="${product.imageUrl}" alt="${product.title}">
                          </div>
                          <div class="slide_product_content">
                              <div class="title">${product.title}</div>
                              <div class="price">${product.price}</div>
                          </div>
                          <div class="slide_product_btn">
                              <a type="submit" name="add" class="Video-more-info-button" 
                                  aria-haspopup="dialog" data-variantids="${product.variants.variantId}" data-videoids="${video.videoId}" 
                                  aria-live="polite" data-sold-out-message="true">
                                  More Info
                              </a>
                              <button type="submit" name="add" class="Video-add-to-cart-button" ${products[0].variants[0].inventoryQuantity <= 0 ? "disabled":""}
                                  aria-haspopup="dialog" data-variantids="${product.variants.variantId}" data-videoids="${video.videoId}" 
                                  aria-live="polite" data-sold-out-message="true">
                                  ${products[0].variants[0].inventoryQuantity > 0 ? "Add To Cart" : "Sold out"}
                              </button>
                          </div>
                      `).join("")}
                  </div>
                `
                : products.length > 1 ? `
                    <div class="product-list">
                        ${products.map((product) => `
                            <div class="product-list-product">
                                <div class="slide_product_img">
                                    <img src="${product.imageUrl}" alt="${product.title}">
                                </div>
                                <div class="slide_product_content">
                                    <div class="title">${product.title}</div>
                                    <div class="price">${product.price}</div>
                                </div>
                                <div class="slide_product_btn">
                                    <button type="submit" name="add" class="Video-shop-now" aria-haspopup="dialog" 
                                        data-variantids="${product.variants.variantId}" data-videoids="${video.videoId}" aria-live="polite" data-sold-out-message="true">
                                        Shop Now
                                    </button>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                `: ''
            }
        </div>`;
    });
  
    var shortVideoWrapper = document.getElementById("short-video-wrapper");
    if (!shortVideoWrapper) { return console.error("Element with ID 'short-video-wrapper' not found.")}
    shortVideoWrapper.innerHTML = shortVideoHtml;
  
    var fullVideoWrapper = document.getElementById("full-video-wrapper");
    if (!fullVideoWrapper) { return console.error("Element with ID 'full-video-wrapper' not found.")}
    fullVideoWrapper.innerHTML = fullVideoHtml;
}

function headingSetup(heading) {
    const headingElement = document.getElementById("ct-video-vibe-heading")
    headingElement.innerHTML = heading.headingText;
    headingElement.style.textAlign = heading.alignment;
    headingElement.style.fontSize = `${heading.fontSize}px`;
    headingElement.style.fontWeight = heading.fontWeight;
    headingElement.style.color = heading.color;
}

function initializeSwiper() {
    var swipertt = new Swiper(".mySwiper", {
        spaceBetween: configureSettingsOuter.carouselView.gapBetweenReels,
        slidesPerView: "auto",
    });

    var swiperdev = new Swiper(".swiper-container", {
        loop: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
       thumbs: {
              swiper: swipertt,
          },
    });

    const allVideos = document.querySelectorAll('.video');

    swiperdev.on('slideChange', function () {
        allVideos.forEach(function(video) {
            video.pause();
            video.currentTime = 0;
        });
    
        var activeSlide = swiperdev.slides[swiperdev.activeIndex];
        var video = activeSlide.querySelector('.video');
        if (video) {
            video.play();
        }
    });

    allVideos.forEach(function(video) {
        video.addEventListener('ended', function() {
            swiperdev.slideNext();
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        var slides = document.querySelectorAll('.swiper_thumb .swiper-slide');
        var swiperMax = document.querySelector('.swiper_max');
        var slideClose = document.querySelector('.slide_close');

        // Check if slides are available
        if (slides.length > 0) {
            slides.forEach(function(slide) {
                slide.addEventListener('click', function() {
                    if (event.target.classList.contains("Video-add-to-cart-button")) {
                        return;
                    }
                    swiperMax.classList.add('active');
                });
            });
        }

        slideClose.addEventListener('click', function() {
            swiperMax.classList.remove('active');
        });

    }, 2000); // Delay in milliseconds (500ms in this case)
});

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("Video-add-to-cart-button")) {
    const variantId = event.target.getAttribute("data-variantids");
    const videoId = event.target.getAttribute("data-videoids");
    console.log(videoId)
    const data = { id: variantId, quantity: 1 };

    fetch("/cart/add.js", {
        body: JSON.stringify(data),
        credentials: "same-origin",
        headers: {"Content-Type": "application/json"},
        method: "POST",
    })
    .then(function (response) { 
        return response.json() 
    })
    .then(function (json) {
        var data = { 
          note: videoId,
          attributes: {
             'Video_vibe': videoId
           }
        };
              return fetch("/cart/update.js", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              });
            })
            .then(function (response) {
              if (!response.ok) {
                throw new Error("Failed to update the cart");
              }
              return response.json();
            })
            .then(function (json) {
              console.log("Cart updated successfully:", json);
            })
    
      .catch(function (err) {
        console.error("Error:", err);
      });
  }
});

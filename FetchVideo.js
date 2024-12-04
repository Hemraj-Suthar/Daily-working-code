const page = __st.p.charAt(0).toUpperCase() + __st.p.slice(1) + " Page";
const playlistElement = document.getElementById("playlist-id");
const playlist_id = playlistElement?.dataset?.playlistId || "";

const data = {
    shopName: Shopify.shop,
    page: page,
    id: playlist_id,
};
console.log(data);

async function Fetch_Video() {
    try {
        const response = await fetch(`https://5f95-2405-201-200b-390f-2c6c-25a4-4456-d71c.ngrok-free.app/api/play-list/website`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
        );

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const responseData = await response.json();
        console.log("Fetch-video", responseData);
        createVideoHtml(responseData);
    } catch (error) {
        console.error("Error fetching templates:", error);
    }
}

Fetch_Video();

function createVideoHtml(responseData) {
    var shortVideoHtml = "";
    var fullVideoHtml = "";


    if (responseData.data[0].playListType === "action") {
        responseData.data[0].playListType.videoDetails.forEach(video => {
            shortVideoHtml += `
                <div class="swiper-slide ct_short_details">
                    <div class="ct_slide_product_video">
                        <video src="${video.videoDetails.shortVideoLink}" autoplay muted loop ></video>
                    </div>
                    <div class="ct_slide_product_actionBtn">
                        <a src="${video.buttonLink}">${video.buttonName}</a>
                    </div>
                </div>`;
        });
    } else {
        responseData.data[0].playListType.videoDetails.forEach(video => {
            shortVideoHtml += `
                <div class="swiper-slide ct_short_details">
                    <div class="ct_slide_product_video">
                        <video src="${video.videoDetails.shortVideoLink}" autoplay muted loop ></video>
                    </div>
                    <div class="ct_slide_product">
                        <div class="ct_slide_product_inner">
                                <div class="ct_slide_product_img">
                                <img src="${video.productDetails.imageUrl}" alt="">
                                </div>
                                <div class="ct_slide_product_content">
                                    <div class="ct_pro_title" style="text-align: ${video.configureData[0].alignment}; font-size: ${video.configureData[0].fontSize}"; font-size: ${video.configureData[0].fontWeight}>${video.productDetails.title}</div>
                                    <div class="ct_pro_price">${video.productDetails.price}</div>
                                </div>
                            </div>
                    </div>
                </div>`;

            fullVideoHtml += `
                <div class="swiper-slide ct_full_details">
                    <div class="ct_product"></div>
                    <div class="ct_slide_product_video">
                        <video src="${video.videoDetails.fullVideoLink}" class="video" autoplay muted></video>
                    </div>
                    <div class="ct_full_slide_product">
                        <div class="slide_product_inner">
                                <div class="ct_full_slide_product_img">
                                    <img src="${video.productDetails.imageUrl}" alt="">
                                </div>
                                
                                <div class="ct_full_slide_product_content">
                                    <div class="title">${video.productDetails.title}</div>
                                    <div class="price">${video.productDetails.price}</div>
                                </div>
                                <div class="ct_full_slide_product_btn-main">
                                    <button id="" type="submit" name="add" class="Video-add-to-cart-button slide_product_btn" aria-haspopup="dialog" "
                                        aria-live="polite" data-sold-out-message="true">
                                        Add To Cart
                                    </button>
                                </div>
                            </div>
                    </div>
                </div>`;
        });
    }

    // responseData.data.forEach((playlist) => {
    //     playlist.videoDetails.forEach((video) => {
    //         if (video.playListType === "action") {
    //             shortVideoHtml += `
    //         <div class="swiper-slide ct_short_details">
    //             <div class="ct_slide_product_video">
    //                 <video src="${video.videoDetails.shortVideoLink}" autoplay muted loop ></video>
    //             </div>
    //             <div class="ct_slide_product_actionBtn">
    //                 <a src="${video.videoDetails.shortVideoLink}">${video.videoDetails.shortVideoLink}</a>
    //             </div>
    //             <div class="ct_slide_product">
    //                 <div class="ct_slide_product_inner">
    //                      <div class="ct_slide_product_img">
    //                         <img src="${video.productDetails.imageUrl}" alt="">
    //                      </div>
    //                      <div class="ct_slide_product_content">
    //                          <div class="ct_pro_title">${video.productDetails.title}</div>
    //                          <div class="ct_pro_price">${video.productDetails.price}</div>
    //                      </div>
    //                  </div>
    //             </div>
    //         </div>`;
    //         } else {
    //             shortVideoHtml += `
    //                 <div class="swiper-slide ct_short_details">
    //                     <div class="ct_slide_product_video">
    //                       <video src="${video.videoDetails.shortVideoLink}" autoplay muted loop ></video>
    //                     </div>
    //                     <div class="ct_slide_product">
    //                         <div class="ct_slide_product_inner">
    //                              <div class="ct_slide_product_img">
    //                                 <img src="${video.productDetails.imageUrl}" alt="">
    //                              </div>
    //                              <div class="ct_slide_product_content">
    //                                  <div class="ct_pro_title">${video.productDetails.title}</div>
    //                                  <div class="ct_pro_price">${video.productDetails.price}</div>
    //                              </div>
    //                          </div>
    //                     </div>
    //                 </div>`;

    //             fullVideoHtml += `
    //                 <div class="swiper-slide ct_full_details">
    //                     <div class="ct_product"></div>
    //                     <div class="ct_slide_product_video">
    //                     <video src="${video.videoDetails.fullVideoLink}" class="video" autoplay muted></video>
    //                     </div>
    //                     <div class="ct_full_slide_product">
    //                         <div class="slide_product_inner">
    //                              <div class="ct_full_slide_product_img">
    //                                 <img src="${video.productDetails.imageUrl}" alt="">
    //                              </div>

    //                              <div class="ct_full_variant_wrapper">
    //                                 <div>${video.videoDetails.imageUrl}" alt="">
    //                              </div>

    //                              <div class="ct_full_slide_product_content">
    //                                  <div class="title">${video.productDetails.title}</div>
    //                                  <div class="price">${video.productDetails.price}</div>
    //                              </div>
    //                               <div class="ct_full_slide_product_btn-main">
    //                                   <button id="" type="submit" name="add" class="Video-add-to-cart-button slide_product_btn" aria-haspopup="dialog" "
    //                                        aria-live="polite" data-sold-out-message="true">

    //                                       Add To Cart
    //                                   </button>
    //                              </div>
    //                          </div>
    //                     </div>
    //                 </div>`;

    //         }
    //     });
    // });

    var shortVideoWrapper = document.getElementById("short-video-wrapper");
    if (!shortVideoWrapper) {
        console.error("Element with ID 'short-video-wrapper' not found.");
        return;
    }
    shortVideoWrapper.innerHTML = shortVideoHtml;

    var fullVideoWrapper = document.getElementById("full-video-wrapper");
    if (!fullVideoWrapper) {
        console.error("Element with ID 'full-video-wrapper' not found.");
        return;
    }
    fullVideoWrapper.innerHTML = fullVideoHtml;
}

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("Video-add-to-cart-button")) {
        var variantId = event.target.getAttribute("data-variantids");
        var data = {
            id: variantId,
            quantity: 1,
        };

        fetch("/cart/add.js", {
            body: JSON.stringify(data),
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                var data = {
                    note: t,
                    attributes: {
                        Videovibe_value: true,
                    },
                };

                fetch("/cart/update.js", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                })
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (json) {
                        // Handle the success case
                    })
                    .catch(function (error) {
                        console.error("Error:", error);
                    });
            })
            .catch(function (err) {
                console.error("Error:", err);
            });
    }
});




{/* <div class="ct_slide_product">
<div class="ct_slide_product_inner">
        <div class="ct_slide_product_img">
        <img src="${video.productDetails.imageUrl}" alt="">
        </div>
        <div class="ct_slide_product_content">
            <div class="ct_pro_title">${video.productDetails.title}</div>
            <div class="ct_pro_price">${video.productDetails.price}</div>
        </div>
    </div>
</div> */}



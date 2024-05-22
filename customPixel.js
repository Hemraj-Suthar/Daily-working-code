analytics.subscribe('checkout_completed', (event) => {
    // Example for accessing event data
    const checkout = event.data.checkout;

    const checkoutTotalPrice = checkout.totalPrice.amount;

    (function (c, l, a, r, i, t, y) {
        c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
        t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
        y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", "hpscxt8n7g");

    let script = document.createElement('script');
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=AW-11110240138";
    script.className = 'testhem';
    console.log(script);

    // Append the script element to the head
    document.head.appendChild(script);
    console.log("script added");

    // Define the gtag function and initialize it
    script.onload = function () {
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'AW-11110240138');

        console.log(checkoutTotalPrice, checkout.currencyCode, checkout.order.id);
        
        gtag('event', 'conversion', {
        'send_to': 'AW-11110240138/n2z0CLeevO8YEIqf47Ep',
        'value':  checkoutTotalPrice/100,
        'currency': checkout.currencyCode,
        'transaction_id': checkout.order.id
      });
    };

    

    // const payload = {
    //     event_name: event.name,
    //     event_data: {
    //         totalPrice: checkoutTotalPrice,
    //         discountCodesUsed: allDiscountCodes,
    //         firstItem: customItemPayload,
    //         paymentTransactions: paymentTransactions,
    //     },
    // };

    // Example for sending event data to third party servers
    // fetch('https://example.com/pixel', {
    //     method: 'POST',
    //     body: JSON.stringify(payload),
    //     keepalive: true,
    // });
});


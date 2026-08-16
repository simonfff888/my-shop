/* 页面逻辑 — 一般不需要改这个文件 */

(function () {
  "use strict";

  // 金额显示格式，例如 "$28.00 USD"
  function fmtMoney(n) {
    return CONFIG.currencySymbol + Number(n).toFixed(2) + " " + CONFIG.currency;
  }

  // ── 1. 填充基本信息 ──────────────────────────────────────
  document.title = CONFIG.siteName;
  document.getElementById("brand").textContent = CONFIG.siteName;
  document.getElementById("hero-title").textContent = CONFIG.siteName;
  document.getElementById("hero-subtitle").textContent = CONFIG.tagline;
  document.getElementById("footer-text").textContent =
    "© " + new Date().getFullYear() + " " + CONFIG.siteName + " · " + CONFIG.tagline;

  var igLink = document.getElementById("ig-link");
  igLink.href = "https://www.instagram.com/" + CONFIG.instagram.replace(/^@/, "");

  var emailLink = document.getElementById("email-link");
  emailLink.href = "mailto:" + CONFIG.email;
  emailLink.textContent = CONFIG.email;

  var shipInfo = document.getElementById("shipping-info");
  shipInfo.textContent = CONFIG.shippingFee > 0
    ? "We ship worldwide. Flat-rate shipping: " + fmtMoney(CONFIG.shippingFee) + " per order."
    : "We ship worldwide — shipping is free!";

  // ── 2. 渲染商品卡片 ──────────────────────────────────────
  var grid = document.getElementById("product-grid");
  var paypalContainers = []; // 收集每个商品的购买按钮信息

  CONFIG.products.forEach(function (p) {
    var card = document.createElement("article");
    card.className = "product-card";

    var qtyOptions = "";
    for (var q = 1; q <= 9; q++) {
      qtyOptions += '<option value="' + q + '">' + q + "</option>";
    }

    card.innerHTML =
      '<img class="product-img" alt="">' +
      '<div class="product-body">' +
        '<h3 class="product-name"></h3>' +
        '<p class="product-desc"></p>' +
        '<div class="buy-row">' +
          '<label class="qty-label">Qty' +
            '<select class="qty-select">' + qtyOptions + "</select>" +
          "</label>" +
          '<span class="price"></span>' +
        "</div>" +
        '<p class="total-line"></p>' +
        '<div class="paypal-container"></div>' +
      "</div>";

    card.querySelector(".product-img").src = p.image;
    card.querySelector(".product-img").alt = p.name;
    card.querySelector(".product-name").textContent = p.name;
    card.querySelector(".product-desc").textContent = p.description;
    card.querySelector(".price").textContent = fmtMoney(p.price);

    var select = card.querySelector(".qty-select");
    var totalLine = card.querySelector(".total-line");

    function updateTotal() {
      var qty = Number(select.value);
      var total = p.price * qty + CONFIG.shippingFee;
      totalLine.textContent = "Total incl. shipping: " + fmtMoney(total);
    }
    select.addEventListener("change", updateTotal);
    updateTotal();

    grid.appendChild(card);
    paypalContainers.push({
      card: card,
      product: p,
      select: select
    });
  });

  // ── 3. PayPal 支付按钮 ───────────────────────────────────
  var notice = document.getElementById("paypal-notice");

  // 还没有填 Client ID：显示"私信下单"提示
  if (!CONFIG.paypalClientId || CONFIG.paypalClientId.indexOf("YOUR_") === 0) {
    notice.hidden = false;
    notice.innerHTML =
      "💡 Online payment is not set up yet. " +
      '<a href="' + igLink.href + '" target="_blank" rel="noopener">DM me on Instagram</a>' +
      " to place your order!";
    return;
  }

  // 加载 PayPal SDK
  var script = document.createElement("script");
  script.src = "https://www.paypal.com/sdk/js?client-id=" +
    CONFIG.paypalClientId + "&currency=" + CONFIG.currency;
  script.onload = renderButtons;
  script.onerror = function () {
    notice.hidden = false;
    notice.textContent = "PayPal failed to load. Please refresh the page and try again.";
  };
  document.body.appendChild(script);

  function renderButtons() {
    paypalContainers.forEach(function (entry) {
      var container = entry.card.querySelector(".paypal-container");
      var product = entry.product;

      paypal.Buttons({
        style: {
          layout: "vertical",
          color: "gold",
          shape: "pill",
          label: "paypal",
          height: 44
        },
        createOrder: function (data, actions) {
          var qty = Number(entry.select.value);
          var itemTotal = (product.price * qty).toFixed(2);
          var grandTotal = (product.price * qty + CONFIG.shippingFee).toFixed(2);

          var amount = {
            currency_code: CONFIG.currency,
            value: grandTotal,
            breakdown: {
              item_total: {
                currency_code: CONFIG.currency,
                value: itemTotal
              }
            }
          };
          if (CONFIG.shippingFee > 0) {
            amount.breakdown.shipping = {
              currency_code: CONFIG.currency,
              value: CONFIG.shippingFee.toFixed(2)
            };
          }

          return actions.order.create({
            purchase_units: [{
              description: product.name + " (Qty: " + qty + ")",
              amount: amount,
              items: [{
                name: product.name,
                quantity: String(qty),
                unit_amount: {
                  currency_code: CONFIG.currency,
                  value: product.price.toFixed(2)
                }
              }]
            }]
          });
        },
        onApprove: function (data, actions) {
          return actions.order.capture().then(function () {
            container.innerHTML =
              '<div class="order-success">✅ Thank you! Your order has been placed. ' +
              "We will email you when it ships.</div>";
          });
        },
        onError: function () {
          container.innerHTML =
            '<div class="order-error">Something went wrong. Please try again, ' +
            "or DM me on Instagram.</div>";
        }
      }).render(container);
    });
  }
})();

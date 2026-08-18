/* 页面逻辑 — 一般不需要改这个文件 */

(function () {
  "use strict";

  // 金额显示格式，例如 "$28.00 USD"
  function fmtMoney(n) {
    return CONFIG.currencySymbol + Number(n).toFixed(2) + " " + CONFIG.currency;
  }

  // ── 1. 填充基本信息 ──────────────────────────────────────
  document.title = CONFIG.siteName;

  var announcement = document.getElementById("announcement");
  if (CONFIG.announcement) {
    announcement.textContent = CONFIG.announcement;
  } else {
    announcement.remove();
  }

  document.getElementById("brand").textContent = CONFIG.siteName;
  document.getElementById("hero-title").textContent = CONFIG.siteName;
  document.getElementById("hero-subtitle").textContent = CONFIG.tagline;
  document.getElementById("footer-text").textContent =
    "© " + new Date().getFullYear() + " " + CONFIG.siteName + " · " + CONFIG.tagline;
  document.getElementById("footer-about").textContent = CONFIG.tagline;

  var igHref = "https://www.instagram.com/" + CONFIG.instagram.replace(/^@/, "");
  var emailHref = "mailto:" + CONFIG.email;

  document.getElementById("ig-link").href = igHref;
  document.getElementById("email-link").href = emailHref;
  document.getElementById("email-link").textContent = CONFIG.email;
  document.getElementById("footer-ig").href = igHref;
  document.getElementById("footer-email").href = emailHref;

  var shipInfo = document.getElementById("shipping-info");
  shipInfo.textContent = CONFIG.shippingFee > 0
    ? "We ship worldwide. Flat-rate shipping: " + fmtMoney(CONFIG.shippingFee) + " per order."
    : "We ship worldwide — shipping is free!";

  // ── 2. 渲染商品卡片 ──────────────────────────────────────
  var grid = document.getElementById("product-grid");
  var paypalContainers = []; // 收集每个商品的购买按钮信息
  var hasPricedProduct = false;

  CONFIG.products.forEach(function (p) {
    var card = document.createElement("article");
    card.className = "product-card";
    card.dataset.category = p.category || "";

    var qtyOptions = "";
    for (var q = 1; q <= 9; q++) {
      qtyOptions += '<option value="' + q + '">' + q + "</option>";
    }

    card.innerHTML =
      '<div class="product-img-wrap">' +
        '<img class="product-img" alt="">' +
        '<span class="product-badge"></span>' +
      "</div>" +
      '<div class="product-body">' +
        '<h3 class="product-name"></h3>' +
        '<p class="product-desc"></p>' +
        '<div class="buy-row">' +
          '<label class="qty-label">Qty' +
            '<select class="qty-select">' + qtyOptions + "</select>" +
          "</label>" +
          '<div class="price-block">' +
            '<span class="price-original" hidden></span>' +
            '<span class="price"></span>' +
          "</div>" +
        "</div>" +
        '<p class="total-line"></p>' +
        '<div class="paypal-container"></div>' +
      "</div>";

    card.querySelector(".product-img").src = p.image;
    card.querySelector(".product-img").alt = p.name;
    card.querySelector(".product-name").textContent = p.name;
    card.querySelector(".product-desc").textContent = p.description;

    var badge = card.querySelector(".product-badge");
    if (p.badge) {
      badge.textContent = p.badge;
    } else {
      badge.remove();
    }

    // 价格为 0：不显示价格、数量和购买按钮（先空着）
    if (!(Number(p.price) > 0)) {
      card.querySelector(".buy-row").remove();
      card.querySelector(".total-line").remove();
      card.querySelector(".paypal-container").remove();
      grid.appendChild(card);
      return;
    }

    hasPricedProduct = true;
    card.querySelector(".price").textContent = fmtMoney(p.price);

    if (Number(p.originalPrice) > p.price) {
      var orig = card.querySelector(".price-original");
      orig.textContent = fmtMoney(p.originalPrice);
      orig.hidden = false;
    }

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

  // ── 3. 分类标签 ──────────────────────────────────────────
  var chipsBox = document.getElementById("category-chips");
  var categories = [];
  CONFIG.products.forEach(function (p) {
    if (p.category && categories.indexOf(p.category) === -1) {
      categories.push(p.category);
    }
  });

  if (categories.length > 0) {
    chipsBox.hidden = false;

    function makeChip(label, cat) {
      var chip = document.createElement("button");
      chip.className = "chip" + (cat === "All" ? " active" : "");
      chip.type = "button";
      chip.textContent = label;
      chip.dataset.cat = cat;
      return chip;
    }

    chipsBox.appendChild(makeChip("All", "All"));
    categories.forEach(function (c) {
      chipsBox.appendChild(makeChip(c, c));
    });

    chipsBox.addEventListener("click", function (e) {
      if (!e.target.classList.contains("chip")) return;
      var cat = e.target.dataset.cat;
      chipsBox.querySelectorAll(".chip").forEach(function (chip) {
        chip.classList.toggle("active", chip === e.target);
      });
      grid.querySelectorAll(".product-card").forEach(function (card) {
        var match = cat === "All" || card.dataset.category === cat;
        card.classList.toggle("card-hidden", !match);
      });
    });
  }

  // ── 4. PayPal 支付按钮 ───────────────────────────────────
  var notice = document.getElementById("paypal-notice");

  // 还没有填 Client ID：显示"私信下单"提示
  if (!CONFIG.paypalClientId || CONFIG.paypalClientId.indexOf("YOUR_") === 0) {
    notice.hidden = false;
    notice.innerHTML =
      "💡 Online payment is not set up yet. " +
      '<a href="' + igHref + '" target="_blank" rel="noopener">DM me on Instagram</a>' +
      " to place your order!";
    return;
  }

  // 没有一件商品填了价格：不需要加载 PayPal
  if (!hasPricedProduct) return;

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
          shape: "rect",
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

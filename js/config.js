/* ============================================================
   网站设置 — 你只需要改这个文件！
   (Settings — you only need to edit this file!)
   ============================================================ */

const CONFIG = {

  // ── 基本信息 ──────────────────────────────────────────────
  // 网站名字（显示在页面顶部、首页大标题和浏览器标签上）
  siteName: "My Shop",

  // 首页大标题下面的小字介绍
  tagline: "Handmade with love, shipped worldwide.",

  // 页面顶部黑色公告栏的文字（比如优惠活动）。不需要就写 ""（空引号）
  announcement: "✨ Free shipping on orders over $50",

  // 你的 Instagram 用户名（只要用户名，不要 @ 和网址）
  instagram: "your_instagram_username",

  // 你的联系邮箱
  email: "you@example.com",

  // ── PayPal 收款 ──────────────────────────────────────────
  // 重要！先在 developer.paypal.com 注册应用（步骤见 README.md 第 4 节），
  // 把获得的 Client ID 粘贴到下面引号里，网站才能收款。
  paypalClientId: "YOUR_PAYPAL_CLIENT_ID",

  // 货币代码：USD = 美元。也可以改成 EUR（欧元）、GBP（英镑）、JPY（日元）等
  currency: "USD",
  // 货币符号（显示在价格前面）
  currencySymbol: "$",

  // 每单运费（美元）。如果包邮，改成 0
  shippingFee: 5,

  // ── 商品列表 ─────────────────────────────────────────────
  // 每个商品是一个 { ... }，多个商品之间用英文逗号隔开。
  //   name:          商品名（显示在卡片上）
  //   price:         价格（数字，单位见上面的 currency）。
  //                  填 0 = 先不显示价格和购买按钮（空着，以后填上就有）
  //   originalPrice: 划线原价，大于 price 时才显示（比如打折）。
  //                  没有原价就填 0
  //   badge:         图片角上的小标签（比如 "New"、"Sale"）。
  //                  不需要就写 ""（空引号）
  //   category:      分类名（显示在"Shop by Category"分类按钮里）。
  //                  不需要分类就写 ""（空引号）
  //   image:         商品图片路径（照片放进 images 文件夹，
  //                  比如 "images/photo1.jpg"）
  //   description:   商品介绍（一两句话）
  //
  // 下面的 3 个是示例商品，替换成你自己的就行。
  // 价格都先填了 0（空着），你定好价格后把数字填上，购买按钮就会出现。
  products: [
    {
      name: "Handmade Ceramic Mug",
      price: 0,
      originalPrice: 0,
      badge: "New",
      category: "Home",
      image: "images/placeholder.svg",
      description: "Hand-thrown and glazed in small batches. Each mug is one of a kind."
    },
    {
      name: "Linen Tote Bag",
      price: 0,
      originalPrice: 0,
      badge: "",
      category: "Accessories",
      image: "images/placeholder.svg",
      description: "Sturdy everyday tote made from natural linen. Fits a laptop, groceries, and everything in between."
    },
    {
      name: "Scented Soy Candle",
      price: 0,
      originalPrice: 0,
      badge: "",
      category: "Home",
      image: "images/placeholder.svg",
      description: "Hand-poured soy candle with a soft, cozy scent. Burns for 40+ hours."
    }
  ]
};

# 我的小店网站使用指南

这是一个为 Instagram 简介设计的个人商品小店网站：
- 🌍 全英文界面，面向海外客户，手机 / 电脑自适应
- 💰 用 PayPal 在线收款（客户可以刷信用卡，不需要 PayPal 账号）
- 🆓 免费托管在 GitHub Pages

---

## 1. 本地预览

双击打开 `index.html` 就能在浏览器里看到网站效果。

## 2. 修改网站内容（最重要的一步）

所有需要改的东西都在 **`js/config.js`** 一个文件里，文件里有中文注释，用记事本打开改就行：

| 想改什么 | 改哪里 |
| --- | --- |
| 网站名字 | `siteName` |
| 首页介绍语 | `tagline` |
| Instagram 账号 | `instagram`（只填用户名，不要 @） |
| 联系邮箱 | `email` |
| 商品列表 | `products`（名字、价格、图片、介绍） |
| 运费 | `shippingFee`（填 0 = 包邮） |
| 货币 | `currency`（默认美元 USD） |

**换商品照片**：把照片放进 `images` 文件夹，然后把对应商品的 `image` 改成 `"images/你的照片.jpg"`。

FAQ 里的常见问题文字在 `index.html` 里，直接改里面的英文就行。

## 3. 设置 PayPal 收款（不设置就无法在线付款）

1. 打开 [paypal.com](https://www.paypal.com) 注册一个 **Business（商业）账户**（个人账户也可以收款，但建议注册商业账户，信息更全）。
2. 用同一个账号登录 [developer.paypal.com](https://developer.paypal.com)。
3. 进入 **Apps & Credentials（应用和凭证）** 页面。
4. 点击 **Create App（创建应用）**，随便起个名字（比如 my-shop）。
5. 创建后，把页面上的 **Client ID** 复制下来。
6. 粘贴到 `js/config.js` 的 `paypalClientId` 里（替换掉 `YOUR_PAYPAL_CLIENT_ID`）。

网站上的 PayPal 按钮会在付款时自动加上运费，客户付款后钱会直接进你的 PayPal 账户。

## 4. 发布到网上（免费）

网站最终会有一个类似 `https://你的用户名.github.io/my-shop/` 的网址，可以直接放进 Instagram 简介。

1. **注册 GitHub**：打开 [github.com](https://github.com) 注册一个免费账号（这个账号名会出现在你的网址里，建议起个好听的名字）。
2. **安装 Git**：打开 [git-scm.com](https://git-scm.com) 下载安装（一路点下一步即可）。
3. **上传网站**：安装完 Git 后，在本文件夹（my-shop）里右键 → "Git Bash Here"，依次运行：

   ```bash
   git init
   git add .
   git commit -m "first version"
   git branch -M main
   ```

   然后回到 github.com，点击右上角 **+** → **New repository**，仓库名填 `my-shop`，其他保持默认，点 **Create repository**。回到 Git Bash 继续运行（把 `你的用户名` 换成你的 GitHub 用户名）：

   ```bash
   git remote add origin https://github.com/你的用户名/my-shop.git
   git push -u origin main
   ```

4. **开启网页**：在 GitHub 仓库页面点 **Settings** → 左侧 **Pages** → **Branch** 选 `main` → **Save**。等 1-2 分钟，网页就会出现在 `https://你的用户名.github.io/my-shop/`。

5. 把网址放进 Instagram 简介就完成了 ✅

## 5. 常见问题

**为什么用 PayPal 而不是 Stripe？**
Stripe 需要一台服务器来处理付款，免费静态托管上做不了；PayPal 按钮纯前端就能用，和免费托管完美搭配。以后想加 Stripe 也随时可以升级。

**客户必须注册 PayPal 才能付款吗？**
不用。PayPal 结账页支持直接用信用卡/借记卡付款，客户不需要 PayPal 账号。

**以后想改商品怎么办？**
改 `js/config.js` 保存后，重新执行第 4 步里的这三条命令上传：

```bash
git add .
git commit -m "update"
git push
```

**Instagram 分享时想显示预览图？**
发布上线后，把 `index.html` 里 `og:image` 的值改成完整网址，比如 `https://你的用户名.github.io/my-shop/images/placeholder.svg`。

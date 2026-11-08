# dom-simon-sports-tore

A modern, responsive landing page for an online sports retailer. Built with plain HTML, CSS and JavaScript, with no frameworks, libraries or build step.

**Live site:** https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/

## Features

- **Responsive layout** that adapts from large desktops down to phones, using CSS Flexbox, Grid and media queries
- **Mobile navigation** with a hamburger menu and a collapsible search bar
- **Shopping cart** with a live item counter badge and a toast notification when items are added
- **Cart pop-up** that lists items, lets you change quantities, remove items, clear the cart, and shows a running total
- **Product search** with a suggestions dropdown, keyboard navigation (arrow keys, Enter, Esc) and a full results section
- **Featured categories** grid for activewear, footwear, fitness gear and outdoor and team sports equipment
- **Trending products** with images, star ratings, prices and Add to Cart buttons
- **3D "Why shop with us" section** with tilt-on-hover cards, a flip-in scroll animation and a CSS-built animated delivery van
- **Newsletter signup** with client-side email validation
- **Accessibility touches:** semantic HTML5, keyboard-friendly controls, ARIA labels, visible focus styles, and reduced-motion support

## Tech stack

- HTML5
- CSS3 (custom properties, Grid, Flexbox, 3D transforms, keyframe animations)
- Vanilla JavaScript (no dependencies)
- Google Fonts (Barlow and Barlow Condensed), with system-font fallbacks

## Project structure

```
.
├── index.html      # Page markup
├── styles.css      # All styling, including responsive rules and animations
├── script.js       # Cart, search, menu toggle, newsletter validation, 3D effects
├── images/         # Product photos
└── README.md
```

## Getting started

No installation is needed.

1. Download or clone the repository:
   ```bash
   git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   cd YOUR-REPO-NAME
   ```
2. Open `index.html` in your browser.

To serve it locally instead (optional):

```bash
# Python 3
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploying to GitHub Pages

1. Push the project to a **public** GitHub repository, with `index.html` at the top level.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**, choose `main` and `/ (root)`, then click **Save**.
4. After a minute or two, the site is live at `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`.

## Customising

### Add or edit products

Searchable products live in the `PRODUCTS` array in the search section of `script.js`:

```js
{ name: 'Velocity Pro Running Shoes', price: 129, cat: 'Performance Footwear',
  tags: 'shoes sneakers trainers run running jogging',
  h: 18, r: 4.5, n: 212, img: 'images/velocity-pro-running-shoes.jpg' }
```

| Field   | Meaning                                                       |
|---------|---------------------------------------------------------------|
| `name`  | Product name (also used as the cart item name)                |
| `price` | Price as a number                                             |
| `cat`   | Category label shown in search results                        |
| `tags`  | Extra keywords so search finds the product                    |
| `h`     | Hue (0-360) for the placeholder colour when there is no image |
| `r`     | Rating out of 5                                               |
| `n`     | Number of reviews                                             |
| `img`   | Path to the product image (optional)                          |

The six cards in the **Trending now** section are written directly in `index.html`. Edit them there, and keep each card's `data-price` attribute in sync with the price shown.

### Add product images

1. Put images in the `images/` folder. A 4:3 ratio such as 800 x 600 works best, ideally under 150 KB each.
2. Reference them with an `<img>` tag in `index.html` (trending cards) and the `img` field in `script.js` (search results).

### Change the look

All colours and fonts are CSS variables at the top of `styles.css`:

```css
:root{
  --bg:#121212;       /* page background */
  --accent:#FF5500;   /* buttons and highlights */
  --text:#fff;
}
```

### Tune the 3D effects

- Van size: add `.van-scene{scale:1.3}` to `styles.css`.
- Van spin speed: change `9s` in the `.van` rule's `vanSpin` animation.
- Card tilt strength: change the `16` values in the 3D cards block in `script.js`.

## Newsletter signup (backend needed)

The signup form validates the email in the browser but does not store it anywhere yet, because GitHub Pages only serves static files. To collect emails, connect the form to an email marketing service (such as Brevo, EmailOctopus or MailerLite), a form-backend service, or your own server. Then update the `fetch` call in the newsletter handler in `script.js`:

```js
fetch('https://YOUR-ENDPOINT-URL/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: value })
});
```

Never put secret API keys in front-end code, because anyone can read them in the browser.

## Known limitations

- This is a front-end demo. The cart lives in memory and resets on page refresh, and **Checkout is a placeholder** that does not take payments.
- Product data is stored in JavaScript, not a database.
- GitHub Pages is not intended for hosting a live online store that processes real transactions. If the store goes live, move to a host that allows e-commerce and add a real checkout and backend.

## Browser support

Works in current versions of Chrome, Edge, Firefox and Safari. The 3D effects and scroll animations use modern CSS features. Browsers without support still show all content, just without the animation.

## License

Add your preferred license here, for example MIT. See [choosealicense.com](https://choosealicense.com/) for help picking one.

&copy; 2026 Dom Simon Sports Store

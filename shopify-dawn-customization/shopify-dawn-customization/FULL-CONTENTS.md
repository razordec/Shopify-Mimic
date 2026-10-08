### File path (README.md)
```markdown
# Dawn OS 2.0 customization package

A modular extension package for a current Shopify Dawn theme. It deliberately does not replace Dawn core files. Copy the included directories into the theme, then use the Shopify theme editor to select collections and configure sections.

## Included files

- `sections/hero-banner.liquid` — image hero with full-bleed overlay, CTAs and small/medium/viewport heights. White text and a black overlay with a 70% minimum enforce at least 4.5:1 contrast against even a white background pixel (sRGB compositing).
- `sections/featured-products.liquid` and `snippets/product-card.liquid` — configurable product grid and reusable product card.
- `sections/product-detail-enhancements.liquid` — variant changes, URL variant parameter, featured image change, low-stock notice, purchase form, sticky add bar and up to three details/summary accordions.
- `sections/cart-drawer.liquid` — cart drawer, quantity updates, subtotal and threshold progress message.
- `snippets/custom-seo.liquid` — canonical, Open Graph/Twitter metadata and Product JSON-LD.
- `assets/custom-theme.css`, `assets/custom-theme.js` — shared variables/styling and vanilla JavaScript.
- JSON templates for index, product, collection, cart and password.

## Install

1. Duplicate the live theme and work on the unpublished copy.
2. Copy the `assets`, `sections`, `snippets`, and `templates` directories into the theme, merging rather than replacing existing files.
3. In `layout/theme.liquid`, inside `<head>`, add `{% render 'custom-seo' %}`. Dawn already emits a canonical link and may emit overlapping social metadata; remove or avoid duplicate tags if the existing theme already handles them. Add the CSS globally if you want styling available to the reusable snippet on all templates: `{{ 'custom-theme.css' | asset_url | stylesheet_tag }}`. The product and cart sections load their own styles/scripts.
4. Assign the new JSON templates to the desired pages/products/collections in Shopify admin. The collection/cart/password templates reference Dawn's standard section types and settings; compare those section settings with the installed Dawn version and adjust only if Dawn has changed its schema.
5. To open the drawer from a custom cart button, add `data-cart-open` to that button, or dispatch `document.dispatchEvent(new Event('cart:open'))`. The drawer has a server-rendered cart fallback and exposes `cart:refresh` for refreshes after external cart mutations.
6. To use the card in a collection/search Liquid loop: `{% render 'product-card', product: product, quick_add: true %}`. Quick add uses Shopify's standard cart-add endpoint; it does not depend on a custom cart API.
7. Select the featured collection in the section editor. Add a product description accordion block in the product section and maintain its content through the editor. Shipping/returns copy should reflect the merchant's actual policies.
8. Test keyboard navigation, screen-reader labels, responsive breakpoints, variant changes, sold-out products, missing images, empty carts and Shopify Markets/currency formatting in an unpublished theme before publishing.

## Notes and boundaries

- The cart drawer updates quantity through Shopify's `/cart/change.js` endpoint and reloads after successful quantity changes to keep all line data synchronized. Checkout remains Shopify's hosted checkout.
- Dawn header/cart icons are not rewritten. If a Dawn cart trigger is desired, add `data-cart-open` to the relevant button in the theme editor/code or use the documented custom trigger.
- The product schema emits one Product JSON-LD object for the selected variant. Validate against Shopify's current structured-data expectations and remove duplicate Product JSON-LD from Dawn or installed apps.
- Shopify schema labels are English source labels and Shopify's locale system/translation files can translate merchant-facing storefront copy. This package does not modify Dawn locale files.
- No Dawn core files are rewritten. The only required integration is a small render/style insertion in `layout/theme.liquid` if global SEO metadata and globally available shared styles are wanted.
```

### File path (assets/custom-theme.css)
```css
:root{--custom-accent:#b42318;--custom-space:1rem;--custom-card-radius:.25rem;--custom-focus:#005fcc;--custom-surface:#fff;--custom-text:#181818}.fp{padding-block:clamp(2rem,5vw,5rem)}.fp__grid{display:grid;grid-template-columns:repeat(var(--fp-cols,4),minmax(0,1fr));gap:var(--fp-gap,20px);padding:0;list-style:none}.custom-card{height:100%;background:var(--custom-surface);color:var(--custom-text);border-radius:var(--custom-card-radius);overflow:hidden}.custom-card__media{display:block;position:relative;aspect-ratio:1/1;background:#f4f4f4}.custom-card__media img{display:block;width:100%;height:100%;object-fit:cover}.custom-card__placeholder{display:block;height:100%}.custom-card__badge{position:absolute;top:.75rem;left:.75rem;background:var(--custom-accent);color:white;padding:.3rem .55rem;font-size:.8rem}.custom-card__info{padding:var(--custom-space)}.custom-card__info h3{font-size:1rem}.custom-card__price s{opacity:.7;margin-right:.5rem}.custom-card__quick,.pde button,.cart-drawer .button{padding:.75rem 1rem;cursor:pointer}.custom-card__quick{margin-top:.75rem;width:100%;background:var(--custom-text);color:#fff;border:0}.custom-card a{color:inherit}.pde{padding-block:2rem}.pde__main{display:grid;grid-template-columns:1fr 1fr;gap:clamp(1.5rem,5vw,5rem)}.pde__image img{width:100%;height:auto}.pde__form{display:grid;gap:.8rem}.pde__form select,.pde__form input{max-width:100%;min-height:2.75rem}.pde__stock{color:#8a2700;font-weight:700}.pde__accordion{border-top:1px solid #ccc;padding:1rem 0}.pde__accordion summary{cursor:pointer;font-weight:700}.pde__sticky{position:fixed;z-index:30;bottom:0;left:0;right:0;background:var(--custom-surface);color:var(--custom-text);box-shadow:0 -2px 12px #0002;padding:.75rem max(1rem,calc((100vw - 1200px)/2));display:flex;align-items:center;justify-content:space-between;gap:1rem}.pde__sticky[hidden]{display:none}.cart-drawer[hidden]{display:none}.cart-drawer{position:fixed;inset:0;z-index:1000}.cart-drawer__scrim{position:absolute;inset:0;width:100%;height:100%;background:#0008;border:0}.cart-drawer__panel{position:absolute;inset-block:0;right:0;width:min(100%,28rem);background:var(--custom-surface);color:var(--custom-text);padding:1.25rem;overflow:auto;display:flex;flex-direction:column;gap:1rem}.cart-drawer__panel header,.cart-drawer__panel footer{display:flex;justify-content:space-between;align-items:center;gap:.75rem}.cart-drawer__panel footer{display:grid;margin-top:auto}.cart-line{display:grid;grid-template-columns:5rem 1fr;gap:1rem;padding-block:1rem;border-bottom:1px solid #ddd}.cart-line img{width:5rem;height:auto}.cart-line__qty{display:flex;gap:.5rem;align-items:center}.cart-line__qty input{width:4rem}.cart-drawer__shipping progress{width:100%;accent-color:var(--custom-accent)}body.cart-drawer-open{overflow:hidden}:where(a,button,input,select,summary,[tabindex]):focus-visible{outline:3px solid var(--custom-focus);outline-offset:3px}@media(max-width:989px){.fp__grid{grid-template-columns:repeat(min(var(--fp-cols,4),2),minmax(0,1fr))}.pde__main{grid-template-columns:1fr}}@media(max-width:480px){.fp__grid{grid-template-columns:1fr}.pde__sticky{flex-wrap:wrap}}@media(prefers-reduced-motion:reduce){*,*::before,*::after{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
```

### File path (assets/custom-theme.js)
```javascript
(() => {
  const money = (cents) => {
    const format = document.documentElement.dataset.moneyFormat || '${{amount}}';
    const amount = (cents / 100).toFixed(2);
    return format.replace('{{amount}}', amount).replace('{{amount_no_decimals}}', String(Math.round(cents / 100)));
  };
  document.querySelectorAll('[data-product-enhancements]').forEach((root) => {
    const select = root.querySelector('[data-variant-select]');
    const form = root.querySelector('.pde__form');
    const buy = root.querySelector('[data-main-buy]');
    const sticky = root.querySelector('[data-sticky-buy]');
    const stock = root.querySelector('[data-stock]');
    const price = root.querySelector('[data-current-price]');
    const stickyPrice = root.querySelector('[data-sticky-price]');
    const update = (option, updateUrl = true) => {
      if (!option) return;
      const variantId = option.value;
      if (form) { const input = form.querySelector('[name="id"]'); if (input) input.value = variantId; }
      if (buy) buy.disabled = option.dataset.available !== 'true';
      const image = root.querySelector('.pde__image img');
      if (image && option.dataset.image) image.src = option.dataset.image;
      if (price) price.textContent = option.dataset.price || '';
      if (stickyPrice) stickyPrice.textContent = option.dataset.price || '';
      const qty = Number(option.dataset.inventory);
      const managed = option.dataset.policy !== 'continue';
      if (stock) {
        stock.hidden = !(managed && qty > 0 && qty <= 5);
        if (!stock.hidden) stock.textContent = stock.textContent.replace(/\d+/, String(qty));
      }
      if (updateUrl) { const url = new URL(window.location.href); url.searchParams.set('variant', variantId); history.replaceState({}, '', url); }
    };
    if (select) select.addEventListener('change', () => update(select.selectedOptions[0]));
    const observerTarget = buy;
    if (sticky && observerTarget && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => { sticky.hidden = entry.isIntersecting; }, { threshold: 0 });
      observer.observe(observerTarget);
    }
    const stickyButton = root.querySelector('[data-sticky-add]');
    if (stickyButton && form) stickyButton.addEventListener('click', () => form.requestSubmit());
    if (select) update(select.selectedOptions[0], false);
  });

  document.querySelectorAll('[data-cart-drawer]').forEach((drawer) => {
    const panel = drawer.querySelector('.cart-drawer__panel');
    let returnFocus = null;
    const open = () => { returnFocus = document.activeElement; drawer.hidden = false; drawer.setAttribute('aria-hidden', 'false'); document.body.classList.add('cart-drawer-open'); panel?.focus(); refresh(); };
    const close = () => { drawer.hidden = true; drawer.setAttribute('aria-hidden', 'true'); document.body.classList.remove('cart-drawer-open'); returnFocus?.focus?.(); };
    const refresh = async () => {
      try {
        const response = await fetch(`${window.Shopify?.routes?.root || '/'}cart.js`, { headers: { Accept: 'application/json' } });
        if (!response.ok) return;
        const cart = await response.json();
        const subtotal = drawer.querySelector('[data-cart-subtotal]'); if (subtotal) subtotal.textContent = money(cart.total_price);
        const progress = drawer.querySelector('[data-shipping-progress]');
        if (progress) { const threshold = Number(drawer.dataset.threshold || 0); const remaining = Math.max(0, threshold - cart.total_price); const msg = progress.querySelector('[data-shipping-message]'); const bar = progress.querySelector('progress'); if (msg) msg.textContent = remaining ? `Add ${money(remaining)} for free shipping.` : 'You qualify for free shipping.'; if (bar) bar.value = threshold ? Math.min(100, cart.total_price / threshold * 100) : 100; }
      } catch (_) { /* Network failures leave server-rendered cart data intact. */ }
    };
    document.addEventListener('click', (event) => {
      if (event.target.closest('[data-cart-open]')) { event.preventDefault(); open(); }
      if (event.target.closest('[data-cart-close]')) close();
      const step = event.target.closest('[data-qty-change]');
      if (step) { const input = step.parentElement.querySelector('[data-qty]'); if (input) { input.value = Math.max(0, Number(input.value) + Number(step.dataset.qtyChange)); input.dispatchEvent(new Event('change', { bubbles: true })); } }
    });
    drawer.addEventListener('change', async (event) => {
      const input = event.target.closest('[data-qty]'); if (!input) return;
      const line = input.closest('[data-line]'); if (!line) return;
      try { const res = await fetch(`${window.Shopify?.routes?.root || '/'}cart/change.js`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ line: Number(line.dataset.line), quantity: Math.max(0, Number(input.value)) }) }); if (res.ok) { const cart = await res.json(); location.reload(); } } catch (_) { /* Cart page remains available as fallback. */ }
    });
    drawer.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); if (event.key === 'Tab' && !drawer.hidden) { const focusable = [...panel.querySelectorAll('a,button,input,[tabindex="0"]')].filter((el) => !el.disabled); if (!focusable.length) return; const first = focusable[0], last = focusable[focusable.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } } });
    document.addEventListener('cart:open', open);
    document.addEventListener('cart:refresh', refresh);
  });
})();
```

### File path (sections/cart-drawer.liquid)
```liquid
{{ 'custom-theme.css' | asset_url | stylesheet_tag }}
<script src="{{ 'custom-theme.js' | asset_url }}" defer="defer"></script>
<div class="cart-drawer" data-cart-drawer data-section-id="{{ section.id }}" data-threshold="{{ section.settings.free_shipping_threshold | times: 100 }}" hidden aria-hidden="true">
  <button class="cart-drawer__scrim" type="button" data-cart-close aria-label="Close cart"></button>
  <aside class="cart-drawer__panel" role="dialog" aria-modal="true" aria-labelledby="CartDrawerTitle-{{ section.id }}" tabindex="-1">
    <header><h2 id="CartDrawerTitle-{{ section.id }}">{{ 'sections.cart.title' | t | default: 'Your cart' }}</h2><button type="button" data-cart-close aria-label="Close cart">×</button></header>
    {% if section.settings.free_shipping_threshold > 0 %}<div class="cart-drawer__shipping" data-shipping-progress role="status"><p data-shipping-message></p><progress max="100" value="0" aria-label="Free shipping progress"></progress></div>{% endif %}
    <div data-cart-lines>{% if cart.item_count == 0 %}<p>{{ 'sections.cart.empty' | t | default: 'Your cart is empty.' }}</p>{% else %}{% for item in cart.items %}<article class="cart-line" data-line="{{ forloop.index }}"><a href="{{ item.url }}">{{ item.image | image_url: width: 160 | image_tag: loading: 'lazy', decoding: 'async', alt: item.title }}</a><div><a href="{{ item.url }}">{{ item.product.title | escape }}{% unless item.variant.title == 'Default Title' %} — {{ item.variant.title | escape }}{% endunless %}</a><p>{{ item.final_line_price | money }}</p><div class="cart-line__qty"><button type="button" data-qty-change="-1" aria-label="Decrease quantity of {{ item.product.title | escape }}">−</button><input type="number" min="0" value="{{ item.quantity }}" data-qty aria-label="Quantity of {{ item.product.title | escape }}"><button type="button" data-qty-change="1" aria-label="Increase quantity of {{ item.product.title | escape }}">+</button></div></div></article>{% endfor %}{% endif %}</div>
    <footer><p>{{ 'sections.cart.subtotal' | t | default: 'Subtotal' }} <strong data-cart-subtotal>{{ cart.total_price | money }}</strong></p><a class="button" href="{{ routes.cart_url }}">{{ 'sections.cart.view_cart' | t | default: 'View cart' }}</a><a class="button" href="{{ routes.checkout_url }}">{{ 'sections.cart.checkout' | t | default: 'Checkout' }}</a></footer>
  </aside>
</div>
{% schema %}
{"name":"Cart drawer","tag":"section","class":"section-cart-drawer","settings":[{"type":"range","id":"free_shipping_threshold","label":"Free-shipping threshold","min":0,"max":500,"step":10,"unit":"$","default":75,"info":"Set to zero to hide the progress indicator. Threshold is in the store's currency."}],"max_blocks":0}
{% endschema %}
```

### File path (sections/featured-products.liquid)
```liquid
{{ 'custom-theme.css' | asset_url | stylesheet_tag }}
<section class="fp page-width" data-section-id="{{ section.id }}" style="--fp-cols:{{ section.settings.columns }};--fp-gap:{{ section.settings.gap }}px;--custom-accent:{{ section.settings.accent }}">
  {% if section.settings.heading != blank %}<h2>{{ section.settings.heading | escape }}</h2>{% endif %}
  {% if section.settings.collection != blank and section.settings.collection.products_count > 0 %}
    <ul class="fp__grid" role="list">
      {% for product in section.settings.collection.products limit: section.settings.product_limit %}<li>{% render 'product-card', product: product, quick_add: section.settings.quick_add %}</li>{% endfor %}
    </ul>
  {% else %}<p>{{ 'sections.featured_collection.no_products' | t | default: 'Select a collection with products in this section’s settings.' }}</p>{% endif %}
</section>
{% schema %}
{"name":"Featured products","tag":"section","class":"section-featured-products","settings":[{"type":"text","id":"heading","label":"Heading","default":"Featured products"},{"type":"collection","id":"collection","label":"Collection"},{"type":"range","id":"product_limit","label":"Products to show","min":2,"max":12,"step":1,"default":4},{"type":"select","id":"columns","label":"Desktop columns","options":[{"value":"1","label":"1"},{"value":"2","label":"2"},{"value":"3","label":"3"},{"value":"4","label":"4"}],"default":"4"},{"type":"range","id":"gap","label":"Grid spacing","min":8,"max":40,"step":4,"unit":"px","default":20},{"type":"checkbox","id":"quick_add","label":"Enable quick add","default":true},{"type":"color","id":"accent","label":"Accent color","default":"#b42318"}],"max_blocks":0,"presets":[{"name":"Featured products"}]}
{% endschema %}
```

### File path (sections/hero-banner.liquid)
```liquid
{% liquid
  assign hero_alt = section.settings.background_image.alt | default: section.settings.heading | escape
%}
<section id="Hero-{{ section.id }}" class="hb" data-section-id="{{ section.id }}" style="--hb-overlay: {{ section.settings.overlay_opacity | divided_by: 100.0 }}; --hb-min-height: {% case section.settings.height %}{% when 'small' %}32rem{% when 'full' %}100svh{% else %}48rem{% endcase %}; --hb-text: #ffffff; --hb-overlay-color: #000000;">
  <div class="hb__media">
    {% if section.settings.background_image != blank %}
      {{ section.settings.background_image | image_url: width: 2400 | image_tag: widths: '750, 1100, 1500, 2000, 2400', sizes: '100vw', loading: 'eager', fetchpriority: 'high', decoding: 'async', alt: hero_alt }}
    {% else %}<div class="hb__placeholder" aria-hidden="true"></div>{% endif %}
  </div>
  <div class="hb__shade" aria-hidden="true"></div>
  <div class="hb__content page-width">
    {% if section.settings.heading != blank %}<h1>{{ section.settings.heading | escape }}</h1>{% endif %}
    {% if section.settings.subheading != blank %}<div class="hb__sub">{{ section.settings.subheading }}</div>{% endif %}
    {% if section.settings.cta_label != blank and section.settings.cta_url != blank %}<a class="hb__cta" href="{{ section.settings.cta_url }}">{{ section.settings.cta_label | escape }}</a>{% endif %}
  </div>
</section>
<style>
#Hero-{{ section.id }}{--hb-gap:clamp(1rem,3vw,2rem);position:relative;display:grid;align-items:center;min-height:var(--hb-min-height);overflow:hidden;color:var(--hb-text);background:#222}
#Hero-{{ section.id }} .hb__media,#Hero-{{ section.id }} .hb__shade{position:absolute;inset:0}#Hero-{{ section.id }} .hb__media img{width:100%;height:100%;object-fit:cover}#Hero-{{ section.id }} .hb__placeholder{width:100%;height:100%;background:#555}#Hero-{{ section.id }} .hb__shade{background:var(--hb-overlay-color);opacity:var(--hb-overlay)}#Hero-{{ section.id }} .hb__content{position:relative;z-index:1;padding-block:4rem;max-width:var(--page-width,120rem)}#Hero-{{ section.id }} h1{max-width:18ch;font-size:clamp(2.25rem,6vw,5.5rem);line-height:1.05;margin:0 0 var(--hb-gap)}#Hero-{{ section.id }} .hb__sub{max-width:58ch;font-size:clamp(1rem,2vw,1.25rem)}#Hero-{{ section.id }} .hb__cta{display:inline-block;margin-top:var(--hb-gap);padding:1rem 1.5rem;background:var(--hb-text);color:#111;text-decoration:none;font-weight:700}#Hero-{{ section.id }} :focus-visible{outline:3px solid currentColor;outline-offset:4px}
@media(prefers-reduced-motion:no-preference){#Hero-{{ section.id }} .hb__cta{transition:transform .2s}#Hero-{{ section.id }} .hb__cta:hover{transform:translateY(-2px)}}
</style>
{% schema %}
{"name":"Hero banner","tag":"section","class":"section-hero-banner","settings":[{"type":"text","id":"heading","label":"Heading","default":"Welcome to our store"},{"type":"richtext","id":"subheading","label":"Subheading","default":"<p>Discover something you'll love.</p>"},{"type":"image_picker","id":"background_image","label":"Background image"},{"type":"text","id":"cta_label","label":"Button label","default":"Shop now"},{"type":"url","id":"cta_url","label":"Button link"},{"type":"range","id":"overlay_opacity","label":"Black overlay opacity (minimum ensures 4.5:1 contrast with white text)","min":70,"max":95,"step":5,"unit":"%","default":75,"info":"A solid black overlay is enforced and opacity cannot go below 70%, maintaining a minimum 4.5:1 white-text contrast ratio over even white image pixels."},{"type":"select","id":"height","label":"Height","options":[{"value":"small","label":"Small"},{"value":"medium","label":"Medium"},{"value":"full","label":"Full viewport"}],"default":"medium"}],"max_blocks":0,"presets":[{"name":"Hero banner"}]}
{% endschema %}
```

### File path (sections/product-detail-enhancements.liquid)
```liquid
{{ 'custom-theme.css' | asset_url | stylesheet_tag }}
<script src="{{ 'custom-theme.js' | asset_url }}" defer="defer"></script>
{% assign current_variant = product.selected_or_first_available_variant %}
<section class="pde page-width" data-product-enhancements data-section-id="{{ section.id }}">
  {% if product == blank %}<p>This section is available on product pages.</p>{% else %}
    <div class="pde__main">
      {% if section.settings.show_image and product.featured_image %}<div class="pde__image">{{ product.featured_image | image_url: width: 1200 | image_tag: widths: '480, 720, 960, 1200', sizes: '(min-width: 990px) 50vw, 100vw', loading: 'lazy', decoding: 'async', alt: product.featured_image.alt | default: product.title }}</div>{% endif %}
      <div class="pde__info"><h1>{{ product.title | escape }}</h1><div class="pde__price" data-current-price>{{ current_variant.price | money }}</div>
        {% form 'product', product, id: 'ProductForm-' | append: section.id, class: 'pde__form' %}
          {% unless product.has_only_default_variant %}<label for="Variant-{{ section.id }}">{{ 'products.product.product_variants' | t | default: 'Choose an option' }}</label><select id="Variant-{{ section.id }}" name="id" data-variant-select>{% for variant in product.variants %}<option value="{{ variant.id }}" data-available="{{ variant.available }}" data-price="{{ variant.price | money | escape }}" data-image="{% if variant.featured_image %}{{ variant.featured_image | image_url: width: 1200 }}{% endif %}" data-inventory="{{ variant.inventory_quantity }}" data-policy="{{ variant.inventory_policy }}" {% if variant.id == current_variant.id %}selected{% endif %} {% unless variant.available %}disabled{% endunless %}>{{ variant.title | escape }}{% unless variant.available %} — {{ 'products.product.sold_out' | t | default: 'Sold out' }}{% endunless %}</option>{% endfor %}</select>{% else %}<input type="hidden" name="id" value="{{ current_variant.id }}" data-single-variant>{% endunless %}
          <label for="Quantity-{{ section.id }}">{{ 'products.product.quantity.label' | t | default: 'Quantity' }}</label><input id="Quantity-{{ section.id }}" type="number" name="quantity" value="1" min="1" inputmode="numeric">
          <button type="submit" name="add" data-main-buy {% unless current_variant.available %}disabled{% endunless %}>{{ 'products.product.add_to_cart' | t | default: 'Add to cart' }}</button>
        {% endform %}
        <p class="pde__stock" data-stock role="status" {% unless current_variant.inventory_management and current_variant.inventory_quantity > 0 and current_variant.inventory_quantity <= 5 %}hidden{% endunless %}>{{ section.settings.low_stock_text | replace: '[count]', current_variant.inventory_quantity }}</p>
        {% for block in section.blocks %}<details class="pde__accordion" {{ block.shopify_attributes }}><summary>{{ block.settings.title | escape }}</summary><div>{% if block.settings.content != blank %}{{ block.settings.content }}{% elsif block.settings.title == 'Description' %}{{ product.description }}{% endif %}</div></details>{% endfor %}
      </div>
    </div>
    <div class="pde__sticky" data-sticky-buy hidden><span>{{ product.title | escape }}</span><span data-sticky-price>{{ current_variant.price | money }}</span><button type="button" data-sticky-add aria-label="Add {{ product.title | escape }} to cart">{{ 'products.product.add_to_cart' | t | default: 'Add to cart' }}</button></div>
  {% endif %}
</section>
{% schema %}
{"name":"Product enhancements","tag":"section","class":"section-product-enhancements","settings":[{"type":"checkbox","id":"show_image","label":"Show featured image","default":true},{"type":"text","id":"low_stock_text","label":"Low-stock message (use [count])","default":"Only [count] left in stock"}],"blocks":[{"type":"accordion","name":"Accordion","settings":[{"type":"text","id":"title","label":"Heading","default":"Description"},{"type":"richtext","id":"content","label":"Content","default":"<p>Enter details here.</p>"}]}],"max_blocks":3,"presets":[{"name":"Product enhancements","blocks":[{"type":"accordion","settings":{"title":"Description"}},{"type":"accordion","settings":{"title":"Shipping"}},{"type":"accordion","settings":{"title":"Returns"}}]}]}
{% endschema %}
```

### File path (snippets/custom-seo.liquid)
```liquid
<link rel="canonical" href="{{ canonical_url }}">
<meta property="og:site_name" content="{{ shop.name | escape }}">
<meta property="og:url" content="{{ canonical_url }}">
<meta property="og:title" content="{% if page_title %}{{ page_title | escape }}{% else %}{{ shop.name | escape }}{% endif %}">
<meta property="og:description" content="{{ page_description | default: shop.description | strip_html | escape }}">
<meta property="og:type" content="{% if request.page_type == 'product' %}product{% else %}website{% endif %}">
{% if page_image %}<meta property="og:image" content="https:{{ page_image | image_url: width: 1200 }}">{% elsif product.featured_image %}<meta property="og:image" content="https:{{ product.featured_image | image_url: width: 1200 }}">{% endif %}
<meta name="twitter:card" content="summary_large_image">
{% if request.page_type == 'product' and product != blank %}{% assign seo_variant = product.selected_or_first_available_variant %}<script type="application/ld+json">{"@context":"https://schema.org/","@type":"Product","name":{{ product.title | json }},"url":{{ shop.url | append: product.url | json }},{% if product.featured_image %}"image":[{{ product.featured_image | image_url: width: 1200 | prepend: 'https:' | json }}],{% endif %}"description":{{ product.description | strip_html | truncate: 5000 | json }},"sku":{{ seo_variant.sku | json }},{% if product.vendor != blank %}"brand":{"@type":"Brand","name":{{ product.vendor | json }}},{% endif %}"offers":{"@type":"Offer","url":{{ shop.url | append: seo_variant.url | json }},"priceCurrency":{{ cart.currency.iso_code | default: shop.currency | json }},"price":{{ seo_variant.price | divided_by: 100.0 | json }},"availability":"{% if seo_variant.available %}https://schema.org/InStock{% else %}https://schema.org/OutOfStock{% endif %}"}}</script>{% endif %}
```

### File path (snippets/product-card.liquid)
```liquid
{% if product != blank %}
<article class="custom-card" data-product-card>
  <a class="custom-card__media" href="{{ product.url }}" aria-label="{{ product.title | escape }}">
    {% if product.featured_image %}{{ product.featured_image | image_url: width: 720 | image_tag: widths: '240, 360, 540, 720', sizes: '(min-width: 990px) 25vw, (min-width: 750px) 50vw, 100vw', loading: 'lazy', decoding: 'async', alt: product.featured_image.alt | default: product.title, width: product.featured_image.width, height: product.featured_image.height }}{% else %}<span class="custom-card__placeholder" aria-hidden="true"></span>{% endif %}
    {% if product.compare_at_price > product.price %}<span class="custom-card__badge">{{ 'products.product.on_sale' | t | default: 'Sale' }}</span>{% endif %}
  </a>
  <div class="custom-card__info"><h3><a href="{{ product.url }}">{{ product.title | escape }}</a></h3>
    <div class="custom-card__price">{% if product.compare_at_price > product.price %}<s>{{ product.compare_at_price | money }}</s> <span>{{ product.price | money }}</span>{% else %}<span>{{ product.price | money }}</span>{% endif %}</div>
    {% if quick_add and product.available %}{% assign card_form_id = 'QuickAdd-' | append: section.id | append: '-' | append: product.id %}<form method="post" action="{{ routes.cart_add_url }}" id="{{ card_form_id }}"><input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}"><input type="hidden" name="quantity" value="1"><button type="submit" class="custom-card__quick" aria-label="{{ 'products.product.add_to_cart' | t | default: 'Add to cart' }}: {{ product.title | escape }}">{{ 'products.product.add_to_cart' | t | default: 'Quick add' }}</button></form>{% endif %}
  </div>
</article>
{% endif %}
```

### File path (templates/cart.json)
```json
{"sections":{"main":{"type":"main-cart-items","settings":{}},"footer":{"type":"main-cart-footer","settings":{"show_cart_note":true}},"cart_drawer":{"type":"cart-drawer","settings":{}}},"order":["main","footer","cart_drawer"]}
```

### File path (templates/collection.json)
```json
{"sections":{"banner":{"type":"main-collection-banner","settings":{"show_collection_description":true,"show_collection_image":false,"color_scheme":"scheme-1"}},"product_grid":{"type":"main-collection-product-grid","settings":{"products_per_page":16,"columns_desktop":4,"columns_mobile":"2","enable_filtering":true,"enable_sorting":true,"image_ratio":"adapt","show_vendor":false,"show_rating":false}},"cart_drawer":{"type":"cart-drawer","settings":{}}},"order":["banner","product_grid","cart_drawer"]}
```

### File path (templates/index.json)
```json
{"sections":{"hero":{"type":"hero-banner","settings":{}},"featured":{"type":"featured-products","settings":{}},"cart_drawer":{"type":"cart-drawer","settings":{}}},"order":["hero","featured","cart_drawer"]}
```

### File path (templates/password.json)
```json
{"sections":{"main":{"type":"main-password","settings":{}}},"order":["main"]}
```

### File path (templates/product.json)
```json
{"sections":{"main":{"type":"product-detail-enhancements","blocks":{"description":{"type":"accordion","settings":{"title":"Description"}},"shipping":{"type":"accordion","settings":{"title":"Shipping"}},"returns":{"type":"accordion","settings":{"title":"Returns"}}},"block_order":["description","shipping","returns"],"settings":{}},"recommendations":{"type":"product-recommendations","settings":{"heading":"You may also like","products_to_show":4,"columns_desktop":4}},"cart_drawer":{"type":"cart-drawer","settings":{}}},"order":["main","recommendations","cart_drawer"]}
```


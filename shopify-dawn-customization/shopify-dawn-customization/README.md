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

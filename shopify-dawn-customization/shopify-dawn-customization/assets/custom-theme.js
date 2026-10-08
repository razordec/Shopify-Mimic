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

const SOCIAL_ID = 'mpsj-social-icons-style';
const FACEBOOK_URL = 'https://www.facebook.com/modulosprefabricadossanjose';
const INSTAGRAM_URL = 'https://www.instagram.com/modulosprefabricadossanjose/';

const facebookIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true" class="mpsj-social-svg mpsj-social-fill">
    <path d="M14.2 8.35V6.9c0-.7.48-.86.82-.86h2.1V2.82l-2.9-.01c-3.22 0-3.95 2.41-3.95 3.95v1.59H8.4v3.6h1.87v9.25h3.75v-9.25h2.82l.38-3.6H14.2Z" />
  </svg>`;

const instagramIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true" class="mpsj-social-svg mpsj-social-stroke">
    <rect x="4" y="4" width="16" height="16" rx="5" />
    <circle cx="12" cy="12" r="3.6" />
    <circle cx="16.9" cy="7.1" r=".85" class="mpsj-social-dot" />
  </svg>`;

function addStyles() {
  if (document.getElementById(SOCIAL_ID)) return;
  const style = document.createElement('style');
  style.id = SOCIAL_ID;
  style.textContent = `
    .mpsj-social-links{display:flex;align-items:center;gap:.5rem}.mpsj-social-link{display:inline-flex;width:2.5rem;height:2.5rem;align-items:center;justify-content:center;border-radius:1rem;border:1px solid rgb(226 232 240);background:#fff;color:#334155;box-shadow:0 6px 18px rgba(15,23,42,.08);transition:all .2s ease}.mpsj-social-link:hover{border-color:rgba(249,115,22,.45);background:#fff7ed;color:#f97316;transform:translateY(-1px)}.mpsj-social-svg{width:18px;height:18px}.mpsj-social-fill{fill:currentColor}.mpsj-social-stroke{fill:none;stroke:currentColor;stroke-width:1.9}.mpsj-social-dot{fill:currentColor;stroke:none}.mpsj-social-footer .mpsj-social-link,.mpsj-social-footer-top .mpsj-social-link{border-color:rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#cbd5e1;box-shadow:none}.mpsj-social-footer .mpsj-social-link:hover,.mpsj-social-footer-top .mpsj-social-link:hover{border-color:rgba(255,255,255,.22);background:rgba(255,255,255,.1);color:#fff}.mpsj-social-label{margin-bottom:.5rem;font-size:.75rem;font-weight:900;letter-spacing:.18em;text-transform:uppercase;color:#64748b}@media (max-width:639px){.mpsj-social-header-desktop{display:none!important}.mpsj-social-header-mobile{display:flex!important}.mpsj-social-link{width:2.25rem;height:2.25rem;border-radius:.9rem}.mpsj-social-svg{width:16px;height:16px}}@media (min-width:640px){.mpsj-social-header-mobile{display:none!important}}@media (max-width:1023px){.mpsj-social-header-desktop{display:none!important}}`;
  document.head.appendChild(style);
}

function socialMarkup(extraClass = '') {
  return `
    <div class="mpsj-social-links ${extraClass}" aria-label="Redes sociales">
      <a class="mpsj-social-link" href="${FACEBOOK_URL}" target="_blank" rel="noreferrer" aria-label="Visitar Facebook de Módulos Prefabricados San José" title="Facebook">${facebookIcon}</a>
      <a class="mpsj-social-link" href="${INSTAGRAM_URL}" target="_blank" rel="noreferrer" aria-label="Visitar Instagram de Módulos Prefabricados San José" title="Instagram">${instagramIcon}</a>
    </div>`;
}

function injectSocialIcons() {
  addStyles();

  const headerActions = document.querySelector('header .container-page > div:last-child');
  if (headerActions && !headerActions.querySelector('.mpsj-social-header-desktop')) {
    headerActions.insertAdjacentHTML('beforeend', socialMarkup('mpsj-social-header-desktop'));
  }

  const headerLogoRow = document.querySelector('header .container-page > div:first-child');
  const mobilePhone = headerLogoRow?.querySelector('a[href^="tel:"]');
  if (headerLogoRow && mobilePhone && !headerLogoRow.querySelector('.mpsj-social-header-mobile')) {
    mobilePhone.insertAdjacentHTML('beforebegin', socialMarkup('mpsj-social-header-mobile'));
  }

  const footerMain = document.querySelector('footer .container-page.grid');
  const footerBrand = footerMain?.firstElementChild;
  if (footerBrand && !footerBrand.querySelector('.mpsj-social-footer')) {
    footerBrand.insertAdjacentHTML('beforeend', `<div class="mpsj-social-footer" style="margin-top:1.25rem"><p class="mpsj-social-label">Síguenos</p>${socialMarkup('')}</div>`);
  }

  const footerTop = document.querySelector('footer .border-b .container-page > div:last-child');
  if (footerTop && !footerTop.querySelector('.mpsj-social-footer-top')) {
    footerTop.insertAdjacentHTML('beforeend', `<div class="mpsj-social-footer-top" style="display:flex;justify-content:flex-end;margin-top:.75rem">${socialMarkup('')}</div>`);
  }
}

const observer = new MutationObserver(() => injectSocialIcons());
observer.observe(document.documentElement, { childList: true, subtree: true });

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectSocialIcons);
} else {
  injectSocialIcons();
}

const header = document.querySelector("[data-header]");
const menu = document.querySelector("[data-mobile-menu]");
const toggle = document.querySelector("[data-menu-toggle]");

function normalizeMobileNavigation() {
  const nav = menu?.querySelector("nav");
  if (!nav) return;

  nav.innerHTML = `
    <a href="index.html">Home</a>
    <details class="mobile-services-dropdown">
      <summary>Services</summary>
      <div class="mobile-services-dropdown__menu">
        <a href="services.html">All services</a>
        <a href="web-design-development.html">Web Design & Development</a>
        <a href="digital-marketing-systems.html">Digital Marketing Systems</a>
        <a href="frontend-backend-development.html">Frontend / Backend Development</a>
        <a href="launch-support-optimization.html">Launch Support & Optimization</a>
      </div>
    </details>
    <a href="service-detail.html">Process</a>
    <a href="about.html">About</a>
    <a href="contact.html">Contact</a>
  `;
}

normalizeMobileNavigation();

const mobileServicesDropdown = menu?.querySelector(".mobile-services-dropdown");
const mobileServicesSummary = mobileServicesDropdown?.querySelector("summary");
const mobileServicesPanel = mobileServicesDropdown?.querySelector(".mobile-services-dropdown__menu");

function closeMobileServicesDropdown() {
  if (!mobileServicesDropdown || !mobileServicesPanel) return;
  mobileServicesDropdown.classList.remove("is-open");
  mobileServicesPanel.style.height = `${mobileServicesPanel.scrollHeight}px`;
  mobileServicesPanel.offsetHeight;
  mobileServicesPanel.style.height = "0px";
  window.setTimeout(() => {
    if (!mobileServicesDropdown.classList.contains("is-open")) {
      mobileServicesDropdown.removeAttribute("open");
    }
  }, 360);
}

if (mobileServicesDropdown && mobileServicesSummary && mobileServicesPanel) {
  mobileServicesPanel.style.height = "0px";
  mobileServicesSummary.addEventListener("click", (event) => {
    event.preventDefault();
    const isOpen = mobileServicesDropdown.classList.contains("is-open");

    if (isOpen) {
      closeMobileServicesDropdown();
      return;
    }

    mobileServicesDropdown.setAttribute("open", "");
    mobileServicesDropdown.classList.add("is-open");
    mobileServicesPanel.style.height = "auto";
    const height = mobileServicesPanel.scrollHeight;
    mobileServicesPanel.style.height = "0px";
    mobileServicesPanel.offsetHeight;
    mobileServicesPanel.style.height = `${height}px`;
  });

  mobileServicesPanel.addEventListener("transitionend", (event) => {
    if (event.propertyName !== "height") return;
    if (mobileServicesDropdown.classList.contains("is-open")) {
      mobileServicesPanel.style.height = "auto";
    }
  });
}

if (window.lucide) {
  window.lucide.createIcons();
}

function setHeaderState() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 20);
}

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

if (toggle && menu && header) {
  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    header.classList.toggle("menu-open", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
    menu.setAttribute("aria-hidden", String(!isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    if (!isOpen) {
      closeMobileServicesDropdown();
    }
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      header.classList.remove("menu-open");
      document.body.style.overflow = "";
      menu.setAttribute("aria-hidden", "true");
      toggle.setAttribute("aria-label", "Open menu");
      closeMobileServicesDropdown();
    });
  });
}

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });
  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const pricingToggle = document.querySelector(".pricing-toggle");
const pricingCards = document.querySelectorAll(".price-card[data-project-price]");
const pricingNote = document.querySelector("[data-pricing-note]");

if (pricingToggle && pricingCards.length) {
  const notes = {
    project: "Prices are approximate. Details, exact scope and final pricing can be clarified with a manager after you submit the project enquiry form.",
    monthly: "Monthly support prices are approximate and depend on update volume, response expectations, reporting needs and technical scope. Exact terms can be clarified with a manager."
  };

  pricingToggle.addEventListener("click", (event) => {
    const button = event.target.closest("[data-pricing-mode]");
    if (!button) return;

    const mode = button.dataset.pricingMode;
    pricingToggle.querySelectorAll("button").forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });

    pricingCards.forEach((card) => {
      const price = card.querySelector(".price strong");
      const term = card.querySelector(".price span");
      if (!price || !term) return;
      price.textContent = card.dataset[`${mode}Price`];
      term.textContent = card.dataset[`${mode}Term`];
    });

    if (pricingNote) {
      pricingNote.textContent = notes[mode];
    }
  });
}

document.querySelectorAll(".faq-list details").forEach((details) => {
  const summary = details.querySelector("summary");
  const answer = details.querySelector(".faq-answer");
  if (!summary) return;

  if (answer && details.open) {
    answer.style.height = `${answer.scrollHeight}px`;
  }

  summary.addEventListener("click", (event) => {
    event.preventDefault();
    if (!answer || details.dataset.animating === "true") return;

    details.dataset.animating = "true";
    const duration = 380;
    const easing = "cubic-bezier(.2, .8, .2, 1)";

    if (details.open) {
      const startHeight = answer.scrollHeight;
      const animation = answer.animate(
        [{ height: `${startHeight}px` }, { height: "0px" }],
        { duration, easing }
      );

      animation.onfinish = () => {
        answer.style.height = "0px";
        details.open = false;
        details.dataset.animating = "false";
      };
      return;
    }

    details.open = true;
    answer.style.height = "0px";
    const endHeight = answer.scrollHeight;
    const animation = answer.animate(
      [{ height: "0px" }, { height: `${endHeight}px` }],
      { duration, easing }
    );

    animation.onfinish = () => {
      answer.style.height = `${answer.scrollHeight}px`;
      details.dataset.animating = "false";
    };
  });
});

const form = document.querySelector(".contact-form");
if (form) {
  const status = form.querySelector(".form-status");
  const params = new URLSearchParams(window.location.search);
  if (params.get("sent") === "1") {
    status.textContent = "Thank you. Your enquiry has been sent successfully.";
  }
  if (params.get("sent") === "0") {
    status.textContent = "Please check the required fields and try again.";
  }
}

const cookieStorageKey = "systemCapitalCookieConsent";

function getCookieConsent() {
  try {
    return JSON.parse(localStorage.getItem(cookieStorageKey));
  } catch (error) {
    return null;
  }
}

function saveCookieConsent(consent) {
  localStorage.setItem(cookieStorageKey, JSON.stringify({
    ...consent,
    updatedAt: new Date().toISOString()
  }));
}

function createCookieBanner() {
  if (document.querySelector("[data-cookie-banner]")) return;

  const banner = document.createElement("section");
  banner.className = "cookie-banner";
  banner.dataset.cookieBanner = "";
  banner.setAttribute("aria-label", "Cookie preferences");
  banner.innerHTML = `
    <div class="cookie-banner__inner">
      <div>
        <h2>Cookie preferences</h2>
        <p>We use essential cookies to keep the website working. Analytics and marketing cookies help us improve the site and understand campaign performance. Read our <a href="cookie.html">Cookie Policy</a>.</p>
      </div>
      <div class="cookie-banner__actions">
        <button class="cookie-button" type="button" data-cookie-customize>Customize</button>
        <button class="cookie-button" type="button" data-cookie-reject>Reject optional</button>
        <button class="cookie-button cookie-button--primary" type="button" data-cookie-accept>Accept all</button>
      </div>
    </div>
    <div class="cookie-panel">
      <div class="cookie-panel__inner">
        <div class="cookie-options">
          <label class="cookie-option">
            <span class="cookie-option__top"><strong>Essential</strong><span class="cookie-switch"><input type="checkbox" checked disabled><span></span></span></span>
            <small>Required for navigation, security, forms and preference storage.</small>
          </label>
          <label class="cookie-option">
            <span class="cookie-option__top"><strong>Analytics</strong><span class="cookie-switch"><input type="checkbox" data-cookie-category="analytics"><span></span></span></span>
            <small>Helps us understand aggregated website usage and improve content.</small>
          </label>
          <label class="cookie-option">
            <span class="cookie-option__top"><strong>Marketing</strong><span class="cookie-switch"><input type="checkbox" data-cookie-category="marketing"><span></span></span></span>
            <small>Supports conversion tracking and relevant advertising where enabled.</small>
          </label>
        </div>
        <div class="cookie-banner__actions" style="margin-top: 10px;">
          <button class="cookie-button cookie-button--primary" type="button" data-cookie-save>Save preferences</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(banner);

  const close = (consent) => {
    saveCookieConsent(consent);
    banner.classList.remove("is-visible", "is-customizing");
    setTimeout(() => banner.remove(), 380);
  };

  banner.querySelector("[data-cookie-accept]").addEventListener("click", () => {
    close({ essential: true, analytics: true, marketing: true });
  });

  banner.querySelector("[data-cookie-reject]").addEventListener("click", () => {
    close({ essential: true, analytics: false, marketing: false });
  });

  banner.querySelector("[data-cookie-customize]").addEventListener("click", () => {
    banner.classList.toggle("is-customizing");
  });

  banner.querySelector("[data-cookie-save]").addEventListener("click", () => {
    close({
      essential: true,
      analytics: banner.querySelector('[data-cookie-category="analytics"]').checked,
      marketing: banner.querySelector('[data-cookie-category="marketing"]').checked
    });
  });

  requestAnimationFrame(() => banner.classList.add("is-visible"));
}

if (!getCookieConsent()) {
  window.addEventListener("load", createCookieBanner);
}

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-cookie-settings]");
  if (!trigger) return;
  event.preventDefault();
  localStorage.removeItem(cookieStorageKey);
  createCookieBanner();
});

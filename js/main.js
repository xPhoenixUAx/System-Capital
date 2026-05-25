const header = document.querySelector("[data-header]");
const menu = document.querySelector("[data-mobile-menu]");
const toggle = document.querySelector("[data-menu-toggle]");

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
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      header.classList.remove("menu-open");
      document.body.style.overflow = "";
      menu.setAttribute("aria-hidden", "true");
      toggle.setAttribute("aria-label", "Open menu");
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

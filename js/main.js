const SALON_CONFIG = {
  // Replace these sample contact details before publishing.
  name: "Classic Salon",
  address: "The Pink Arcade, 1st Floor",
  town: "Westlands, Nairobi, Kenya",
  openingHours: "Monday–Saturday, 9:00 AM–6:00 PM",
  phone: "+254 700 000 000",
  whatsapp: "+254 700 000 000",
  email: "hello@classicsalon.example",
  social: {
    instagram: "",
    facebook: "",
    tiktok: ""
  }
};

// Confirm these sample KES starting prices with the salon before publishing.
const SERVICES = [
  { name: "Knotless Braids", description: "Protective, lightweight braids. Final price depends on length and size.", price: 3500 },
  { name: "Box Braids", description: "A timeless braided style, tailored to your preferred length.", price: 3000 },
  { name: "Cornrows", description: "Neat, creative cornrow styles. Price varies by design.", price: 1500 },
  { name: "Passion Twists", description: "Soft twists with a relaxed, textured finish.", price: 3500 },
  { name: "Faux Locs", description: "A textured loc-inspired protective style.", price: 4500 },
  { name: "Natural Hair Styling", description: "A considered style for your natural texture.", price: 1500 },
  { name: "Wig Installation", description: "A polished install and finish for your unit.", price: 2500 },
  { name: "Wash and Blow-Dry", description: "A fresh cleanse and smooth, finished blow-dry.", price: 1200 },
  { name: "Hair Treatment", description: "A nourishing treatment selected for your hair.", price: 1500 },
  { name: "Wig Revamp", description: "Refresh and restyle your wig for a new look.", price: 2000 }
];

const money = new Intl.NumberFormat("en-KE");
const priceList = document.querySelector("#price-list");
const serviceSelect = document.querySelector("#service-select");

if (priceList && serviceSelect) {
  SERVICES.forEach((service) => {
    const row = document.createElement("article");
    row.className = "price-row";
    row.innerHTML = `<span class="price-service">${service.name}</span><span class="price-value">From KES ${money.format(service.price)}</span><span class="price-description">${service.description}</span><a class="price-book" href="#booking" data-service-link="${service.name}">Book this service →</a>`;
    priceList.append(row);

    const option = document.createElement("option");
    option.value = service.name;
    option.textContent = service.name;
    serviceSelect.append(option);
  });
}

document.querySelectorAll("[data-service-link]").forEach((link) => {
  link.addEventListener("click", () => {
    const name = link.dataset.serviceLink;
    if (serviceSelect && [...serviceSelect.options].some((option) => option.value === name)) {
      serviceSelect.value = name;
    }
  });
});

const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
if (menuToggle && primaryNav) {
  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    primaryNav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    primaryNav.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });
  primaryNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
if (lightbox && lightboxImage && lightboxCaption) {
  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", () => {
      const image = item.querySelector("img");
      lightboxImage.src = item.dataset.full;
      lightboxImage.alt = image.alt;
      lightboxCaption.textContent = image.alt;
      lightbox.showModal();
    });
  });
  lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });
}

const formatPhone = (phone) => {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  return digits.startsWith("254") ? digits : "";
};
const whatsappNumber = formatPhone(SALON_CONFIG.whatsapp);
const whatsappBookingButton = document.querySelector("#whatsapp-booking");
if (whatsappBookingButton && whatsappNumber) {
  whatsappBookingButton.disabled = false;
  const hint = document.querySelector("#whatsapp-booking-hint");
  if (hint) hint.textContent = "Sample contact details for preview — replace before opening.";

  whatsappBookingButton.addEventListener("click", () => {
    const form = document.querySelector("#booking-form");
    const booking = form ? Object.fromEntries(new FormData(form).entries()) : {};
    const message = [
      "Hello! I’d like to book an appointment at Classic Salon.",
      booking.customerName && `Name: ${booking.customerName}`,
      booking.phone && `Phone: ${booking.phone}`,
      booking.service && `Service: ${booking.service}`,
      booking.appointmentDate && `Preferred date: ${booking.appointmentDate}`,
      booking.appointmentTime && `Preferred time: ${booking.appointmentTime}`,
      booking.styleDetails && `Style details: ${booking.styleDetails}`,
      booking.notes && `Notes: ${booking.notes}`,
      "",
      "Please let me know if this time is available."
    ].filter(Boolean).join("\n");
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
}

if (whatsappNumber) {
  document.querySelectorAll(".whatsapp-link").forEach((link) => {
    link.href = `https://wa.me/${whatsappNumber}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.hidden = false;
  });
}

const mapQuery = [SALON_CONFIG.address, SALON_CONFIG.town, "Kenya"].filter(Boolean).join(", ");
const directionsLink = document.querySelector("#directions-link");
if (mapQuery && directionsLink) {
  directionsLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
  directionsLink.target = "_blank";
}

document.querySelectorAll("[data-salon-address]").forEach((element) => { element.textContent = SALON_CONFIG.address; });
document.querySelectorAll("[data-salon-town]").forEach((element) => { element.textContent = SALON_CONFIG.town; });
document.querySelectorAll("[data-salon-hours]").forEach((element) => { element.textContent = SALON_CONFIG.openingHours; });
document.querySelectorAll("[data-salon-phone]").forEach((element) => { element.textContent = SALON_CONFIG.phone; });
document.querySelectorAll("[data-salon-email]").forEach((element) => { element.textContent = SALON_CONFIG.email; });
document.querySelectorAll("[data-footer-contact]").forEach((element) => {
  element.textContent = SALON_CONFIG.phone;
  if (SALON_CONFIG.phone) element.href = `tel:${SALON_CONFIG.phone.replace(/[^\d+]/g, "")}`;
});
document.querySelectorAll("[data-footer-email]").forEach((element) => {
  element.textContent = SALON_CONFIG.email;
  if (SALON_CONFIG.email) element.href = `mailto:${SALON_CONFIG.email}`;
});
document.querySelectorAll("[data-footer-town]").forEach((element) => { element.textContent = SALON_CONFIG.town; });
document.querySelectorAll("[data-social]").forEach((element) => {
  const url = SALON_CONFIG.social[element.dataset.social];
  if (url) {
    element.href = url;
    element.target = "_blank";
    element.rel = "noopener noreferrer";
    element.hidden = false;
  }
});
document.querySelector("#copyright-year").textContent = new Date().getFullYear();

const GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID = "AKfycbwpYx7HNjphKHqRU3WnQl2pX-oJdCymQqEsU6_KeTev24Zwc8OYdBTeBd3RjLm_OELXGA";
const GOOGLE_APPS_SCRIPT_URL = `https://script.google.com/macros/s/${GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID}/exec`;

const bookingForm = document.querySelector("#booking-form");
const bookingMessage = document.querySelector("#booking-message");
const appointmentDate = document.querySelector("#appointment-date");

if (bookingForm && bookingMessage && appointmentDate) {
  const localToday = getLocalDate();
  appointmentDate.min = localToday;

  bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearErrors();
    bookingMessage.hidden = true;

    if (!validateForm()) {
      bookingForm.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    if (!/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(GOOGLE_APPS_SCRIPT_URL)) {
      showMessage("error", "Online booking is not configured yet. Please contact the salon directly while we set this up.");
      return;
    }

    const submitButton = bookingForm.querySelector('button[type="submit"]');
    const requestId = crypto.randomUUID();
    submitButton.disabled = true;
    submitButton.dataset.label = submitButton.innerHTML;
    submitButton.innerHTML = "Sending your request…";

    try {
      await sendBookingRequest(bookingForm, requestId);
      bookingForm.reset();
      appointmentDate.min = getLocalDate();
      showMessage("success", "Your request has been received. The salon will contact you to confirm availability.");
      bookingMessage.focus();
      window.setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error("Booking request failed:", error);
      showMessage("error", error.message || "We couldn’t send your request just now. Your details are still here—please try again.");
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = submitButton.dataset.label;
      delete submitButton.dataset.label;
    }
  });
}

function sendBookingRequest(form, requestId) {
  return new Promise((resolve, reject) => {
    const frame = document.createElement("iframe");
    const targetName = `booking-${requestId}`;
    frame.name = targetName;
    frame.title = "Secure booking submission";
    frame.hidden = true;

    const requestForm = document.createElement("form");
    requestForm.action = GOOGLE_APPS_SCRIPT_URL;
    requestForm.method = "post";
    requestForm.target = targetName;
    requestForm.hidden = true;

    const fields = new FormData(form);
    fields.set("requestId", requestId);
    fields.set("website", "");
    for (const [name, value] of fields.entries()) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = String(value);
      requestForm.append(input);
    }

    const cleanup = () => {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(timeout);
      requestForm.remove();
      frame.remove();
    };
    const onMessage = (event) => {
      if (event.data?.type !== "classic-salon-booking" || event.data.requestId !== requestId) return;
      cleanup();
      if (event.data.success && typeof event.data.bookingReference === "string") {
        resolve(event.data);
      } else {
        reject(new Error(event.data.message || "The salon could not save your request. Your details are still here—please try again."));
      }
    };
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("The booking service did not confirm the request. The salon’s booking service may need updating—please contact the salon or try again later."));
    }, 30000);

    window.addEventListener("message", onMessage);
    document.body.append(frame, requestForm);
    requestForm.submit();
  });
}

function validateForm() {
  const fields = [...bookingForm.querySelectorAll("input, select, textarea")];
  let valid = true;

  for (const field of fields) {
    const value = field.value.trim();
    let error = "";
    if (field.required && !value) {
      error = "This field is required.";
    } else if (field.name === "phone" && value && !/^(?:\+?254|0)(?:7|1)\d{8}$/.test(value.replace(/[\s()-]/g, ""))) {
      error = "Enter a Kenyan number, such as 0712 345 678 or +254712345678.";
    } else if (field.name === "email" && value && !field.validity.valid) {
      error = "Enter a valid email address.";
    } else if (field.name === "appointmentDate" && value && value < appointmentDate.min) {
      error = "Choose today or a future date.";
    }

    field.setAttribute("aria-invalid", String(Boolean(error)));
    const errorElement = field.closest(".field")?.querySelector(".field-error");
    if (errorElement) errorElement.textContent = error;
    if (error) valid = false;
  }
  return valid;
}

function clearErrors() {
  bookingForm.querySelectorAll(".field-error").forEach((element) => { element.textContent = ""; });
  bookingForm.querySelectorAll('[aria-invalid="true"]').forEach((element) => element.removeAttribute("aria-invalid"));
}

function showMessage(type, message) {
  bookingMessage.dataset.type = type;
  bookingMessage.textContent = message;
  bookingMessage.hidden = false;
}

function getLocalDate() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 10);
}

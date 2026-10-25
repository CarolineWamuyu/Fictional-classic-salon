# Classic Salon

Pink-themed responsive salon website using HTML, CSS and vanilla JavaScript. Appointment requests are saved to Google Sheets through Google Apps Script.

## Run locally

Run `python -m http.server 8000` in this directory and open `http://localhost:8000`.

## Connect appointment bookings

Follow [the Google Sheets and Apps Script setup guide](./google-apps-script/README.md). After deploying the Apps Script web app, paste its `/exec` URL into `GOOGLE_APPS_SCRIPT_URL` near the top of `js/booking.js`. The web app must execute as the spreadsheet owner and allow access to anyone so the public form can submit; keep the spreadsheet itself private.

The browser validates required fields and Kenyan phone numbers. Apps Script validates submissions again, applies a per-phone rate limit, and saves a pending request with its server-generated timestamp and booking reference. A submitted request is not confirmed until the salon contacts the customer.

## Editable content

The contact card currently shows sample details for Westlands, Nairobi, with a sample phone and WhatsApp number. Replace these values in `SALON_CONFIG` in `js/main.js` before publishing. The WhatsApp booking button opens WhatsApp with the booking form details prefilled. Update image paths and alt text in `index.html`. Confirm sample prices and replace the clearly labeled sample testimonial copy before launch.

# Felloh Payment SDK

[![Version](https://img.shields.io/npm/v/@felloh-org/payment-sdk.svg)](https://www.npmjs.com/package/@felloh-org/payment-sdk)
[![Build Status](https://github.com/felloh-org/payment-sdk/actions/workflows/release.yml/badge.svg?branch=main)](https://github.com/felloh-org/payment-sdk/actions/workflows/release.yml)
[![Downloads](https://img.shields.io/npm/dm/@felloh-org/payment-sdk.svg)](https://www.npmjs.com/package/@felloh-org/payment-sdk)
[![Try on RunKit](https://badge.runkitcdn.com/@felloh-org/payment-sdk.svg)](https://runkit.com/npm/@felloh-org/payment-sdk)

The official browser-side SDK for embedding [Felloh](https://felloh.com) payment forms into your website. Felloh is a payment platform that enables businesses to accept card payments and open banking transactions.

This SDK renders a secure, hosted payment form inside an iframe and communicates payment lifecycle events back to your application via callbacks.

## Installation

### Package Manager

```sh
npm install @felloh-org/payment-sdk
```

or with Yarn:

```sh
yarn add @felloh-org/payment-sdk
```

### CDN

Alternatively, include the SDK directly via script tag:

```html
<script src="https://sdk.felloh.com/"></script>
```

When loaded via CDN, the SDK is available globally as `FellohPayments`.

## Prerequisites

Before rendering a payment form, you need to create an **ecommerce instance** server-side using the [Felloh API](https://developers.felloh.com). This returns an ecommerce ID that you pass to the SDK on the frontend.

1. **Authenticate** — obtain a bearer token by posting your public and private keys to `https://api.felloh.com/token`
2. **Create a booking** (optional) — bookings enable payout assignments and require fields like `organisation`, `customer_name`, `email`, `booking_reference`, `departure_date`, `return_date`, and `gross_amount`
3. **Create an ecommerce instance** — provide `organisation`, `customer_name`, `email`, `amount`, and payment method flags (`open_banking_enabled`, `card_enabled`). The returned ID is what you pass to `render()`

See the [embedding a payment guide](https://developers.felloh.com/guides/embedding-payment) for full details.

## Quick Start

```html
<div id="payment-iframe" style="min-width: 350px;"></div>
```

```javascript
import SDK from '@felloh-org/payment-sdk';

const felloh = new SDK('payment-iframe', 'YOUR_PUBLIC_KEY');

felloh.onRender(() => {
  console.log('Payment form is ready');
});

felloh.onSuccess((data) => {
  console.log('Payment successful', data.transaction.id);
});

felloh.onDecline((data) => {
  console.log('Payment declined', data.transaction.id);
});

felloh.render('ecommerce-instance-uuid');
```

Replace `YOUR_PUBLIC_KEY` with your publishable API key from the [Felloh Dashboard](https://dashboard.felloh.com/).

## Constructor

```javascript
new FellohPayments(containerID, publicKey, options?)
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `containerID` | `string` | Yes | The ID of the DOM element where the payment form will render. Must be at least 350px wide. |
| `publicKey` | `string` | Yes | Your publishable API key from the Felloh Dashboard. |
| `options` | `object` | No | Configuration options (see below). |

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `sandbox` | `boolean` | `false` | Use the sandbox environment for testing. |
| `moto` | `boolean` | `false` | Enable Mail Order / Telephone Order mode. |
| `design.pay_button` | `boolean` | `true` | Show the built-in pay button. Set to `false` to trigger payment manually with `pay()`. |
| `design.store_card` | `boolean` | `true` | Show the option for customers to store their card. |

```javascript
const felloh = new SDK('payment-iframe', 'YOUR_PUBLIC_KEY', {
  sandbox: true,
  moto: false,
  design: {
    pay_button: false,
    store_card: true,
  },
});
```

## Methods

### `render(ecommerceID)`

Renders the payment form for the given ecommerce instance ID. The ID must be a valid UUID obtained from the Felloh API.

```javascript
felloh.render('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
```

Returns the SDK instance for chaining.

### `pay()`

Manually triggers payment processing. Use this when `design.pay_button` is set to `false` so you can run your own validation before initiating payment.

```javascript
document.getElementById('my-pay-button').addEventListener('click', () => {
  if (validateForm()) {
    felloh.pay();
  }
});
```

### `getStatus()`

Returns the current status of the payment form. Possible values:

| Status | Description |
|--------|-------------|
| `preload` | Initial state, before the form has loaded. |
| `rendered` | The payment form is loaded and ready. |
| `processing` | Payment is being processed. |
| `success` | Payment completed successfully. |
| `declined` | Payment was declined. |

## Events

All event callbacks can be registered before or after calling `render()`.

### `onRender(callback)`

Fires when the payment form has finished loading inside the iframe.

```javascript
felloh.onRender(() => {
  document.getElementById('loading-spinner').style.display = 'none';
});
```

### `onSuccess(callback)`

Fires when the payment is completed successfully. The callback receives a data object containing the transaction ID.

```javascript
felloh.onSuccess((data) => {
  console.log('Transaction ID:', data.transaction.id);
  window.location.href = '/payment/confirmation';
});
```

### `onDecline(callback)`

Fires when the payment is declined. The callback receives a data object containing the transaction ID.

```javascript
felloh.onDecline((data) => {
  console.log('Declined transaction:', data.transaction.id);
});
```

### `onProcessing(callback)`

Fires when the payment has been submitted and is being processed. The callback receives a data object containing the transaction ID.

```javascript
felloh.onProcessing((data) => {
  console.log('Processing transaction:', data.transaction.id);
});
```

## Environments

| Environment | Usage |
|-------------|-------|
| Production | Default. Live payments. |
| Sandbox | Set `sandbox: true`. For testing and development. |

Use the sandbox environment during development with test credentials from the [Felloh Dashboard](https://dashboard.felloh.com/). Switch to production by removing the `sandbox` option or setting it to `false`.

## Full Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>Checkout</title>
  <script src="https://sdk.felloh.com/"></script>
</head>
<body>
  <div id="payment-iframe" style="min-width: 350px;"></div>
  <button id="pay-btn" style="display: none;">Pay Now</button>

  <script>
    var felloh = new FellohPayments('payment-iframe', 'YOUR_PUBLIC_KEY', {
      sandbox: true,
      design: { pay_button: false },
    });

    felloh.onRender(function () {
      document.getElementById('pay-btn').style.display = 'block';
    });

    felloh.onSuccess(function (data) {
      alert('Payment successful! Transaction: ' + data.transaction.id);
    });

    felloh.onDecline(function (data) {
      alert('Payment declined. Please try again.');
    });

    felloh.onProcessing(function (data) {
      document.getElementById('pay-btn').disabled = true;
      document.getElementById('pay-btn').textContent = 'Processing...';
    });

    document.getElementById('pay-btn').addEventListener('click', function () {
      felloh.pay();
    });

    // Replace with your ecommerce instance ID from the Felloh API
    felloh.render('your-ecommerce-uuid');
  </script>
</body>
</html>
```

## Demo

See a working example of the embedded payment form at [https://embedded-demo.sandbox.felloh.com/](https://embedded-demo.sandbox.felloh.com/).

## Documentation

- [Felloh API Documentation](https://developers.felloh.com)
- [Embedding a Payment Guide](https://developers.felloh.com/guides/embedding-payment)
- [Felloh Dashboard](https://dashboard.felloh.com/)

## License

MIT

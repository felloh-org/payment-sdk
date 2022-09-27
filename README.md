# Felloh Payment SDK

[![Version](https://img.shields.io/npm/v/@felloh-org/payment-sdk.svg)](https://www.npmjs.com/package/@felloh-org/payment-sdk)
[![Build Status](https://github.com/felloh-org/payment-sdk/actions/workflows/release.yml/badge.svg?branch=main)](https://github.com/felloh-org/payment-sdk/actions/workflows/release.yml)
[![Downloads](https://img.shields.io/npm/dm/@felloh-org/payment-sdk.svg)](https://www.npmjs.com/package/@felloh-org/payment-sdk)
[![Try on RunKit](https://badge.runkitcdn.com/@felloh-org/payment-sdk.svg)](https://runkit.com/npm/@felloh-org/payment-sdk)

## Installation

Use `npm` to install the Felloh Payment SDK module:

```sh
npm install @felloh-org/payment-sdk
```

Alternatively you can use `yarn`,

```sh
yarn add @felloh-org/payment-sdk
```

## Usage

To instantiate the SDK, you need to pass the container ID that it will be rendered in and your public key.

```javascript
import SDK from '@felloh-org/payment-sdk';

const publicKey = '1F78BD638B945AED49F4ADAF79CDA';
const felloh = new SDK('payment-iframe', publicKey);


```

We’ve placed a random API key in this example. Replace it with your actual publishable API keys to test this code through your Felloh account.

For more information on how to use the Felloh SDK, please refer to the
[Felloh API reference](hhttps://developers.felloh.com/) or learn to
[Embed a payment](https://developers.felloh.com/embedded-payment-example) with
Felloh.

## SDK Documentation

- [Felloh API reference](hhttps://developers.felloh.com/)
- [Embed a payment](https://developers.felloh.com/embedded-payment-example)

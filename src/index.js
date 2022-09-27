/**
 * PaymentSDK Class
 */
class PaymentsSDK {
  /**
   * Payments SDK Constructor
   * @param containerName
   * @param publicKey
   * @param options?
   */
  constructor(
    containerName = null,
    publicKey = null,
    options = {
      sandbox: false,
    },
  ) {
    // Set the public key
    if (publicKey === null) {
      throw new Error('Felloh Payment SDK: Public key must be defined');
    }

    this.publicKey = publicKey;

    // Find the element and define it
    if (containerName === null) {
      throw new Error('Felloh Payment SDK: Container name must be defined');
    }

    this.targetElement = document.getElementById(containerName);

    if (this.targetElement === null) {
      throw new Error('Felloh Payment SDK: Target element does not exist');
    }

    // Set the base url for the pay frontend
    this.baseURL = options.sandbox === true ? 'https://pay.sandbox.felloh.com/embed/' : 'https://pay.felloh.com/embed/';

    // Define a unique ID for the Iframe
    this.iframeID = `iframe-${new Date().getTime()}`;

    // Define the current form status
    this.status = 'preload';

    // Define base events
    this.events = {
      onRender: () => {},
      onSuccess: () => {},
      onDecline: () => {},
      onProcessing: () => {},
    };
  }

  /**
   * Add listeners to the IFrame
   * @returns {PaymentsSDK}
   */
  addIFrameSizeListener() {
    const eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
    const eventer = window[eventMethod];
    const messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message';

    const classConstruct = this;

    eventer(messageEvent, (e) => {
      try {
        const json = JSON.parse(e.data);

        if (typeof json.status !== 'undefined') {
          if (json.stage === 'rendered' && this.status !== 'rendered') {
            this.events.onRender();
          }

          if (json.status === 'success' && this.status !== 'success') {
            this.events.onSuccess();
          }

          if (json.status === 'processing' && this.status !== 'processing') {
            this.events.onProcessing();
          }

          if (json.status === 'declined' && this.status !== 'declined') {
            this.events.onDecline();
          }

          this.status = json.status;
        }

        if (typeof json.iframe_height !== 'undefined') {
          document.getElementById(classConstruct.iframeID).style.height = `${json.iframe_height}px`;
        }
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }, false);

    return this;
  }

  /**
   * Render the IFrame
   * @param paymentID
   * @returns {PaymentsSDK}
   */
  renderIframe(paymentID) {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', `${this.baseURL}embed/${paymentID}`);
    iframe.style.width = '100%';
    iframe.style.height = '900px';
    iframe.id = this.iframeID;

    this.targetElement.innerHTML = '';
    this.targetElement.appendChild(iframe);

    this.addIFrameSizeListener();

    return this;
  }

  /**
   * On Render event trigger
   * @param eventFunction
   */
  onRender(eventFunction) {
    this.events.onRender = eventFunction;
  }

  /**
   * On Success event trigger
   * @param eventFunction
   */
  onSuccess(eventFunction) {
    this.events.onRender = eventFunction;
  }

  /**
   * On Decline event trigger
   * @param eventFunction
   */
  onDecline(eventFunction) {
    this.events.onRender = eventFunction;
  }

  /**
   * On Processing Event Triiger
   * @param eventFunction
   */
  onProcessing(eventFunction) {
    this.events.onRender = eventFunction;
  }

  /**
   * Get the current transaction status
   * @returns {string}
   */
  getStatus() {
    return this.status;
  }

  /**
   * Render the payment session
   * @param paymentID
   * @returns {PaymentsSDK}
   */
  render(paymentID) {
    if (this.targetElement !== null) {
      this.renderIframe(paymentID);
    }

    return this;
  }
}

export default PaymentsSDK;

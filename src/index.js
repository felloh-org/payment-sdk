import {
  DEV_ENV,
  PRODUCTION_ENV,
  SANDBOX_ENV,
} from './const/environment';
import {
  DECLINED,
  PRELOAD,
  PROCESSING,
  RENDERED,
  SUCCESS,
} from './const/progress';

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
      dev: false,
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
    this.setEnvironment(options);

    // Define a unique ID for the Iframe
    this.iframeID = `iframe-${new Date().getTime()}`;

    // Define the current form status
    this.status = PRELOAD;

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
          if (json.stage === RENDERED && this.status !== RENDERED) {
            this.events.onRender();
          }

          if (json.status === SUCCESS && this.status !== SUCCESS) {
            this.events.onSuccess();
          }

          if (json.status === PROCESSING && this.status !== PROCESSING) {
            this.events.onProcessing();
          }

          if (json.status === DECLINED && this.status !== DECLINED) {
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
   * Set the environment / base url
   * @param options
   */
  setEnvironment(options) {
    if (options.dev === true) {
      this.baseURL = DEV_ENV;
    } else if (options.sandbox === true) {
      this.baseURL = SANDBOX_ENV;
    } else {
      this.baseURL = PRODUCTION_ENV;
    }
  }

  /**
   * Render the IFrame
   * @param paymentID
   * @returns {PaymentsSDK}
   */
  renderIframe(paymentID) {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', `${this.baseURL}${paymentID}`);
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
   * Refresh trigger for iFrame
   * @param paymentID
   */
  linkRefreshTrigger(paymentID) {
    setInterval(() => {
      const iframeElement = document.getElementById(this.iframeID);

      if (iframeElement !== null && (this.status === PRELOAD || this.status === RENDERED)) {
        this.renderIframe(paymentID);
      }
    }, 15 * 60 * 1000);
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

    this.linkRefreshTrigger(paymentID);

    return this;
  }
}

export default PaymentsSDK;

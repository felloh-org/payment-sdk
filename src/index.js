class PaymentsSDK {

  constructor(containerName, sandbox = false) {
    this.targetElement = document.getElementById(containerName);

    if(this.targetElement === null) {
      throw new Error('Felloh Payment SDK: Target element does not exist')
    }

    this.baseURL = sandbox === true ? 'https://pay.sandbox.felloh.com/embed/' : 'https://pay.felloh.com/embed/';
    this.iframeID = `iframe-${new Date().getTime()}`;
  }

  addIFrameSizeListener() {
    const eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    const eventer = window[eventMethod];
    const messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

    const classConstruct = this;

    eventer(messageEvent,function(e) {
      try {
        const json = JSON.parse(e.data);

        if (typeof json.iframe_height !== 'undefined') {
          document.getElementById(classConstruct.iframeID).style.height = json.iframe_height + 'px';
        }
      } catch (e) {}
    }, false);
  }

  renderIframe(paymentID) {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("src", `https://pay.felloh.com/embed/${paymentID}`);
    iframe.style.width = "100%";
    iframe.style.height = "100px";
    iframe.id = this.iframeID;

    this.targetElement.innerHTML = '';
    this.targetElement.appendChild(iframe);

    this.addIFrameSizeListener();
  }

  render(paymentID) {
    if (this.targetElement !== null) {
      this.renderIframe(paymentID);
    }
  }
}

export default PaymentsSDK;

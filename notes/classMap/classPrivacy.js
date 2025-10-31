class Counter extends HTMLElement {
  #xValue = 0;
  constructor() {
    super();
    this.onclick = this.#clicked.bind(this);
  }
  get #x() {
    return this.#xValue;
  }
  set #x(value) {
    this.#xValue = value;
    window.requestAnimationFrame(this.#render.bind(this));
  }
  #clicked() {
    this.#x++;
  }
  #render() {
    this.textContent = this.#x.toString();
  }
  connectedCallback() {
    this.#render();
  }
}

customElements.define("num-counter", Counter);  // Adds num-counter to be used in html doc!

function createCounter() {
    let xValue;
    HTMLElement.call();
    
    function getX() {
        return xValue;
    }

    function setX(value) {
        xValue = value;
    }

    function clicked() {
        xValue++;
    }

    function render() {
        console.log("Rendered!");
    }

    function connectedCallback() {
        render()
    }

    return {getX, setX, connectedCallback}
}
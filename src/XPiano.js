export class XPiano extends HTMLElement {
  static get observedAttributes() {
    return ['ui-only', 'type', 'volume', 'octave', 'transpose', 'glide', 'attack', 'decay', 'sustain', 'release'];
  }

  /** @override */
  constructor(state = {}) {
    super();

    this.state = state;
    this.isDown = false;

    this.attachShadow({ mode: 'open' });
    this.render();
  }

  connectedCallback() {
    X('oscillator').setup([true]);

    this.setAttributes();

    for (const button of this.shadowRoot.querySelectorAll('button[type="button"]')) {
      button.addEventListener('mousedown', this.onDown.bind(this), false);
      button.addEventListener('mouseup', this.onUp.bind(this), false);
      button.addEventListener('mouseenter', this.onEnter.bind(this), false);
      button.addEventListener('mouseleave', this.onLeave.bind(this), false);
      button.addEventListener('touchstart', this.onDown.bind(this), false);
      button.addEventListener('touchend', this.onUp.bind(this), false);
    }
  }

  disconnectedCallback() {
    for (const button of this.shadowRoot.querySelectorAll('button[type="button"]')) {
      button.removeEventListener('mousedown', this.onDown.bind(this), false);
      button.removeEventListener('mouseup', this.onUp.bind(this), false);
      button.removeEventListener('mouseenter', this.onEnter.bind(this), false);
      button.removeEventListener('mouseleave', this.onLeave.bind(this), false);
      button.removeEventListener('touchstart', this.onDown.bind(this), false);
      button.removeEventListener('touchend', this.onUp.bind(this), false);
    }
  }

  adoptedCallback() {
    // Noop ...
  }

  attributeChangedCallback() {
    this.setAttributes();
  }

  onDown(event) {
    const button = event.currentTarget;

    button.classList.add('-on');

    this.isDown = true;

    if (this.hasAttribute('ui-only')) {
      return;
    }

    const index = Number(button.getAttribute('data-index'));
    const frequency = X.toFrequencies([index]);

    X('oscillator').start(frequency);
  }

  onUp(event) {
    const button = event.currentTarget;

    button.classList.remove('-on');

    this.isDown = false;

    if (this.hasAttribute('ui-only')) {
      return;
    }

    X('oscillator').stop();
  }

  onEnter(event) {
    if (!this.isDown) {
      return;
    }

    const button = event.currentTarget;

    button.classList.add('-on');

    if (this.hasAttribute('ui-only')) {
      return;
    }

    const index = Number(button.getAttribute('data-index'));
    const frequency = X.toFrequencies([index]);

    X('oscillator').start(frequency);
  }

  onLeave(event) {
    if (!this.isDown) {
      return;
    }

    const button = event.currentTarget;

    button.classList.remove('-on');

    if (this.hasAttribute('ui-only')) {
      return;
    }

    X('oscillator').stop();
  }

  setState(newState) {
    this.state = Object.assign({}, this.state, newState);
    this.render();
  }

  setAttributes() {
    if (typeof X('oscillator').get(0).param !== 'function') {
      return;
    }

    const mastervolume = Number(this.getAttribute('volume'));

    if (mastervolume >= 0 && mastervolume <= 1) {
      X('oscillator').param({ mastervolume });
    }

    const time = Number(this.getAttribute('glide'));

    if (time >= 0) {
      X('oscillator').module('glide').param({ time });
    }

    const octave = Number(this.getAttribute('octave'));

    if (octave >= -4 && octave <= 4) {
      X('oscillator').get(0).param({ octave });
    }

    const type = this.getAttribute('type');

    switch (type) {
      case 'sine':
      case 'square':
      case 'sawtooth':
      case 'triangle': {
        X('oscillator').get(0).param({ type });
        break;
      }

      default: {
        break;
      }
    }

    const attack = Number(this.getAttribute('attack'));

    if (attack >= 0 && attack <= 1) {
      X('oscillator').module('envelopegenerator').param({ attack });
    }

    const decay = Number(this.getAttribute('decay'));

    if (decay >= 0 && decay <= 1) {
      X('oscillator').module('envelopegenerator').param({ decay });
    }

    const sustain = Number(this.getAttribute('sustain'));

    if (sustain >= 0 && sustain <= 1) {
      X('oscillator').module('envelopegenerator').param({ sustain });
    }

    const release = Number(this.getAttribute('release'));

    if (release >= 0 && release <= 1) {
      X('oscillator').module('envelopegenerator').param({ release });
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .Piano {
          position: relative;
          z-index: 1;
          margin: 0 auto;
          border-top: 44px solid #1b1b1b;
          border-right: 16px solid #1b1b1b;
          border-bottom: 16px solid #1b1b1b;
          border-left: 16px solid #1b1b1b;
          width: 1196px;
          height: 150px;
          transition: opacity ease 0.6s;
        }

        :host([loading]) .Piano {
          opacity: 0.2;
        }

        .Piano__white {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
          margin: 0;
          padding: 0;
          list-style: none;
          display: grid;
          grid-template-columns: repeat(52, 23px);
        }

        .Piano__black {
          position: absolute;
          top: 0;
          left: 17.5px;
          z-index: 3;
          margin: 0;
          padding: 0;
          list-style: none;
          display: grid;
          grid-template-columns: repeat(50, 11px);
          grid-column-gap: 12px;
        }

        .Piano > ol > li > button[type="button"] {
          cursor: pointer;
          user-select: none;
          box-sizing: border-box;
          border: none;
          padding: 0;
          background: none;
        }

        .Piano > .Piano__white > li > button[type="button"] {
          border: 2px outset #eee;
          width: 23px;
          height: 150px;
          background-color: #fff;
        }

        .Piano > .Piano__black > li > button[type="button"] {
          border: 2px outset #333;
          width: 11px;
          height: 95px;
          background-color: #333;
        }

        .Piano > .Piano__white > li > button[type="button"].-on {
          background-color: #eee;
        }

        .Piano > .Piano__black > li > button[type="button"].-on {
          background-color: #000;
        }

        .Piano > ol > li.-skip {
          width: 11px;
          height: 95px;
          visibility: hidden;
        }
      </style>
      <div class="Piano">
        <ol class="Piano__black">
          <li><button type="button" data-index="1" aria-label="1" /></li>
          <li class="-skip"></li>
          <li><button type="button" data-index="4" aria-label="4" /></li>
          <li><button type="button" data-index="6" aria-label="6" /></li>
          <li class="-skip"></li>
          <li><button type="button" data-index="9" aria-label="9" /></li>
          <li><button type="button" data-index="11" aria-label="11" /></li>
          <li><button type="button" data-index="13" aria-label="13" /></li>
          <li class="-skip"></li>
          <li><button type="button" data-index="16" aria-label="16" /></li>
          <li><button type="button" data-index="18" aria-label="18" /></li>
          <li class="-skip"></li>
          <li><button type="button" data-index="21" aria-label="21" /></li>
          <li><button type="button" data-index="23" aria-label="23" /></li>
          <li><button type="button" data-index="25" aria-label="25" /></li>
          <li class="-skip"></li>
          <li><button type="button" data-index="28" aria-label="28" /></li>
          <li><button type="button" data-index="30" aria-label="30" /></li>
          <li class="-skip"></li>
          <li><button type="button" data-index="33" aria-label="33" /></li>
          <li><button type="button" data-index="35" aria-label="35" /></li>
          <li><button type="button" data-index="37" aria-label="37" /></li>
          <li class="-skip"></li>
          <li><button type="button" data-index="40" aria-label="40" /></li>
          <li><button type="button" data-index="42" aria-label="42" /></li>
          <li class="-skip"></li>
          <li><button type="button" data-index="45" aria-label="45" /></li>
          <li><button type="button" data-index="47" aria-label="47" /></li>
          <li><button type="button" data-index="49" aria-label="49" /></li>
          <li class="-skip"></li>
          <li><button type="button" data-index="52" aria-label="52" /></li>
          <li><button type="button" data-index="54" aria-label="54" /></li>
          <li class="-skip"></li>
          <li><button type="button" data-index="57" aria-label="57" /></li>
          <li><button type="button" data-index="59" aria-label="59" /></li>
          <li><button type="button" data-index="61" aria-label="61" /></li>
          <li class="-skip"></li>
          <li><button type="button" data-index="64" aria-label="64" /></li>
          <li><button type="button" data-index="66" aria-label="66" /></li>
          <li class="-skip"></li>
          <li><button type="button" data-index="69" aria-label="69" /></li>
          <li><button type="button" data-index="71" aria-label="71" /></li>
          <li><button type="button" data-index="73" aria-label="73" /></li>
          <li class="-skip"></li>
          <li><button type="button" data-index="76" aria-label="76" /></li>
          <li><button type="button" data-index="78" aria-label="78" /></li>
          <li class="-skip"></li>
          <li><button type="button" data-index="81" aria-label="81" /></li>
          <li><button type="button" data-index="83" aria-label="83" /></li>
          <li><button type="button" data-index="85" aria-label="85" /></li>
        </ol>
        <ol class="Piano__white">
          <li><button type="button" data-index="0" aria-label="0" /></li>
          <li><button type="button" data-index="2" aria-label="2" /></li>
          <li><button type="button" data-index="3" aria-label="3" /></li>
          <li><button type="button" data-index="5" aria-label="5" /></li>
          <li><button type="button" data-index="7" aria-label="7" /></li>
          <li><button type="button" data-index="8" aria-label="8" /></li>
          <li><button type="button" data-index="10" aria-label="10" /></li>
          <li><button type="button" data-index="12" aria-label="12" /></li>
          <li><button type="button" data-index="14" aria-label="14" /></li>
          <li><button type="button" data-index="15" aria-label="15" /></li>
          <li><button type="button" data-index="17" aria-label="17" /></li>
          <li><button type="button" data-index="19" aria-label="19" /></li>
          <li><button type="button" data-index="20" aria-label="20" /></li>
          <li><button type="button" data-index="22" aria-label="22" /></li>
          <li><button type="button" data-index="24" aria-label="24" /></li>
          <li><button type="button" data-index="26" aria-label="26" /></li>
          <li><button type="button" data-index="27" aria-label="27" /></li>
          <li><button type="button" data-index="29" aria-label="29" /></li>
          <li><button type="button" data-index="31" aria-label="31" /></li>
          <li><button type="button" data-index="33" aria-label="33" /></li>
          <li><button type="button" data-index="34" aria-label="34" /></li>
          <li><button type="button" data-index="36" aria-label="36" /></li>
          <li><button type="button" data-index="38" aria-label="38" /></li>
          <li><button type="button" data-index="39" aria-label="39" /></li>
          <li><button type="button" data-index="41" aria-label="41" /></li>
          <li><button type="button" data-index="43" aria-label="43" /></li>
          <li><button type="button" data-index="44" aria-label="44" /></li>
          <li><button type="button" data-index="46" aria-label="46" /></li>
          <li><button type="button" data-index="48" aria-label="48" /></li>
          <li><button type="button" data-index="50" aria-label="50" /></li>
          <li><button type="button" data-index="51" aria-label="51" /></li>
          <li><button type="button" data-index="53" aria-label="53" /></li>
          <li><button type="button" data-index="55" aria-label="55" /></li>
          <li><button type="button" data-index="56" aria-label="56" /></li>
          <li><button type="button" data-index="58" aria-label="58" /></li>
          <li><button type="button" data-index="60" aria-label="60" /></li>
          <li><button type="button" data-index="62" aria-label="62" /></li>
          <li><button type="button" data-index="63" aria-label="63" /></li>
          <li><button type="button" data-index="65" aria-label="65" /></li>
          <li><button type="button" data-index="67" aria-label="67" /></li>
          <li><button type="button" data-index="68" aria-label="68" /></li>
          <li><button type="button" data-index="70" aria-label="70" /></li>
          <li><button type="button" data-index="72" aria-label="72" /></li>
          <li><button type="button" data-index="74" aria-label="74" /></li>
          <li><button type="button" data-index="75" aria-label="75" /></li>
          <li><button type="button" data-index="77" aria-label="77" /></li>
          <li><button type="button" data-index="79" aria-label="79" /></li>
          <li><button type="button" data-index="80" aria-label="80" /></li>
          <li><button type="button" data-index="82" aria-label="82" /></li>
          <li><button type="button" data-index="84" aria-label="84" /></li>
          <li><button type="button" data-index="86" aria-label="86" /></li>
          <li><button type="button" data-index="87" aria-label="87" /></li>
        </ol>
      </div>`;
  }
}

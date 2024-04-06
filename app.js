'use strict';

const xpiano = document.querySelector('x-piano');

document.getElementById('checkbox-ui-only').addEventListener(
  'click',
  (event) => {
    if (event.currentTarget.checked) {
      xpiano.setAttribute('ui-only', '');
    } else {
      xpiano.removeAttribute('ui-only');
    }
  },
  false
);

document.getElementById('form-type').addEventListener(
  'change',
  (event) => {
    const form = event.currentTarget;

    for (const radio of form.elements['radio-type']) {
      if (radio.checked) {
        xpiano.setAttribute('type', radio.value);
        break;
      }
    }
  },
  false
);

document.getElementById('range-volume').addEventListener(
  'input',
  (event) => {
    const volume = event.currentTarget.value;

    xpiano.setAttribute('volume', volume);
    document.getElementById('output-volume').textContent = volume;
  },
  false
);

document.getElementById('range-octave').addEventListener(
  'input',
  (event) => {
    const octave = event.currentTarget.value;

    xpiano.setAttribute('octave', octave);
    document.getElementById('output-octave').textContent = octave;
  },
  false
);

document.getElementById('range-glide').addEventListener(
  'input',
  (event) => {
    const glide = event.currentTarget.value;

    xpiano.setAttribute('glide', glide);
    document.getElementById('output-glide').textContent = glide;
  },
  false
);

document.getElementById('range-attack').addEventListener(
  'input',
  (event) => {
    const attack = event.currentTarget.value;

    xpiano.setAttribute('attack', attack);
    document.getElementById('output-attack').textContent = attack;
  },
  false
);

document.getElementById('range-decay').addEventListener(
  'input',
  (event) => {
    const decay = event.currentTarget.value;

    xpiano.setAttribute('decay', decay);
    document.getElementById('output-decay').textContent = decay;
  },
  false
);

document.getElementById('range-sustain').addEventListener(
  'input',
  (event) => {
    const sustain = event.currentTarget.value;

    xpiano.setAttribute('sustain', sustain);
    document.getElementById('output-sustain').textContent = sustain;
  },
  false
);

document.getElementById('range-release').addEventListener(
  'input',
  (event) => {
    const release = event.currentTarget.value;

    xpiano.setAttribute('release', release);
    document.getElementById('output-release').textContent = release;
  },
  false
);

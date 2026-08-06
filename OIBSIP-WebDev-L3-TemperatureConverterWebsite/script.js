/* ==========================================================================
   Temperature Converter - Vanilla JavaScript Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const tempInput = document.getElementById('tempInput');
  const fromUnitSelect = document.getElementById('fromUnit');
  const convertBtn = document.getElementById('convertBtn');
  const resetBtn = document.getElementById('resetBtn');
  const errorBox = document.getElementById('errorBox');
  const errorMsg = document.getElementById('errorMsg');

  // Result Value Cards
  const celsiusVal = document.getElementById('celsiusVal');
  const fahrenheitVal = document.getElementById('fahrenheitVal');
  const kelvinVal = document.getElementById('kelvinVal');

  // Gauge Elements
  const gaugeFill = document.getElementById('gaugeFill');
  const gaugeText = document.getElementById('gaugeText');

  // Preset Buttons
  const presetBtns = document.querySelectorAll('.preset-btn');

  // Conversion Functions
  function convertTemperature() {
    clearError();
    const rawVal = tempInput.value.trim();

    // Check if input is empty
    if (rawVal === '') {
      showError('Please enter a temperature value.');
      resetOutputs();
      return;
    }

    // Reject non-numeric input (allow numbers, decimals, negative sign)
    const val = Number(rawVal);
    if (isNaN(val)) {
      showError('Invalid input! Please enter a valid numerical value.');
      resetOutputs();
      return;
    }

    const unit = fromUnitSelect.value;
    let c, f, k;

    // Absolute Zero Validation & Conversions
    if (unit === 'C') {
      if (val < -273.15) {
        showError('Temperature cannot be below Absolute Zero (−273.15 °C)!');
        resetOutputs();
        return;
      }
      c = val;
      f = (val * 9 / 5) + 32;
      k = val + 273.15;
    } else if (unit === 'F') {
      if (val < -459.67) {
        showError('Temperature cannot be below Absolute Zero (−459.67 °F)!');
        resetOutputs();
        return;
      }
      c = (val - 32) * 5 / 9;
      f = val;
      k = c + 273.15;
    } else if (unit === 'K') {
      if (val < 0) {
        showError('Temperature cannot be below Absolute Zero (0 K)!');
        resetOutputs();
        return;
      }
      c = val - 273.15;
      f = (c * 9 / 5) + 32;
      k = val;
    }

    // Format & Render Outputs (rounded to 2 decimal places)
    celsiusVal.textContent = `${c.toFixed(2)} °C`;
    fahrenheitVal.textContent = `${f.toFixed(2)} °F`;
    kelvinVal.textContent = `${k.toFixed(2)} K`;

    // Highlight active unit card
    updateActiveUnitHighlight(unit);

    // Update Temperature Gauge
    updateGauge(c);
  }

  // Error Handling Helpers
  function showError(msg) {
    errorMsg.textContent = msg;
    errorBox.classList.add('active');
  }

  function clearError() {
    errorBox.classList.remove('active');
  }

  function resetOutputs() {
    celsiusVal.textContent = '-- °C';
    fahrenheitVal.textContent = '-- °F';
    kelvinVal.textContent = '-- K';
    gaugeFill.style.width = '50%';
    gaugeText.textContent = 'Thermal State: Normal';
    document.querySelectorAll('.result-card').forEach(card => card.classList.remove('active-unit'));
  }

  function updateActiveUnitHighlight(unit) {
    document.querySelectorAll('.result-card').forEach(card => {
      if (card.dataset.unit === unit) {
        card.classList.add('active-unit');
      } else {
        card.classList.remove('active-unit');
      }
    });
  }

  // Update Dynamic Gauge & Thermal Status
  function updateGauge(celsius) {
    let pct, statusText, colorGrad;

    if (celsius <= -50) {
      pct = 5;
      statusText = 'Extreme Freezing ❄️';
      colorGrad = 'linear-gradient(90deg, #0284c7, #38bdf8)';
    } else if (celsius <= 0) {
      pct = 20;
      statusText = 'Freezing Point 🧊';
      colorGrad = 'linear-gradient(90deg, #0284c7, #38bdf8)';
    } else if (celsius <= 25) {
      pct = 45;
      statusText = 'Mild / Room Temp 🌿';
      colorGrad = 'linear-gradient(90deg, #38bdf8, #3b82f6)';
    } else if (celsius <= 50) {
      pct = 70;
      statusText = 'Warm / Hot ☀️';
      colorGrad = 'linear-gradient(90deg, #3b82f6, #f97316)';
    } else if (celsius <= 100) {
      pct = 88;
      statusText = 'Boiling Point ♨️';
      colorGrad = 'linear-gradient(90deg, #f97316, #ef4444)';
    } else {
      pct = 100;
      statusText = 'Extreme Heat 🔥';
      colorGrad = 'linear-gradient(90deg, #ef4444, #dc2626)';
    }

    gaugeFill.style.width = `${pct}%`;
    gaugeFill.style.background = colorGrad;
    gaugeText.textContent = `State: ${statusText}`;
  }

  // Event Listeners
  convertBtn.addEventListener('click', convertTemperature);

  // Real-time conversion on input
  tempInput.addEventListener('input', convertTemperature);
  fromUnitSelect.addEventListener('change', convertTemperature);

  // Reset button
  resetBtn.addEventListener('click', () => {
    tempInput.value = '';
    clearError();
    resetOutputs();
    tempInput.focus();
  });

  // Preset button clicks
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tempInput.value = btn.dataset.val;
      fromUnitSelect.value = 'C';
      convertTemperature();
    });
  });

  // Initialize on load
  convertTemperature();
});

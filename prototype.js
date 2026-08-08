const steps = document.querySelectorAll('.prototype-step');
const ui = document.querySelector('#prototype-ui');
const title = document.querySelector('#prototype-title');
const role = document.querySelector('#prototype-role');
const copy = document.querySelector('#prototype-copy');
const screenContent = {
  welcome: ['SWIFTRIDE', 'Move through<br>your city.', 'Reliable rides, when you need them.', 'Get started'],
  search: ['SEARCH', 'Where to?', 'Luna Bakery<br>Mont Kiara<br>KLCC', 'Search destination'],
  choice: ['PICKUP · LUNA BAKERY', 'Choose your ride', 'SwiftGo · 3 min · RM 12', 'Choose SwiftGo'],
  booking: ['BOOKING CONFIRMED', 'Amin is on the way', 'Silver Bezza · VCR 8462', 'Track ride'],
  arrival: ['DRIVER ARRIVING', 'Amin is 2 min away', 'Silver Bezza · VCR 8462', 'Track live ride'],
  trip: ['ON TRIP · 12 MIN LEFT', 'To Mont Kiara', 'Share trip · Safety centre', 'Get help'],
  driver: ['NEXT PICKUP', 'Luna Bakery', 'Pickup code · 4 8 2 1', 'I have arrived'],
  offer: ['NEW RIDE REQUEST', 'RM 12.40', 'Luna Bakery → Mont Kiara', 'Accept ride'],
  earnings: ['TODAY’S EARNINGS', 'RM 184.60', '8 trips · +12% from Tue', 'View trip history']
};
const mapStates = new Set(['choice', 'booking', 'arrival', 'trip', 'driver', 'offer']);
const mapMarkup = '<div class="proto-map" aria-hidden="true"><i class="map-road road-a"></i><i class="map-road road-b"></i><i class="map-road road-c"></i><i class="map-route"></i><i class="map-pin map-start"></i><i class="map-car">›</i><i class="map-pin map-end"></i><b class="map-area">KUALA LUMPUR</b></div>';
steps.forEach((step, index) => step.addEventListener('click', () => {
  steps.forEach((item) => item.classList.remove('is-active')); step.classList.add('is-active');
  const data = screenContent[step.dataset.type];
  ui.className = `prototype-ui type-${step.dataset.type}`;
  ui.innerHTML = `${mapStates.has(step.dataset.type) ? mapMarkup : ''}<div class="proto-mark">${data[0]}</div><h3>${data[1]}</h3><p>${data[2]}</p><button>${data[3]}</button>`;
  title.textContent = step.dataset.title; role.textContent = `${step.dataset.role} / ${String(index + 1).padStart(2, '0')}`; copy.textContent = step.dataset.copy;
}));
if (steps.length > 6) steps[6].click();

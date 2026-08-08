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
const searchScreen = () => `<div class="penpot-screen p-search"><b class="p-back">←</b><h3>Where to?</h3><div class="p-search-field"><i>⌕</i>Petaling Jaya Station</div><span class="p-section">SUGGESTIONS</span><div class="p-result r-one">Petaling Jaya Station<small>1.8 km away</small></div><div class="p-result r-two">Paradigm Mall<small>3.1 km away</small></div><div class="p-result r-three">Kelana Jaya LRT<small>4.3 km away</small></div><span class="p-saved">SAVED PLACES</span><div class="p-home">⌂ Home<small>Jalan Melati 3</small></div></div>`;
const riderMap = (title, label) => `<div class="penpot-screen p-map"><div class="p-map-art"></div><div class="p-top-card"><small>CURRENT LOCATION</small><b>Jalan Mesui</b></div><div class="p-safety">✦</div><div class="p-vehicle">⌁</div><div class="p-route"></div><div class="p-drop">●</div><div class="p-sheet"><div class="p-handle"></div><span class="p-label">${label}</span><h3>${title}</h3><div class="p-driver-row"><div class="p-avatar">AM</div><div><b>Amin Rahman</b><small>Silver Bezza · VCR 8462</small></div></div><div class="p-actions"><button>Contact</button><button>Cancel ride</button></div></div></div>`;
const driverMap = () => `<div class="penpot-screen p-map p-driver-map"><div class="p-map-art"></div><div class="p-turn"><strong>↰</strong><div><b>Turn left onto Jalan Mesui</b><small>180 m · stay in the left lane</small></div></div><div class="p-eta">8 MIN</div><div class="p-speed">42 km/h</div><div class="p-vehicle">▲</div><div class="p-route"></div><div class="p-drop">1</div><div class="p-driver-sheet"><div class="p-handle"></div><span class="p-label">PICKUP</span><h3>Luna Bakery</h3><p>Jalan Mesui · rider waiting</p><div class="p-driver-buttons"><button>Contact rider</button><button>Report issue</button></div><div class="p-otp-label">PICKUP CODE</div><div class="p-otp-row"><b>4 8 2 1</b><button>Arrived</button></div></div></div>`;
const renderPenpotScreen = (type, data) => {
  if (type === 'search') return searchScreen();
  if (type === 'arrival' || type === 'trip' || type === 'booking') return riderMap(data[1], data[0]);
  if (type === 'driver' || type === 'offer') return driverMap();
  if (type === 'choice') return riderMap('Choose your ride', 'PICKUP · LUNA BAKERY');
  if (type === 'earnings') return `<div class="penpot-screen p-driver-sheet" style="height:100%;border-radius:0"><span class="p-label">TODAY’S EARNINGS</span><h3>RM 184.60</h3><p>8 trips · +12% from Tuesday</p><div class="p-driver-buttons"><button>Luna Bakery · RM 12.40</button><button>KLCC · RM 23.80</button></div><div class="p-otp-label">THIS WEEK</div><div class="p-otp-row"><b>RM 892</b><button>History</button></div></div>`;
  return `<div class="penpot-screen p-search"><h3>${data[1]}</h3><p style="position:absolute;left:17px;top:93px;color:#6c6a63;font-size:11px">${data[2]}</p><div class="p-home" style="top:180px">SwiftRide<small>Product state ready</small></div></div>`;
};
steps.forEach((step, index) => step.addEventListener('click', () => {
  steps.forEach((item) => item.classList.remove('is-active')); step.classList.add('is-active');
  const data = screenContent[step.dataset.type];
  ui.className = `prototype-ui type-${step.dataset.type}`;
  ui.innerHTML = renderPenpotScreen(step.dataset.type, data);
  title.textContent = step.dataset.title; role.textContent = `${step.dataset.role} / ${String(index + 1).padStart(2, '0')}`; copy.textContent = step.dataset.copy;
}));
if (steps.length > 6) steps[6].click();

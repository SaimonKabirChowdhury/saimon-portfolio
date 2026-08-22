const findings = [
  {
    id: "f1",
    title: "Missing edge protection",
    severity: "critical",
    confidence: 97,
    site: "KL Sentral Expansion",
    zone: "Zone B · Level 4",
    detected: "Today · 16:42",
    assignee: "Unassigned",
    description: "An exposed work edge was detected without a complete guardrail system in the active work area.",
    recommendation: "Restrict access to the affected edge and install compliant temporary guardrails before work resumes.",
    age: "8m"
  },
  {
    id: "f2",
    title: "Worker outside PPE zone",
    severity: "high",
    confidence: 94,
    site: "KL Sentral Expansion",
    zone: "Zone B · Access lane",
    detected: "Today · 16:41",
    assignee: "Nadia R.",
    description: "A person was detected inside the marked work zone without all required visible PPE.",
    recommendation: "Verify site access controls and notify the floor supervisor to perform a PPE compliance check.",
    age: "9m"
  },
  {
    id: "f3",
    title: "Material obstructing walkway",
    severity: "medium",
    confidence: 89,
    site: "KL Sentral Expansion",
    zone: "Zone B · East corridor",
    detected: "Today · 16:38",
    assignee: "Farid H.",
    description: "Stored material is narrowing a designated pedestrian route and may reduce safe access through the corridor.",
    recommendation: "Move stored material to the approved staging area and confirm the walkway width is restored.",
    age: "12m"
  },
  {
    id: "f4",
    title: "Unsecured temporary opening",
    severity: "critical",
    confidence: 96,
    site: "Subang Logistics Hub",
    zone: "Roof deck · South",
    detected: "Today · 15:58",
    assignee: "Unassigned",
    description: "A temporary floor opening appears uncovered and lacks a visible exclusion barrier.",
    recommendation: "Secure the opening immediately with a rated cover or barrier and log supervisor verification.",
    age: "52m"
  },
  {
    id: "f5",
    title: "Cable across vehicle route",
    severity: "high",
    confidence: 91,
    site: "PJ Commercial Retrofit",
    zone: "Loading bay · Gate 2",
    detected: "Today · 15:36",
    assignee: "Amir S.",
    description: "A temporary electrical cable is routed across an active material-handling path without visible protection.",
    recommendation: "Reroute overhead or install an appropriate cable protector before the route reopens.",
    age: "1h"
  },
  {
    id: "f6",
    title: "Housekeeping debris cluster",
    severity: "medium",
    confidence: 87,
    site: "Subang Logistics Hub",
    zone: "Ground floor · Bay 6",
    detected: "Today · 14:52",
    assignee: "Mei L.",
    description: "Loose debris and packaging material were detected inside an active work and movement zone.",
    recommendation: "Clear debris during the current housekeeping cycle and re-capture the area for verification.",
    age: "2h"
  }
];

const sites = {
  "zone-b": {
    title: "KL Sentral Expansion · Zone B",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=85",
    capture: "Drone · 16:42",
    confidence: "92.8% mean confidence",
    detections: "8 objects · 3 findings"
  },
  roof: {
    title: "Subang Logistics Hub · Roof Deck",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=85",
    capture: "Mobile · 15:58",
    confidence: "90.6% mean confidence",
    detections: "11 objects · 2 findings"
  },
  loading: {
    title: "PJ Commercial Retrofit · Loading Bay",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1600&q=85",
    capture: "CCTV · 15:36",
    confidence: "88.9% mean confidence",
    detections: "6 objects · 1 finding"
  }
};

const findingsList = document.getElementById("findingsList");
const filterRow = document.getElementById("filterRow");
const drawer = document.getElementById("findingDrawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");
const closeDrawer = document.getElementById("closeDrawer");
const toast = document.getElementById("toast");
const toastText = document.getElementById("toastText");
const toastIcon = document.getElementById("toastIcon");
const modal = document.getElementById("inspectionModal");
const visionFrame = document.getElementById("visionFrame");
const siteImage = document.getElementById("siteImage");
const siteTitle = document.getElementById("siteTitle");
const confidenceText = document.getElementById("confidenceText");
const captureLabel = document.getElementById("captureLabel");
const detectionCount = document.getElementById("detectionCount");
let activeFilter = "all";
let activeFinding = null;
let openFindings = 18;

function renderFindings() {
  const visible = findings.filter(item => !item.resolved && (activeFilter === "all" || item.severity === activeFilter));
  findingsList.innerHTML = visible.length ? visible.map(item => `
    <button class="finding-card" data-finding="${item.id}">
      <span class="severity-bar ${item.severity}"></span>
      <span class="finding-main">
        <strong>${item.title}</strong>
        <small>${item.site} · ${item.zone.split(" · ").pop()}</small>
      </span>
      <span class="finding-meta">
        <b class="${item.severity}">${item.severity.toUpperCase()}</b>
        <small>${item.age}</small>
      </span>
    </button>
  `).join("") : `<div style="padding:28px 16px;text-align:center;color:#8799ad;font-size:10px">No open findings in this filter.</div>`;
}

function setFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll("[data-filter]").forEach(btn => {
    if (btn.classList.contains("filter-pill")) btn.classList.toggle("active", btn.dataset.filter === filter);
  });
  renderFindings();
}

function openFinding(id) {
  const finding = findings.find(item => item.id === id);
  if (!finding) return;
  activeFinding = finding;
  document.getElementById("drawerTitle").textContent = finding.title;
  document.getElementById("drawerSeverity").textContent = `${finding.severity.toUpperCase()} PRIORITY`;
  document.getElementById("drawerConfidence").textContent = `${finding.confidence}% MODEL CONFIDENCE`;
  document.getElementById("drawerDescription").textContent = finding.description;
  document.getElementById("drawerSite").textContent = finding.site;
  document.getElementById("drawerZone").textContent = finding.zone;
  document.getElementById("drawerDetected").textContent = finding.detected;
  document.getElementById("drawerAssignee").textContent = finding.assignee;
  document.getElementById("drawerRecommendation").textContent = finding.recommendation;
  document.getElementById("drawerImage").src = siteImage.src;
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
}

function closeFinding() {
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
}

function showToast(message, icon = "✓") {
  toastText.textContent = message;
  toastIcon.textContent = icon;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function switchSite(key) {
  const site = sites[key];
  if (!site) return;
  document.querySelectorAll("[data-site]").forEach(btn => {
    if (btn.classList.contains("site-chip")) btn.classList.toggle("active", btn.dataset.site === key);
  });
  siteImage.style.opacity = ".25";
  setTimeout(() => {
    siteImage.src = site.image;
    siteImage.alt = `${site.title} inspection view`;
    siteTitle.textContent = site.title;
    captureLabel.textContent = site.capture;
    confidenceText.textContent = site.confidence;
    detectionCount.textContent = site.detections;
    siteImage.style.opacity = "1";
  }, 180);
}

function runScan() {
  if (visionFrame.classList.contains("scanning")) return;
  visionFrame.classList.add("scanning");
  showToast("Visual scan started", "✦");
  setTimeout(() => {
    visionFrame.classList.remove("scanning");
    confidenceText.textContent = "93.4% mean confidence";
    showToast("Scan complete · 3 findings prioritized", "✓");
  }, 3300);
}

function openModal() {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

filterRow.addEventListener("click", event => {
  const button = event.target.closest("[data-filter]");
  if (button) setFilter(button.dataset.filter);
});

document.querySelector('.findings-panel [data-filter="all"]').addEventListener("click", () => setFilter("all"));

findingsList.addEventListener("click", event => {
  const card = event.target.closest("[data-finding]");
  if (card) openFinding(card.dataset.finding);
});

document.querySelectorAll(".detection-box").forEach(box => box.addEventListener("click", () => openFinding(box.dataset.finding)));

drawerBackdrop.addEventListener("click", closeFinding);
closeDrawer.addEventListener("click", closeFinding);

document.getElementById("resolveBtn").addEventListener("click", () => {
  if (!activeFinding) return;
  activeFinding.resolved = true;
  openFindings = Math.max(0, openFindings - 1);
  document.getElementById("openFindingMetric").textContent = openFindings;
  renderFindings();
  closeFinding();
  showToast("Finding marked resolved");
});

document.getElementById("assignBtn").addEventListener("click", () => {
  if (!activeFinding) return;
  activeFinding.assignee = activeFinding.assignee === "Unassigned" ? "Saimon Kabir" : activeFinding.assignee;
  document.getElementById("drawerAssignee").textContent = activeFinding.assignee;
  showToast(`Assigned to ${activeFinding.assignee}`);
});

document.getElementById("siteSwitcher").addEventListener("click", event => {
  const button = event.target.closest("[data-site]");
  if (button) switchSite(button.dataset.site);
});

document.querySelector(".site-table").addEventListener("click", event => {
  const row = event.target.closest("[data-site]");
  if (!row) return;
  switchSite(row.dataset.site);
  document.querySelector(".site-vision-panel").scrollIntoView({behavior:"smooth", block:"center"});
});

document.querySelectorAll("[data-overlay]").forEach(button => button.addEventListener("click", () => {
  document.querySelectorAll("[data-overlay]").forEach(b => b.classList.toggle("active", b === button));
  const boxes = document.querySelectorAll(".detection-box");
  const mode = button.dataset.overlay;
  boxes.forEach(box => box.style.display = mode === "raw" ? "none" : "block");
  if (mode === "zones") {
    boxes.forEach(box => box.style.opacity = ".45");
    showToast("Zone overlay enabled", "◎");
  } else {
    boxes.forEach(box => box.style.opacity = "1");
  }
}));

document.getElementById("scanBtn").addEventListener("click", runScan);
document.getElementById("newInspectionBtn").addEventListener("click", openModal);
document.getElementById("uploadBtn").addEventListener("click", openModal);
document.getElementById("openInspectionBtn").addEventListener("click", openModal);
document.querySelectorAll("[data-close-modal]").forEach(el => el.addEventListener("click", closeModal));

document.getElementById("createInspectionBtn").addEventListener("click", () => {
  const site = document.getElementById("inspectionSite").value;
  closeModal();
  showToast(`Inspection created · ${site}`, "✦");
  setTimeout(runScan, 350);
});

document.getElementById("fileInput").addEventListener("change", event => {
  const count = event.target.files.length;
  if (count) showToast(`${count} file${count > 1 ? "s" : ""} ready for inspection`, "↑");
});

document.getElementById("exportBtn").addEventListener("click", () => showToast("Demo report prepared", "↓"));

document.querySelectorAll(".nav-item").forEach(item => item.addEventListener("click", () => {
  document.querySelectorAll(".nav-item").forEach(i => i.classList.toggle("active", i === item));
  const labels = {dashboard:"Overview", inspections:"Inspections", sites:"Sites", issues:"Issues", analytics:"Analytics"};
  if (item.dataset.view !== "dashboard") showToast(`${labels[item.dataset.view]} view is staged for the next build`, "→");
  document.getElementById("sidebar").classList.remove("open");
}));

document.getElementById("mobileMenu").addEventListener("click", () => document.getElementById("sidebar").classList.toggle("open"));

document.getElementById("globalSearch").addEventListener("input", event => {
  const q = event.target.value.trim().toLowerCase();
  if (!q) return renderFindings();
  findingsList.innerHTML = findings.filter(f => `${f.title} ${f.site} ${f.zone}`.toLowerCase().includes(q) && !f.resolved).map(item => `
    <button class="finding-card" data-finding="${item.id}">
      <span class="severity-bar ${item.severity}"></span>
      <span class="finding-main"><strong>${item.title}</strong><small>${item.site} · ${item.zone}</small></span>
      <span class="finding-meta"><b class="${item.severity}">${item.severity.toUpperCase()}</b><small>${item.age}</small></span>
    </button>`).join("") || `<div style="padding:28px 16px;text-align:center;color:#8799ad;font-size:10px">No matching findings.</div>`;
});

document.addEventListener("keydown", event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    document.getElementById("globalSearch").focus();
  }
  if (event.key === "Escape") {
    closeFinding();
    closeModal();
    document.getElementById("sidebar").classList.remove("open");
  }
});

renderFindings();

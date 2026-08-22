# SiteSight

**Visual site intelligence for operational teams.**

SiteSight is a portfolio MVP for construction, facilities and field-operations teams that need to turn site imagery into an actionable inspection queue. Instead of leaving photos in folders or chat threads, the product presents visual detections alongside severity, site context, assignment and resolution workflow.

## Problem

Operational teams capture a large amount of site imagery, but reviewing it is manual and fragmented. Important hazards or defects can be buried inside photo sets, while managers lack a single view of what was detected, where it happened, how urgent it is and who owns the next action.

## Target users

- **Operations manager** — monitors risk across active sites and prioritizes interventions.
- **Site supervisor** — reviews findings for a site/zone and assigns corrective work.
- **Inspector / field engineer** — uploads drone, mobile or camera imagery and validates findings.

## MVP user flow

1. Select a site or start a new inspection.
2. Upload or simulate drone/mobile/CCTV imagery.
3. Run a visual scan.
4. Review AI-assisted detections over the source image.
5. Filter findings by severity.
6. Open a finding to inspect confidence, zone, evidence and recommendation.
7. Assign or resolve the finding.
8. Review coverage and risk trends across sites.

## Current implementation

The first browser MVP includes:

- Responsive operations dashboard.
- Multi-site inspection view.
- Visual detection overlays.
- Critical / high / medium finding filters.
- Finding detail drawer with evidence and AI recommendation.
- Assignment and resolution interactions.
- Simulated visual scan workflow.
- New inspection / imagery upload flow.
- Search, site switching, risk trend and coverage views.

The current AI analysis is an explicitly simulated portfolio workflow with seeded inspection data. It does **not** claim to run a production computer-vision model yet.

## Planned technical architecture

```text
Drone / Mobile / CCTV imagery
            |
            v
      Inspection API
            |
      Object storage
            |
            v
   CV inference service
            |
     Finding pipeline
            |
            v
 Postgres / audit events
            |
            v
  SiteSight web dashboard
```

A production iteration can use a Python/FastAPI inference service with YOLO or a custom detection model, object storage for media, PostgreSQL for inspections/findings, and a web frontend consuming the inspection API.

## Portfolio positioning

SiteSight is designed to demonstrate product thinking around **computer vision + operational workflow**, not just model inference. The engineering story includes evidence review, model confidence, severity triage, human validation, assignment, auditability and resolution.

## Run locally

No build step is required for this first prototype. Open `index.html` directly or serve the folder with any static server.

```bash
python -m http.server 8080
```

Then open `http://localhost:8080/projects/03-sitesight/` when serving from the repository root.

## Next build

- Replace seeded scan results with a real inference API.
- Persist inspections and findings.
- Add authentication and role-based access.
- Add before/after evidence and comments.
- Add inspection report export.
- Add model/version audit metadata.
- Capture portfolio screenshots and a short walkthrough video.

**Status:** Interactive MVP in progress.

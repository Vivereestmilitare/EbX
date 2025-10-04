    title EbX Nexus – Core Execution Roadmap
    dateFormat  YYYY-MM-DD
    axisFormat  %b %W
    section Phase 1 – Foundation & Schema Design
    Define architecture & data flow           :a1, 2025-10-06, 7d
    Design unified workforce schema           :a2, after a1, 7d
    Set up FastAPI + Postgres environment     :a3, after a2, 7d
    Deliverables: ERD, data dictionary, API base :milestone, a3, 0d

    section Phase 2 – Data Ingestion & Normalization
    Build CSV ingestion endpoint (/ingest)    :b1, 2025-10-20, 7d
    Implement normalization logic (Pandas)    :b2, after b1, 7d
    Add pseudonymization & validation         :b3, after b2, 7d
    Deliverables: working ingestion pipeline  :milestone, b3, 0d

    section Phase 3 – Intelligence Layer (AI & Embeddings)
    Implement skill extraction (HF model)     :c1, 2025-11-03, 7d
    Connect vector DB (Qdrant) + embeddings   :c2, after c1, 7d
    Build similarity API (/skills/similar)    :c3, after c2, 7d
    Deliverables: AI endpoints operational    :milestone, c3, 0d

    section Phase 4 – Insight Engine & Dashboard
    Compute workforce KPIs                    :d1, 2025-11-17, 7d
    Build interactive dashboard (Streamlit/Dash) :d2, after d1, 7d
    Add filters + insight cards               :d3, after d2, 7d
    Deliverables: visual end-to-end insights  :milestone, d3, 0d

    section Phase 5 – Hardening & Demo Readiness
    Implement auth (admin/viewer roles)       :e1, 2025-12-01, 7d
    Dockerize + deploy to cloud (Render/Railway) :e2, after e1, 7d
    Write documentation + record teaser demo  :e3, after e2, 7d
    Deliverables: public MVP demo live        :milestone, e3, 0d

# OPD Microservices Phased Implementation Checklist

## How To Use This Checklist
- Mark items as done only when acceptance criteria are met.
- Keep one migration lead and one technical owner per phase.
- Do not start a new extraction phase until observability and rollback checks are green.

## Phase 0: Alignment and Design (Week 1)

### 0.1 Scope and Ownership
- [ ] Confirm bounded contexts and service owners:
  - Identity
  - Master Data
  - Doctor
  - Patient
  - Appointment
  - OPD Visit
  - Billing
  - Notification
  - Reporting
- [ ] Freeze domain ownership table in an ADR.
- [ ] Define what remains in monolith temporarily.

Acceptance criteria:
- ADR approved by backend + frontend + product.
- No table is marked as owned by multiple target services.

### 0.2 Contract Baseline
- [ ] Define API naming/versioning convention (`/api/v1/...`).
- [ ] Define event envelope schema (`eventId`, `aggregateId`, `version`, `occurredAt`, `traceId`).
- [ ] Define error response contract and correlation ID header format.

Acceptance criteria:
- Shared contract doc published.
- Sample requests/responses and event payloads validated by consumers.

### 0.3 Environment Setup
- [ ] Add local docker-compose for gateway + broker + databases.
- [ ] Add service template (lint, test, health endpoint, config loader).
- [ ] Add secret management strategy for all environments.

Acceptance criteria:
- New service can be created from template and runs locally in less than 10 minutes.

---

## Phase 1: Platform Foundation (Weeks 1-2)

### 1.1 Gateway and Cross-Cutting
- [ ] Add API Gateway/BFF in front of current backend.
- [ ] Forward auth claims and correlation IDs.
- [ ] Add request logging and rate limiting.

Acceptance criteria:
- Frontend works only through gateway in non-local environments.
- Every request has traceable correlation ID in logs.

### 1.2 Observability
- [ ] Structured JSON logging across gateway and backend.
- [ ] Metrics dashboard (latency, 4xx/5xx, throughput).
- [ ] Distributed tracing setup (OpenTelemetry).

Acceptance criteria:
- One end-to-end request visible in logs + traces with same trace ID.

### 1.3 Event Infrastructure
- [ ] Provision broker topics/queues and DLQ.
- [ ] Add outbox table and publisher worker to monolith.
- [ ] Add consumer idempotency store pattern.

Acceptance criteria:
- Event retry and DLQ flow tested with forced failure.

---

## Phase 2: Notification Service Extraction (Weeks 3-5)

### 2.1 Service Build
- [ ] Create Notification service skeleton.
- [ ] Implement template management and delivery log.
- [ ] Implement SMS/email provider adapter and fallback policy.

### 2.2 Event Integration
- [ ] Publish appointment and invoice events from monolith outbox.
- [ ] Consume events in Notification service.
- [ ] Add retry with exponential backoff and max attempts.

### 2.3 Release and Cutover
- [ ] Route notification API through gateway.
- [ ] Enable feature flag for event-driven notifications.
- [ ] Monitor delivery success rate and DLQ.

Acceptance criteria:
- Notification success rate target met.
- No blocking user workflow due to notification failure.

---

## Phase 3: Billing Service Extraction (Weeks 6-8)

### 3.1 Domain and Data Migration
- [ ] Create Billing service with own database.
- [ ] Move invoice and invoice item business logic.
- [ ] Add migration scripts for billing historical data.

### 3.2 Critical Rule Preservation
- [ ] Enforce immutable receipt/invoice after creation.
- [ ] Remove/deny update endpoint semantics that break immutability.
- [ ] Add explicit audit log for create and payment events.

### 3.3 Integration and Reliability
- [ ] Consume OPDVisitCreated event for invoice initiation.
- [ ] Emit InvoiceCreated and InvoicePaymentCaptured.
- [ ] Add contract tests with gateway and Notification service.

Acceptance criteria:
- Existing receipt immutability behavior remains unchanged.
- Billing endpoints run from new service with stable SLAs.

---

## Phase 4: Appointment and OPD Visit Extraction (Weeks 9-12)

### 4.1 Appointment Service
- [ ] Extract create/reschedule/cancel flows.
- [ ] Implement slot conflict checks and status state machine.
- [ ] Emit AppointmentBooked/Rescheduled/Cancelled events.

### 4.2 OPD Visit Service
- [ ] Extract visit create/update and diagnosis association.
- [ ] Enforce admin-only update rule.
- [ ] Enforce future-visit-only update rule.

### 4.3 Workflow Coordination
- [ ] Define saga flow for appointment->notification.
- [ ] Define saga flow for opd visit->billing->notification.
- [ ] Add compensating actions policy where needed.

Acceptance criteria:
- Future-only OPD visit update rule unchanged post extraction.
- No double-booking under concurrent appointment creation.

---

## Phase 5: Patient, Doctor, Master Data, Reporting (Weeks 12+)

### 5.1 Patient and Doctor Services
- [ ] Move patient and doctor bounded logic with separate databases.
- [ ] Add API composition strategy for combined profile views.
- [ ] Validate referential dependencies through APIs, not DB links.

### 5.2 Master Data Service
- [ ] Move lookup entities and admin CRUD.
- [ ] Add caching strategy for low-change reference data.

### 5.3 Reporting Service
- [ ] Build projections from domain events.
- [ ] Add dashboard read APIs from reporting DB.
- [ ] Repoint heavy frontend dashboard queries to reporting service.

Acceptance criteria:
- Dashboard read latency improved.
- No runtime cross-service DB join dependency.

---

## Security Checklist (Apply in Every Phase)
- [ ] JWT signature and expiry validation at gateway.
- [ ] Authorization checks inside each service.
- [ ] Service-to-service auth mechanism defined and enforced.
- [ ] Audit logs for sensitive operations.
- [ ] PII masking in logs and traces.

## Testing Checklist (Apply in Every Phase)
- [ ] Unit tests for domain rules.
- [ ] Integration tests with DB and broker.
- [ ] Contract tests for APIs and events.
- [ ] E2E smoke tests for critical user journeys.
- [ ] Load tests for appointment and billing peak paths.

## Deployment and Rollback Checklist
- [ ] Blue/green or canary deployment for extracted services.
- [ ] Feature flag for each cutover path.
- [ ] Rollback runbook documented and tested.
- [ ] Data reconciliation script for each migration.
- [ ] Post-deploy verification dashboard prepared.

## Definition of Done Per Service Extraction
- [ ] API contract approved and versioned.
- [ ] Domain rules parity verified with monolith behavior.
- [ ] Observability signals present (logs, metrics, traces).
- [ ] Security checks passed.
- [ ] Performance baseline met.
- [ ] Rollback path tested.
- [ ] Product/UAT sign-off completed.

## Risk Register Starter
- [ ] Risk: hidden coupling through shared DB assumptions.
  - Mitigation: schema usage scan + API anti-corruption layer.
- [ ] Risk: duplicate event processing.
  - Mitigation: idempotency key store + consumer dedupe.
- [ ] Risk: inconsistent auth behavior across services.
  - Mitigation: shared authorization library and policy tests.
- [ ] Risk: migration downtime/data mismatch.
  - Mitigation: dual-write avoidance, reconciliation jobs, phased cutover.

## Suggested Execution Roles
- Migration Lead: overall plan, risk, sequencing.
- Service Owner(s): implementation and quality gates.
- Platform Owner: gateway, broker, observability.
- QA Owner: contract + E2E + regression plan.
- DevOps Owner: deployment, rollback, environment parity.

## Weekly Governance Cadence
- [ ] Architecture review: once/week.
- [ ] Service readiness review: once/week.
- [ ] Cutover decision review: before each phase release.
- [ ] Incident and risk review: after each production deployment.

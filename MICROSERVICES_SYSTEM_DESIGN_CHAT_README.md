# OPD Microservices System Design (Chat Summary)

## Purpose
This document summarizes the system design and microservice guidance discussed in this chat for the OPD Management System.

## Current Context (From Existing App)
- Current setup has two Next.js apps:
  - `opd_backend`: API + Prisma + JWT auth
  - `opd_frontend`: dashboard UI with role-based navigation
- Core domain entities include hospital, department, doctor, specialization, patient, appointment, opdvisit, diagnosis, treatmenttype, service, invoice, invoiceitem, paymentmode, role, user.
- Existing business constraints to preserve:
  - OPD visit update is admin-only and allowed only for future visits.
  - Receipt/invoice is immutable once created.

## Recommended Target Architecture
Adopt **domain-based microservices** (bounded contexts), not table-based splits.

### Proposed Services
1. Identity & Access Service
2. Master Data Service (hospital/department/specialization/treatment type/services/payment mode)
3. Doctor Service
4. Patient Service
5. Appointment Service
6. OPD Visit Service
7. Billing Service
8. Notification Service
9. Reporting Service (read models only)

## Service Data Ownership
- Identity: users, roles, sessions/tokens
- Master Data: hospital, department, specialization, treatmenttype, service catalog, paymentmode
- Doctor: doctor profile + mappings
- Patient: patient profile and identifiers
- Appointment: scheduling lifecycle
- OPD Visit: visit lifecycle + diagnosis association
- Billing: invoice, invoice items, receipt/payment records
- Notification: delivery logs/templates
- Reporting: denormalized projections only

Rule: **Database per service**. No cross-service DB joins/writes.

## System Design Concepts to Implement
1. API Gateway / BFF
- Single entry point for frontend.
- Handles auth validation, routing, rate limits, correlation ID.

2. Synchronous + Asynchronous Communication
- Sync (REST/gRPC): request-response business actions.
- Async (event bus): side effects and projections.

3. Event-Driven Consistency
- Outbox pattern per service for reliable event publishing.
- Idempotent consumers.
- Saga choreography/orchestration for multi-service workflows.

4. Reliability
- Timeout, retry with backoff, circuit breaker.
- DLQ for failed events.

5. Observability
- Structured logs + correlation IDs.
- Metrics (latency, errors, queue lag).
- Distributed tracing (OpenTelemetry).

6. Security
- JWT validation at gateway and in each service.
- RBAC enforcement in service layer.
- Audit logging for critical actions.

7. Versioning and Contracts
- Version APIs from day one (`/api/v1/...`).
- Schema versioning for events.
- Contract testing between services.

## Concrete API Blueprint (High-Level)

### Identity Service
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`
- `GET /roles`
- `POST /users`, `PATCH /users/:id`

### Patient Service
- `POST /patients`
- `GET /patients/:id`
- `GET /patients?search=`
- `PATCH /patients/:id`

### Appointment Service
- `POST /appointments`
- `PATCH /appointments/:id/reschedule`
- `PATCH /appointments/:id/cancel`
- `GET /appointments/:id`
- `GET /appointments?...`

### OPD Visit Service
- `POST /opd-visits`
- `GET /opd-visits/:id`
- `PATCH /opd-visits/:id`
- `POST /opd-visits/:id/diagnoses`
- `GET /opd-visits?...`

### Billing Service
- `POST /invoices`
- `GET /invoices/:id`
- `GET /invoices?...`
- `POST /invoices/:id/payments` (if separate payment capture flow)
- No general update endpoint for immutable receipt/invoice resources

### Notification Service
- `POST /notifications/send`
- `GET /notifications/:id/status`
- Template + logs endpoints

## Event Matrix (Starter Set)
- `PatientCreated` -> Notification, Reporting
- `AppointmentBooked` -> Notification, Reporting, OPD Visit
- `AppointmentRescheduled` -> Notification, Reporting
- `AppointmentCancelled` -> Notification, Reporting
- `OPDVisitCreated` -> Billing, Reporting
- `OPDVisitUpdated` -> Reporting
- `DiagnosisAddedToVisit` -> Reporting
- `InvoiceCreated` -> Notification, Reporting
- `InvoicePaymentCaptured` -> Notification, Reporting
- `NotificationFailed` -> Reporting/Ops

Event payload baseline:
- `eventId`
- `aggregateId`
- `aggregateType`
- `version`
- `occurredAt`
- `traceId`

## Workflow/Saga Examples
1. Appointment Booking
- Appointment created -> event published -> notification sent -> reporting updated.

2. Visit to Billing
- OPD visit created -> billing creates invoice -> invoice event -> receipt notification.

3. Cancellation Flow
- Appointment cancelled -> notification sent -> billing/reconciliation policy applied.

## Migration Strategy (Strangler Pattern)
Do not rewrite everything at once.

### Phase 1: Foundation
- Introduce API Gateway in front of current backend.
- Add tracing/correlation IDs.
- Introduce broker + outbox support in monolith.

### Phase 2: Extract Notification Service
- Lowest-risk first extraction.
- Trigger from existing monolith events.

### Phase 3: Extract Billing Service
- Move invoice/receipt flow.
- Preserve immutable receipt rule.

### Phase 4: Extract Appointment + OPD Visit Services
- Enforce future-visit update rule in OPD Visit service.

### Phase 5: Extract Patient/Doctor/Master Data + Reporting
- Shift dashboard reads to reporting projections.

## Suggested Timeline (12 Weeks)
- Weeks 1-2: boundaries, contracts, gateway, observability baseline.
- Weeks 3-5: notification extraction.
- Weeks 6-8: billing extraction + contracts.
- Weeks 9-12: appointment + OPD visit extraction, then reporting.

## Tech and Operational Recommendations
- Containerize each service.
- CI/CD per service.
- Health checks and readiness probes.
- Backward-compatible deployment and rollback strategy.
- Keep feature flags for migration cutovers.

## What to Avoid
- Shared DB across services.
- Distributed transactions (2PC) for routine flows.
- Premature over-splitting into too many tiny services.
- Skipping observability and contract tests.

## Immediate Next Steps for This Repo
1. Create an architecture decision record (ADR) for service boundaries.
2. Add API Gateway layer and correlation ID middleware.
3. Introduce event bus + outbox table in current backend.
4. Extract Notification service first.
5. Start Billing extraction next with immutable receipt preserved.

---
If needed, the next artifact can be an implementation pack:
- OpenAPI stubs for each service
- JSON schemas for domain events
- Migration checklist per phase
- Environment and deployment templates

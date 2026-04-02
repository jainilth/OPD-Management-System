# OPD Management System

This repository contains a hospital Outpatient Department (OPD) management platform built as two Next.js applications:

- `opd_backend` provides the API layer, Prisma data access, authentication, and database operations.
- `opd_frontend` provides the role-based dashboard, login page, navigation, search, and operational screens.

The system is designed to help a hospital manage the complete OPD flow in one place: master data setup, patient registration, doctor management, appointment booking, OPD visits, diagnosis tracking, service billing, and receipt generation.

## What The Project Does

The application covers the main day-to-day workflows of an OPD desk and hospital administration team:

- Maintain hospital details, departments, doctors, specializations, treatment types, services, payment modes, roles, and users.
- Register and manage patients.
- Book appointments and track OPD visits.
- Record diagnoses and billable services for a visit.
- Generate invoices and receipts for payments.
- Restrict access by role so each user sees only the screens they are allowed to use.

## High-Level Architecture

### Backend

`opd_backend` is a Next.js API project that uses Prisma with MariaDB/MySQL.

- Database models are defined in `opd_backend/prisma/schema.prisma`.
- Repositories and services sit between the route handlers and Prisma queries.
- Authentication is token-based. A successful login creates an `accessToken` cookie.
- Middlewares handle authentication and role checks.

### Frontend

`opd_frontend` is the user interface for the system.

- The login screen sends credentials to the backend API.
- The dashboard reads the active session and role from the token cookie.
- Sidebar and navbar items are filtered by role.
- Pages are organized by module: hospital, department, doctor, patient, appointment, OPD, receipt, diagnosis, treatment, and master data screens.

## Main Domain Model

The data model centers around these entities:

- Hospital
- Department
- Doctor
- Specialization
- Patient
- Appointment
- OPD Visit
- Diagnosis
- Treatment Type
- Service / Sub Treatment
- Invoice
- Invoice Item
- Payment Mode
- Role
- User

This gives the system the structure needed to connect a patient visit with the doctor, diagnoses, services, and final billing record.

## Workflow

### 1. Login

The user opens the frontend login page and submits a username and password.

- The frontend calls the backend login route.
- The backend checks the user record and role.
- If the credentials are valid, the backend generates a JWT and stores it in an `accessToken` cookie.

### 2. Session Loading

After login, the frontend reads the token cookie and decodes it to get:

- `userId`
- `username`
- `role`

This session data is used to decide what the user can see and do.

### 3. Role-Based Dashboard

The dashboard is not the same for every user.

- Admin users can access the full master-data and operational set.
- Doctors can see clinical workflows and patient-related screens.
- Receptionists can book appointments, register patients, and create OPD entries.
- Patients and general users get a narrower view focused on their own accessible pages.

The sidebar and dashboard cards are filtered using the active role, so the UI adapts to the signed-in user.

### 4. Master Data Setup

Before running the daily workflow, administrators can maintain the reference data used everywhere else:

- hospital information
- departments
- doctors
- specializations
- diagnosis types
- treatment types
- sub treatments / services
- payment modes
- roles and users

These screens keep the system consistent and allow later workflows to reuse the same catalog data.

### 5. Patient Care Flow

The typical clinical flow looks like this:

1. A patient is registered.
2. An appointment is booked.
3. The patient arrives for an OPD visit.
4. The doctor records diagnoses and relevant services.
5. Billing is created from the visit details.
6. A receipt is generated after payment.

The frontend dashboard highlights these actions with quick links, and the backend stores each step in related tables so the visit history stays connected.

### 6. Search and Navigation

The navbar includes global search across major records such as patients, doctors, visits, hospitals, diagnoses, treatment data, services, receipts, departments, users, roles, and payment modes.

This makes it easier for staff to jump directly to a record instead of navigating through every module manually.

### 7. Logout

When the user logs out, the access token cookie is cleared and the session is removed from the client state.

## Backend Request Flow

Most backend routes follow the same pattern:

1. A route handler receives a request.
2. The handler calls a service.
3. The service uses a repository or Prisma client query.
4. The result is returned as JSON.

Authentication-aware routes also use the token cookie or authorization helpers to protect the endpoint.

## Frontend Request Flow

The frontend uses a shared API wrapper for requests.

1. The UI calls a helper in `opd_frontend/lib/api.ts` or a page-specific service.
2. The helper attaches the token cookie when available.
3. The backend responds with JSON.
4. The UI renders lists, details, cards, and search results from the response.

## Setup Notes

Each app has its own `package.json`, so dependencies are installed separately inside `opd_backend` and `opd_frontend`.

The backend expects database and JWT settings in environment variables, including:

- `DATABASE_HOST`
- `DATABASE_USER`
- `DATABASE_PASSWORD`
- `DATABASE_NAME`
- `DATABASE_URL`
- `JWT_SECRET`

## Useful Scripts

Backend:

- `npm run dev` - start the backend in development mode
- `npm run build` - build for production
- `npm run start` - run the production build
- `npm run lint` - run ESLint

Frontend:

- `npm run dev` - start the frontend in development mode
- `npm run build` - build for production
- `npm run start` - run the production build
- `npm run lint` - run ESLint

## Summary

This project is an OPD management system for hospital administration and outpatient operations. It combines a Prisma-backed API, role-based authentication, and a dashboard UI to manage the full flow from master data setup to patient visits and invoicing.
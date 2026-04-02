# SMS Notification Integration Guide

This guide explains how to send an SMS whenever a new User, Doctor, or Patient is added in the backend.

It is tailored for this project structure:

- `opd_backend/app/services/user.service.ts`
- `opd_backend/app/services/doctor.service.ts`
- `opd_backend/app/services/patient.service.ts`

## Goal

After successful creation of:

- User
- Doctor
- Patient

send an SMS to the corresponding mobile number.

## Recommended Behavior

- Database create should succeed even if SMS fails.
- SMS failures should be logged for monitoring.
- Never send passwords or sensitive data in SMS.

## Step 1: Install SMS Provider SDK

Use Twilio as an example provider.

Run from `opd_backend`:

```bash
npm install twilio
```

## Step 2: Add Environment Variables

In backend env file (for example `.env` inside `opd_backend`), add:

```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX
SMS_DEFAULT_COUNTRY_CODE=+91
```

Notes:

- Use full international format (`+` and country code).
- Keep secrets out of source control.

## Step 3: Create a Shared SMS Service

Create file:

- `opd_backend/app/services/sms.service.ts`

Suggested implementation:

```ts
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;
const defaultCountryCode = process.env.SMS_DEFAULT_COUNTRY_CODE || "+91";

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

function normalizeMobile(mobile: string): string {
  const raw = String(mobile || "").trim();
  if (!raw) return raw;
  if (raw.startsWith("+")) return raw;
  return `${defaultCountryCode}${raw}`;
}

export async function sendWelcomeSms(params: {
  mobile: string;
  entityType: "User" | "Doctor" | "Patient";
  name?: string;
}) {
  if (!client || !fromNumber) {
    throw new Error("SMS provider is not configured");
  }

  const to = normalizeMobile(params.mobile);
  const displayName = params.name ? ` ${params.name}` : "";
  const body = `Welcome${displayName}! Your ${params.entityType} account/profile has been created in OPD system.`;

  await client.messages.create({
    from: fromNumber,
    to,
    body,
  });
}
```

## Step 4: Trigger SMS in User Creation

File:

- `opd_backend/app/services/user.service.ts`

Current create path:

- `createUser: (data) => userRepo.create(data)`

Update to async flow:

1. Create user in DB.
2. Attempt SMS send in `try/catch`.
3. Return created user regardless of SMS status.

Example:

```ts
import { sendWelcomeSms } from "./sms.service";

createUser: async (data: any) => {
  const user = await userRepo.create(data);

  try {
    await sendWelcomeSms({
      mobile: user.Mobile,
      entityType: "User",
      name: user.Username,
    });
  } catch (smsError) {
    console.error("[SMS][User] Failed to send", {
      mobile: user.Mobile,
      error: smsError,
    });
  }

  return user;
},
```

## Step 5: Trigger SMS in Doctor Creation

File:

- `opd_backend/app/services/doctor.service.ts`

Important: this flow uses `prisma.$transaction`.

Best pattern:

1. Run transaction and store result in `result`.
2. After transaction success, send SMS.
3. Return `result`.

Example pattern:

```ts
const result = await prisma.$transaction(async (tx) => {
  // existing create logic
  return {
    message: `Doctor created successfully. User ${userAction}.`,
    doctor,
    user: {
      UserID: user.UserID,
      action: userAction,
      role: "Doctor",
      roleUpdated,
    },
  };
});

try {
  await sendWelcomeSms({
    mobile: result.doctor.Mobile,
    entityType: "Doctor",
    name: result.doctor.DoctorName,
  });
} catch (smsError) {
  console.error("[SMS][Doctor] Failed to send", {
    mobile: result.doctor.Mobile,
    error: smsError,
  });
}

return result;
```

## Step 6: Trigger SMS in Patient Creation

File:

- `opd_backend/app/services/patient.service.ts`

Use the same transaction-then-SMS pattern:

1. Complete DB transaction.
2. Send SMS in `try/catch`.
3. Return successful DB result.

Example:

```ts
const result = await prisma.$transaction(async (tx) => {
  // existing create logic
  return {
    message: `Patient created successfully. User ${userAction}.`,
    patient,
    user: {
      UserID: user.UserID,
      action: userAction,
      role: "Patient",
      roleUpdated,
    },
  };
});

try {
  await sendWelcomeSms({
    mobile: result.patient.Mobile,
    entityType: "Patient",
    name: result.patient.PatientName,
  });
} catch (smsError) {
  console.error("[SMS][Patient] Failed to send", {
    mobile: result.patient.Mobile,
    error: smsError,
  });
}

return result;
```

## Step 7: Keep API Routes Unchanged

No route changes are required if services handle SMS:

- `opd_backend/app/api/user/route.ts`
- `opd_backend/app/api/doctor/route.ts`
- `opd_backend/app/api/patient/route.ts`

## Step 8: Test Checklist

Run backend:

```bash
npm run dev
```

Test these endpoints with valid payloads:

- `POST /api/user`
- `POST /api/doctor`
- `POST /api/patient`

Verify:

- Record is created in database.
- SMS is received on provided number.
- If SMS provider is down, API still returns success and logs error.

## Step 9: Production Hardening (Recommended)

For better reliability at scale:

- Push SMS job to a queue (BullMQ, SQS, RabbitMQ).
- Retry failed sends.
- Store SMS audit logs (status, provider response, timestamp).
- Add rate-limiting/duplicate prevention for retries.

## Security Notes

- Do not include password, token, or personal medical details in SMS.
- Validate and normalize mobile numbers before send.
- Use provider credentials only from environment variables.

## Quick Summary

Implement SMS in service layer, not route layer.

- Create once in DB.
- Send SMS after successful create.
- Keep creation success independent of SMS failure.

This gives a safe and maintainable integration for User, Doctor, and Patient onboarding notifications.
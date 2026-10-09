# Event flyer extraction: backend checkpoint

Stages 2 and 3 add an authenticated backend endpoint. Frontend autofill is intentionally
not connected at this checkpoint. Extraction never saves an event or changes the database.

## Endpoint

POST /api/ai/extract-event

- Authentication: the existing auth_tx session cookie, obtained through normal login.
- Body: multipart/form-data with exactly one file named image and no other fields.
- Images: JPEG, PNG, WebP; maximum 5 MiB (5 * 1024 * 1024 bytes), stored only in memory.
- Model: gemini-3.5-flash-lite, using the official @google/genai SDK on the backend.
- Key: process.env.GEMINI_API_KEY only. Never place it in EXPO_PUBLIC_* settings.
- One valid extraction makes one inline-image Gemini request, with SDK retries disabled.
- The same Gemini response includes eventStatus (likely_event, uncertain, or not_event)
  and a concise eventStatusReason. Classification considers event/activity and attendance
  indicators, not just an organization name, promotion, or date. There is no numeric confidence.
- Missing, unreadable, or ambiguous information stays empty. A date without a stated
  year stays empty rather than inferring the current year. Time is the stated start time.

Example success response (illustrative):

```json
{
  "status": "success",
  "data": {
    "eventStatus": "likely_event",
    "eventStatusReason": "A named workshop with a date, start time, and location.",
    "title": "Campus workshop",
    "description": "",
    "date": "2026-10-20",
    "time": "2:30 PM",
    "location": "Room 101"
  }
}
```

Errors use the existing JSend error middleware: 400 for missing/malformed uploads,
401 for missing/invalid login, 413 for oversized images, 415 for unsupported or
mismatched image types, 429 for Gemini quota, 503 for a missing backend key, and
502 for provider failures or invalid extracted data. Invalid requests never call Gemini.

## Rebuild after installing dependencies

From the repository root, the usual development command is:

```powershell
docker compose -f composeCore.yml -f composeDev.yml up --build
```

To rebuild just the backend without rebuilding unrelated services:

```powershell
docker compose -f composeCore.yml -f composeDev.yml up -d --build --no-deps backend
```

GEMINI_API_KEY must already be set in the ignored server/.env.development file.
Recreate the backend after changing that file; restarting alone does not reload Compose environment values.

## Test without Gemini quota or databases

```powershell
cd server
npx vitest run --config vitest.ai.config.mjs
```

The service tests fake model responses. The upload tests use real Express, Multer,
session-cookie authentication, and error middleware with a fake user service and
extraction service. They also verify that the real SDK does not retry HTTP 503,
using a mocked HTTP response. They do not validate live OCR quality or account access.

## Check the live server without consuming quota

```powershell
curl.exe -i http://localhost:3000/api/health
curl.exe -i -X POST http://localhost:3000/api/ai/extract-event
```

Expected: health is 200; extraction without a login cookie is 401.
Use the same API origin as your existing login if your setup uses api.localhost instead.

## Test a real flyer with your existing login

1. Log in normally through the current frontend.
2. Open browser Developer Tools and its Console on that frontend page.
3. Run the code below, using the same backend API origin as your existing login.
4. Select a JPEG, PNG, or WebP flyer under 5 MiB. This makes one paid/quota-consuming
   Gemini request for the selected image; the result is logged and does not save an event.

```javascript
const flyerInput = document.createElement('input');
flyerInput.type = 'file';
flyerInput.accept = 'image/jpeg,image/png,image/webp';
flyerInput.onchange = async () => {
  const file = flyerInput.files[0];
  if (!file) return;
  const body = new FormData();
  body.append('image', file);
  try {
    const response = await fetch('http://localhost:3000/api/ai/extract-event', {
      method: 'POST',
      credentials: 'include',
      body,
    });
    console.log('HTTP', response.status, await response.json());
  } catch (error) {
    console.error('Flyer upload failed', error);
  }
};
flyerInput.click();
```

Do not set Content-Type manually: the browser must supply the multipart boundary.
If you get 401, use the API origin where the auth_tx cookie was issued and log in there.
A Gemini 429 means wait/check your Google API quota; there is no automatic retry.

## Next frontend stages and current limits

After reviewing this backend checkpoint, add the frontend multipart service and
Autofill from Flyer button, preserving nonempty manually entered fields when AI
returns an empty result. Keep Create Event a separate manual action.
The web time dropdown currently only lists half-hour times; it needs to display
other extracted times without rounding or losing them.

AI can still misread an image despite the extraction instructions and output validation.
Users must review every result. Image signature checks are not a full image decoder;
corrupt files with valid headers can fail at Gemini. Authentication blocks anonymous
quota use, but per-user rate limiting is not part of this checkpoint.

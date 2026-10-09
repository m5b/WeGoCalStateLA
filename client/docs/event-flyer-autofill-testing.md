# Stage 4/5 manual test checkpoint

The Stage 4/5 implementation is split into logical commits. Stage 6 final validation
and pushing remain pending. Manual browser testing was reported successful after
the image preview, web paste, and time-placeholder refinements.
Local infrastructure changes are unrelated and must stay out of the AI feature commits.

## Run the current code

Use the Expo development page at http://localhost:8081/home_screen/create_event after
logging in through the normal app flow. If Expo is not running, from client run npm run dev
and select web. The existing EXPO_PUBLIC_API_URL points to http://localhost:3000.
Select an image with Gallery/Camera, or paste a copied JPEG, PNG, or WebP image
with Ctrl+V on web. Pasting only selects the image; click Autofill from Flyer to
request extraction. Do not paste the temporary backend browser-console file-input
harness into the application.

Backend source is mounted into the development container, so nodemon reloads the
classification changes. Start the local stack if needed:

```powershell
docker compose -f composeCore.yml -f composeDev.yml up -d
```

Only the native date/time picker is new: @react-native-community/datetimepicker 8.4.1,
installed with expo install for SDK 53. There are no new backend dependencies in this checkpoint.
Mobile development builds may need rebuilding to include the added native module;
web uses browser controls and does not import the native picker.

## Browser checks

1. **Manual creation, no AI:** Autofill is disabled without an image. Enter title,
   description, date, time, and location manually, then click Create Event. Existing
   mock event/thread creation should behave as before; no AI request occurs.
2. **Gallery flyer:** Select a supported JPEG, PNG, or WebP with the existing Gallery
   button. The preview should appear and Autofill should enable. No request occurs
   until Autofill is clicked.
3. **Camera:** If your browser/device supports the existing Camera flow, select a
   camera image and repeat autofill. Otherwise verify this on Android/iOS; actual
   camera permissions and hardware were not exercised by automated checks.
4. **Clear event flyer:** Use a legible flyer with a full year/date, start time, and
   location. Click Autofill once. Expect Reading flyer..., then populated fields and
   a review reminder. It must not create an event. In Network, expect exactly one
   POST /api/ai/extract-event with multipart content and the login cookie.
5. **Missing information:** Type your own description or location, then use a flyer
   without that field. The existing manual value must survive the empty AI result.
   A flyer without an explicitly stated year should return an empty date; do not infer it.
6. **Uncertain image:** Use an incomplete/ambiguous flyer. If eventStatus is uncertain,
   supported fields apply and a warning includes the concise reason and asks you to verify
   all information. Classification is model-dependent, not a numeric confidence score.
7. **Clearly non-event image:** Try a logo, landscape photo, or unrelated document.
   If eventStatus is not_event, a confirmation appears and no fields change before you
   choose. Review Anyway applies supported fields and keeps the warning. Choose Another
   Image reopens the existing Gallery picker and leaves the previous form fields intact.
8. **Manual edits after AI:** Change populated title, description, location, date, and
   time. The form must reflect your edits. Only the separate Create Event action submits.
9. **AI date:** Verify an extracted date such as 2026-10-24 is selected in the browser
   calendar. Click the date field, pick another day, and confirm the new selection sticks.
   Storage remains YYYY-MM-DD even if the browser displays a localized date.
10. **Any minute:** Verify 2:15 PM displays as hour 2, minute 15, PM. Manually choose
    1:05 PM and 12:45 AM as well. No value should be rounded to a half hour.
    With an empty time, Hour is a disabled placeholder; only 1 through 12 are selectable.
11. **Second flyer and duplicate clicks:** Choose another flyer after extraction and
    run again. The second image should be used. Rapid repeated clicks during a request
    must produce only one POST. While reading, Gallery, Camera, the fields, and Create
    Event are disabled to prevent changing the image or submitting mid-extraction.
12. **Invalid images:** Try a GIF/unsupported image or a supported image above 5 MiB.
    Expect a visible error and no extraction request when the client can identify the
    invalid file. The server remains authoritative for size, MIME, and signature checks.
13. **API failures:** While leaving the frontend open, stop just the backend:
    docker compose -f composeCore.yml -f composeDev.yml stop backend
    Try Autofill and expect a visible connection error with no lost field values.
    Restart it with docker compose -f composeCore.yml -f composeDev.yml up -d backend.
    Also check an expired login gives sign-in feedback. For 429/502, expect a visible
    error and no automatic retry. You can enter details manually after a failed request.

## UI refinement manual checks (before Stage 6)

- Select portrait, landscape, very tall, and very wide images. The entire selected
  image should be centered, preserve its aspect ratio, and fit a 240-pixel-high
  neutral frame. No cropping, stretching, or page growth should occur.
- Copy PNG, JPEG, and WebP images from a browser or messaging app, then Ctrl+V on
  Create Event. Also use Windows Snipping Tool to copy a screenshot and paste it.
  The preview should update without an AI request. Click Autofill once and verify
  one POST in Network and normal extracted fields. Original file bytes are uploaded.
- Paste ordinary text into Title and Description. Text should insert normally and
  the image should stay selected. Non-image clipboard data must leave it unchanged.
- Paste an unsupported image type (such as GIF). A useful error should appear and
  the existing image should remain. JPEG, PNG, and WebP have the existing 5 MiB limit.
- Replace a Gallery image by pasting an image, then replace the pasted image using
  Gallery. In each case Autofill should use the currently selected image.
- Check the disabled Hour placeholder, manual 1:05 PM and 12:45 AM, and AI-populated
  2:15 PM (displayed as 2 | 15 | PM). Minute options retain all values 00 through 59.

## Checks already performed

- 36 focused backend tests passed (fake model responses, no Gemini quota).
- 38 focused React component/service checks passed in an isolated temporary harness:
  manual creation, Gallery/Camera paths, authenticated multipart upload, one-request
  guard, missing-field preservation, classification warnings/confirmation, date and
  arbitrary minute display, second flyer, image validation, and API/network failures.
  Added coverage verifies bounded contain preview properties for four image shapes,
  PNG/JPEG/WebP clipboard item fixtures, unchanged upload bytes, no automatic
  extraction, text-paste default behavior, invalid clipboard data, image replacement,
  listener cleanup, canceled pending reads, and the disabled Hour placeholder.
- Android/iOS picker interactions and Camera were simulated; no real device UI was inspected.
- No live Gemini call was made in these checks. Your Stage 3 live extraction test passed
  before the classification contract was added; verify the new classification with real images.
- Browser automation was unavailable. The user reported successful manual browser
  testing after the UI refinements. Full lint/build/final validation are deferred to Stage 6.

Stage 6 final validation and pushing remain deferred at the user's request.

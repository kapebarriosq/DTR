# KAPE' BAR-RIO DTR

A simple tablet/iPad-friendly Daily Time Record web app for GitHub Pages.

## Employee included

- Name: James Arthur Buna
- Employee ID: KBR0003
- Password: 02192006

## Features

- Employee login
- Barista profile
- Live date and time
- Clock In
- Clock Out
- Automatic work-duration calculation
- DTR history
- Logout
- Mobile/tablet responsive design
- Works as a static GitHub Pages website

## GitHub Pages installation

1. Create a GitHub repository.
2. Upload `index.html`, `style.css`, and `app.js`.
3. Go to the repository's Settings.
4. Open Pages.
5. Select the branch containing these files and `/ (root)`.
6. Save.
7. Open the generated GitHub Pages URL on the tablet/iPad.

## Important data note

This first version stores DTR records in the browser's localStorage. Records stay on the device/browser where they were made.

If you later want:
- multiple baristas,
- multiple tablets,
- centralized attendance records,
- owner/admin login,
- payroll reports,
- CSV/Excel export,

the app should be connected to a cloud database such as Firebase or Supabase.

## Security note

Because this version is a static GitHub Pages application, the employee credentials are stored in the JavaScript sent to the browser. This is suitable for a basic internal prototype, but it is NOT secure authentication for sensitive payroll/HR data. A production version should use a backend authentication/database service.

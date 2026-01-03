Place two PNG icon files here for the PWA manifest:

- logo-192.png  (192x192 pixels)
- logo-512.png  (512x512 pixels)

These files must be committed to the project root under the `icons` folder so the manifest and service worker can cache and serve them correctly.

If you want to keep `logo.png` as favicon, leave it at project root; the manifest will use the icons above for installable app icons.

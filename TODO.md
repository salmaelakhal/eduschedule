# TODO

- [x] Analyze codebase and identify root cause (CORS blocked by ngrok warning page)
- [x] Plan approved by user
- [x] Edit client/src/api/index.js: add request interceptor for ngrok-skip-browser-warning
- [x] Create client/.env.example with VITE_API_URL
- [x] Edit README.md: add Vercel + ngrok deployment instructions
- [x] Edit server/src/controllers/auth.controller.js: dynamic cookie options (SameSite=None for HTTPS cross-site)
- [x] Edit server/src/index.js: add trust proxy for ngrok HTTPS detection


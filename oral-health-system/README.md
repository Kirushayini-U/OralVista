# AI-Based Smart Oral Health System

A clickable full-stack prototype built from your wireframes: 12 patient-facing screens
and 8 admin screens, wired together with React Router so every button/link actually
navigates. The frontend runs standalone on mock data — the backend is a real
Express + MongoDB API ready for you to connect it to.

## Tech stack
- **Frontend:** React 18 (Vite), Tailwind CSS v3, React Router DOM, Axios, lucide-react icons
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, bcrypt, Multer
- **Database:** MongoDB (local or MongoDB Atlas)

## Folder structure
```
oral-health-system/
├── frontend/            # React app (Vite)
│   └── src/
│       ├── pages/patient/   # 12 patient/homeowner screens
│       ├── pages/admin/     # 8 admin screens
│       ├── components/      # Layouts, nav config, shared UI (StatCard, charts...)
│       ├── data/mockData.js # Mock data powering the clickable prototype
│       └── api/axios.js     # Pre-configured axios instance
└── backend/              # Express + MongoDB API
    ├── models/            # User, Clinic, Newsletter, Prediction
    ├── controllers/
    ├── routes/
    ├── middleware/         # JWT auth, error handling
    └── server.js
```

## Running it in VS Code

### 1. Frontend (works immediately, no backend required)
```bash
cd frontend
npm install
npm run dev
```
Open the printed local URL (usually http://localhost:5173). Every screen from the
wireframes is routed and clickable, using realistic mock data so you can demo the
full flow right away.

### 2. Backend (optional, needed once you want real data)
```bash
cd backend
npm install
cp .env.example .env      # then edit MONGO_URI / JWT_SECRET if needed
npm run dev
```
Requires MongoDB running locally (`mongod`) or a MongoDB Atlas connection string in
`.env`. The API starts on http://localhost:5000/api.

Once both are running, set `frontend/.env` (`cp .env.example .env`) so
`VITE_API_URL=http://localhost:5000/api`, and the register/login pages will call the
real API instead of just navigating on mock data.

## Routes (frontend)

**Patient / Homeowner flow**
| Path | Screen |
|---|---|
| `/` | Landing Page |
| `/register` | Register |
| `/login` | Login |
| `/dashboard` | Dashboard (after login) |
| `/symptom-prediction` | Symptom Prediction |
| `/prediction-result` | Prediction Result |
| `/image-prediction` | Image Prediction |
| `/chat-assistant` | AI Chat Assistant |
| `/ai-tutor` | AI Oral Health Tutor (Quiz) |
| `/clinic-finder` | Clinic Finder |
| `/newsletter` | Newsletter |
| `/profile`, `/settings` | Profile & Settings |

**Admin flow**
| Path | Screen |
|---|---|
| `/admin/login` | Admin Login |
| `/admin/dashboard` | Admin Dashboard |
| `/admin/users` | User Management |
| `/admin/clinics` | Clinic Management |
| `/admin/newsletters` | Newsletter Management |
| `/admin/analytics` | Analytics Dashboard |
| `/admin/settings` | Settings |
| `/admin/profile` | Admin Profile |

## What "clickable UI" means here
Every nav link, button, and form in the app is functional inside the React app itself:
sidebar navigation switches real routes, forms hold state, the symptom quiz submits to
a result page, file upload shows a live image preview, etc. Nothing is a static image —
this is what your lecturer means by "create UI" as opposed to a wireframe.

## Next steps to make it production-ready
1. Connect `predictionRoutes` to your trained Random Forest model (serve it via a small
   Flask API and call it from `predictionController.js`, or port the model to a JS
   inference step).
2. Replace the static map placeholder in Clinic Finder with Google Maps or Leaflet.
3. Add real authentication guards (`protect` middleware is ready — hook up a
   `<PrivateRoute>` wrapper in `App.jsx` once login issues real JWTs).
4. Fix the known dataset issue (low correlation between features and cost in
   `01_house_design_records.csv`-style data) before training the cost/diagnosis model.

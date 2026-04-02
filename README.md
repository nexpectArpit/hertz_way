# Hertzway Rentals

Car rental platform - agencies list vehicles, customers book them.

Stack: React + Vite, Node/Express, MySQL

---

## Setup

Requirements: Node.js, MySQL

```bash
# install deps
npm install

# setup db
mysql -u root -p < database.sql

# configure env
cp server/.env.example server/.env
# edit server/.env with your db credentials

# run backend
cd server && node server.js

# run frontend (separate terminal)
cd client && npm run dev
```

Backend runs on `http://localhost:4000`  
Frontend runs on `http://localhost:5173`

---

## Structure

```
car-rental/
├── client/          # React frontend
│   ├── src/
│   │   ├── api.js
│   │   ├── pages/
│   │   ├── components/
│   │   └── context/
│   └── public/img/
├── server/          # Express backend
│   ├── routes/
│   │   ├── auth.js
│   │   ├── cars.js
│   │   └── bookings.js
│   ├── server.js
│   └── db.js
└── database.sql
```

---

## Features

**Agencies:**
- Add/edit cars (model, plate, seats, daily rate)
- View all bookings

**Customers:**
- Browse available cars
- Book by date + duration
- Cars become unavailable after booking

**Auth:**
- Separate registration for customers/agencies
- Session-based auth with express-session

---

## Env vars

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_PORT=3306
DB_NAME=car_rental
SESSION_SECRET=random_secret_here
PORT=4000
CLIENT_URL=http://localhost:5173
SESSION_COOKIE_SECURE=false
SESSION_COOKIE_SAMESITE=lax
```

---

## Notes

- Import `database.sql` to create tables (no seed data)
- Sessions expire after 24h
- Vite proxy handles `/api` requests to backend

---
## Production Deploy (Render + TiDB)

### 1) Prepare TiDB (MySQL protocol)
- Create database/user and run `database.sql` into it (tables: `customers`, `agencies`, `cars`, `bookings`).
- Ensure you have TiDB MySQL connection details: `host`, `port`, `username`, `password`, and database name (default: `car_rental`).

### 2) Render Backend (Node/Express)
Deploy `car-rental/server` as a Render Web Service.

Environment variables to set:
```env
DB_HOST=<tidb_host>
DB_PORT=<tidb_mysql_port>
DB_USER=<tidb_username>
DB_PASSWORD=<tidb_password>
DB_NAME=car_rental
SESSION_SECRET=<random_string>
CLIENT_URL=<your_render_frontend_url>   # e.g. https://your-frontend.onrender.com
SESSION_COOKIE_SECURE=true              # required when SESSION_COOKIE_SAMESITE=none
SESSION_COOKIE_SAMESITE=none
```

### 3) Render Frontend (Vite/React)
Deploy the `car-rental/client` build to Render.

You must set `VITE_API_BASE_URL` at build time so the frontend knows where the API is:
```env
VITE_API_BASE_URL=<your_render_backend_url>   # e.g. https://your-backend.onrender.com
```
The frontend will call: `${VITE_API_BASE_URL}/api/...`

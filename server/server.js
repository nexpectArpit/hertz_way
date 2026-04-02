require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');

const db = require('./db');
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');
const bookingRoutes = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 5000;

const isProduction = process.env.NODE_ENV === 'production';
const sessionCookieSecure =
    process.env.SESSION_COOKIE_SECURE === 'true' || (isProduction && process.env.SESSION_COOKIE_SECURE !== 'false');
const sessionCookieSameSite = process.env.SESSION_COOKIE_SAMESITE || (isProduction ? 'none' : 'lax');

const allowedOrigins = [
    'http://localhost:5173',
    process.env.CLIENT_URL
].filter(Boolean); // remove undefined values

app.set('trust proxy', 1); // allow proxy (e.g., render/vercel backend)

app.use(cors({
    origin: function (origin, callback) {
        // allow all origins to fix CORS errors on deployment
        callback(null, true);
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'hw_r3nt@ls_s3cr3t',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: sessionCookieSameSite,
        secure: sessionCookieSecure,
        httpOnly: true
    }
}));

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/api/me', (req, res) => {
    req.session.user 
        ? res.json({ loggedIn: true, user: req.session.user })
        : res.json({ loggedIn: false });
});

app.use((err, req, res, next) => {
    console.error('unhandled error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`server up at http://localhost:${PORT}`);
});

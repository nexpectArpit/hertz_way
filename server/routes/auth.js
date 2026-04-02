const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validPhone = (ph) => !ph || /^\d{7,15}$/.test(ph);

router.post('/register/customer', async (req, res) => {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password)
        return res.status(400).json({ error: 'Fill all required fields' });

    if (name.trim().length < 2) return res.status(400).json({ error: 'Name too short' });
    if (!emailRx.test(email)) return res.status(400).json({ error: 'Invalid email' });
    if (!validPhone(phone)) return res.status(400).json({ error: 'Phone must be 7-15 digits' });
    if (password.length < 6) return res.status(400).json({ error: 'Password min 6 chars' });

    try {
        const hash = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO customers (name, email, phone, password) VALUES (?, ?, ?, ?)',
            [name.trim(), email.toLowerCase(), phone || null, hash]
        );
        res.json({ success: true });
    } catch (e) {
        if (e.code === 'ER_DUP_ENTRY')
            return res.status(400).json({ error: 'Email already in use' });
        console.log('register/customer failed:', e.message);
        res.status(500).json({ error: 'Something went wrong: ' + e.message });
    }
});

router.post('/register/agency', async (req, res) => {
    const { agency_name, email, phone, address, password } = req.body;

    if (!agency_name || !email || !password)
        return res.status(400).json({ error: 'Fill all required fields' });

    if (agency_name.trim().length < 2) return res.status(400).json({ error: 'Agency name too short' });
    if (!emailRx.test(email)) return res.status(400).json({ error: 'Invalid email' });
    if (!validPhone(phone)) return res.status(400).json({ error: 'Phone must be 7-15 digits' });
    if (password.length < 6) return res.status(400).json({ error: 'Password min 6 chars' });

    try {
        const hash = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO agencies (agency_name, email, phone, address, password) VALUES (?, ?, ?, ?, ?)',
            [agency_name.trim(), email.toLowerCase(), phone || null, address || null, hash]
        );
        res.json({ success: true });
    } catch (e) {
        if (e.code === 'ER_DUP_ENTRY')
            return res.status(400).json({ error: 'Email already in use' });
        console.log('register/agency failed:', e.message);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role)
        return res.status(400).json({ error: 'Missing fields' });

    try {
        const tbl = role === 'customer' ? 'customers' : 'agencies';
        const [rows] = await db.query(`SELECT * FROM ${tbl} WHERE email = ?`, [email.toLowerCase()]);

        if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });

        const u = rows[0];
        const ok = await bcrypt.compare(password, u.password);

        if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

        req.session.user = {
            id: u.id,
            name: role === 'customer' ? u.name : u.agency_name,
            email: u.email,
            role
        };

        res.json({ success: true, role, user: req.session.user });
    } catch (e) {
        console.log('login error:', e.message);
        res.status(500).json({ error: 'Login failed' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

module.exports = router;

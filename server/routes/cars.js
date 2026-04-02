const express = require('express');
const router = express.Router();
const db = require('../db');

const requireAgency = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'agency')
        return res.status(403).json({ error: 'Access denied' });
    next();
}

const checkFields = (body) => {
    const { vehicle_model, vehicle_number, seating_capacity, rent_per_day } = body;
    if (!vehicle_model || !vehicle_number || !seating_capacity || !rent_per_day)
        return 'Missing fields';

    const seats = parseInt(seating_capacity);
    const rent = parseFloat(rent_per_day);

    if (isNaN(seats) || seats < 1 || seats > 20) return 'Seats must be 1-20';
    if (isNaN(rent) || rent <= 0) return 'Rent must be positive';
    if (vehicle_model.trim().length < 2) return 'Model name too short';
    if (vehicle_number.trim().length < 4) return 'Invalid vehicle number';

    return null;
}

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT c.*, a.agency_name FROM cars c
             JOIN agencies a ON c.agency_id = a.id
             WHERE c.is_available = 1`
        );
        res.json(rows);
    } catch (e) {
        console.log('GET /cars error:', e.message);
        res.status(500).json({ error: 'Could not fetch cars' });
    }
});

router.post('/add', requireAgency, async (req, res) => {
    const err = checkFields(req.body);
    if (err) return res.status(400).json({ error: err });

    const { vehicle_model, vehicle_number, seating_capacity, rent_per_day } = req.body;
    const seats = parseInt(seating_capacity);
    const rent = parseFloat(rent_per_day);

    try {
        await db.query(
            'INSERT INTO cars (agency_id, vehicle_model, vehicle_number, seating_capacity, rent_per_day) VALUES (?, ?, ?, ?, ?)',
            [req.session.user.id, vehicle_model.trim(), vehicle_number.trim().toUpperCase(), seats, rent]
        );
        res.json({ success: true });
    } catch (e) {
        if (e.code === 'ER_DUP_ENTRY')
            return res.status(400).json({ error: 'Vehicle number already exists' });
        console.log('add car error:', e.message);
        res.status(500).json({ error: 'Failed to add car' });
    }
});

router.get('/my-cars', requireAgency, async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM cars WHERE agency_id = ? ORDER BY created_at DESC',
            [req.session.user.id]
        );
        res.json(rows);
    } catch (e) {
        console.log('my-cars error:', e.message);
        res.status(500).json({ error: 'Failed to fetch cars' });
    }
});

router.put('/edit/:id', requireAgency, async (req, res) => {
    const err = checkFields(req.body);
    if (err) return res.status(400).json({ error: err });

    const { vehicle_model, vehicle_number, seating_capacity, rent_per_day } = req.body;
    const seats = parseInt(seating_capacity);
    const rent = parseFloat(rent_per_day);
    const cid = req.params.id;

    try {
        const [owned] = await db.query(
            'SELECT id FROM cars WHERE id = ? AND agency_id = ?',
            [cid, req.session.user.id]
        );
        if (!owned.length) return res.status(403).json({ error: 'Not your car' });

        await db.query(
            'UPDATE cars SET vehicle_model=?, vehicle_number=?, seating_capacity=?, rent_per_day=? WHERE id=?',
            [vehicle_model.trim(), vehicle_number.trim().toUpperCase(), seats, rent, cid]
        );
        res.json({ success: true });
    } catch (e) {
        console.log('edit car error:', e.message);
        res.status(500).json({ error: 'Update failed' });
    }
});

module.exports = router;

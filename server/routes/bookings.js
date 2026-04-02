const express = require('express');
const router = express.Router();
const db = require('../db');

const validDate = (str) => !isNaN(new Date(str).getTime());

router.post('/book', async (req, res) => {
    if (!req.session.user)
        return res.status(401).json({ error: 'Please login first' });

    if (req.session.user.role !== 'customer')
        return res.status(403).json({ error: 'Only customers can book' });

    const { car_id, start_date, num_days } = req.body;

    if (!car_id || !start_date || !num_days)
        return res.status(400).json({ error: 'Missing booking details' });

    const days = parseInt(num_days);
    if (isNaN(days) || days < 1 || days > 365)
        return res.status(400).json({ error: 'Days must be 1-365' });

    if (!validDate(start_date))
        return res.status(400).json({ error: 'Invalid date' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(start_date) < today)
        return res.status(400).json({ error: 'Cannot book past dates' });

    try {
        const [found] = await db.query(
            'SELECT * FROM cars WHERE id = ? AND is_available = 1',
            [car_id]
        );
        if (!found.length)
            return res.status(400).json({ error: 'Car not available' });

        const car = found[0];
        const total = parseFloat(car.rent_per_day) * days;

        await db.query(
            'INSERT INTO bookings (car_id, customer_id, start_date, num_days, total_cost) VALUES (?, ?, ?, ?, ?)',
            [car_id, req.session.user.id, start_date, days, total]
        );

        await db.query('UPDATE cars SET is_available = 0 WHERE id = ?', [car_id]);

        res.json({ success: true, total_cost: total });
    } catch (e) {
        console.log('booking error:', e.message);
        res.status(500).json({ error: 'Booking failed' });
    }
});

router.get('/agency-bookings', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'agency')
        return res.status(403).json({ error: 'Access denied' });

    try {
        const [rows] = await db.query(
            `SELECT b.id, b.start_date, b.num_days, b.total_cost, b.booked_at,
                    c.name as customer_name, c.email as customer_email, c.phone as customer_phone,
                    cr.vehicle_model, cr.vehicle_number
             FROM bookings b
             JOIN customers c ON b.customer_id = c.id
             JOIN cars cr ON b.car_id = cr.id
             WHERE cr.agency_id = ?
             ORDER BY b.booked_at DESC`,
            [req.session.user.id]
        );
        res.json(rows);
    } catch (e) {
        console.log('agency-bookings error:', e.message);
        res.status(500).json({ error: 'Could not load bookings' });
    }
});

module.exports = router;

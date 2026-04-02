import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCars, reserve } from '../api';
import { useAuth } from '../context/AuthContext';
import useBodyClass from '../components/useBodyClass';

const today = () => new Date().toISOString().split('T')[0];

export default function Cars() {
    useBodyClass('customer-bg');
    const [cars, setCars] = useState([]);
    const [bookings, setBookings] = useState({});
    const [err, setErr] = useState('');
    const [confirm, setConfirm] = useState(null);
    const { user } = useAuth();
    const nav = useNavigate();

    useEffect(() => {
        fetchCars().then(d => Array.isArray(d) && setCars(d));
    }, []);

    const updateBooking = (id, k, v) => {
        setBookings(prev => ({
            ...prev,
            [id]: { ...prev[id], [k]: v }
        }));
    }

    const rent = async (car) => {
        if (!user) { nav('/login'); return; }
        if (user.role === 'agency') { 
            setErr('Agencies cannot book cars.'); 
            return; 
        }

        const b = bookings[car.id] || {};
        if (!b.start_date) { 
            setErr('Pick a start date first'); 
            return; 
        }

        const res = await reserve({
            car_id: car.id,
            start_date: b.start_date,
            num_days: b.num_days || 1
        });

        if (res.success) {
            setConfirm({ days: b.num_days || 1, total: res.total_cost });
            fetchCars().then(setCars);
        } else {
            setErr(res.error);
        }
    }

    const days = [1,2,3,4,5,6,7,10,14,30];

    return (
        <div className="container">
            <h2 style={{ marginBottom: 24 }}>Available Cars</h2>

            {err && <div className="alert alert-error" style={{ display: 'block', marginBottom: 16 }}>{err}</div>}

            <div className="car-grid">
                {cars.length === 0 && <p style={{ color: '#888' }}>No cars available right now.</p>}
                {cars.map(car => (
                    <div className="car-card" key={car.id}>
                        <h3>{car.vehicle_model}</h3>
                        <p>Vehicle No: {car.vehicle_number}</p>
                        <p>Seats: {car.seating_capacity}</p>
                        <p>Agency: {car.agency_name}</p>
                        <div className="price">Rs. {car.rent_per_day} / day</div>

                        {user?.role === 'customer' && <>
                            <div className="form-group" style={{ marginTop: 12 }}>
                                <label>Start Date</label>
                                <input type="date" min={today()} onChange={e => updateBooking(car.id, 'start_date', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Number of Days</label>
                                <select onChange={e => updateBooking(car.id, 'num_days', e.target.value)}>
                                    {days.map(d => <option key={d} value={d}>{d} day{d > 1 ? 's' : ''}</option>)}
                                </select>
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} onClick={() => rent(car)}>
                                Rent Car
                            </button>
                        </>}

                        {!user && (
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} onClick={() => rent(car)}>
                                Rent Car
                            </button>
                        )}

                        {user?.role === 'agency' && (
                            <p style={{ fontSize: 12, color: '#999', marginTop: 10 }}>Login as customer to book</p>
                        )}
                    </div>
                ))}
            </div>

            {confirm && (
                <div className="modal-overlay active">
                    <div className="modal">
                        <h3>Booking Confirmed</h3>
                        <p style={{ margin: '14px 0', fontSize: 14 }}>
                            Car booked for {confirm.days} day(s). Total: Rs. {confirm.total}
                        </p>
                        <button className="btn btn-primary" onClick={() => setConfirm(null)}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
}

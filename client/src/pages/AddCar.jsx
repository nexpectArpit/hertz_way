import { useEffect, useState } from 'react';
import { myCars, createCar, updateCar } from '../api';
import { useAuth } from '../context/AuthContext';
import useBodyClass from '../components/useBodyClass';

const empty = { vehicle_model: '', vehicle_number: '', seating_capacity: '', rent_per_day: '' };

export default function AddCar() {
    useBodyClass('agency-bg');
    const [form, setForm] = useState(empty);
    const [cars, setCars] = useState([]);
    const [msg, setMsg] = useState({ text: '', type: '' });
    const [editing, setEditing] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user?.role === 'agency') {
            myCars().then(d => Array.isArray(d) && setCars(d));
        }
    }, [user]);

    const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const validate = (f) => {
        const seats = parseInt(f.seating_capacity);
        const rent = parseFloat(f.rent_per_day);
        if (f.vehicle_model.trim().length < 2) return 'Model name too short';
        if (f.vehicle_number.trim().length < 4) return 'Invalid vehicle number';
        if (isNaN(seats) || seats < 1 || seats > 20) return 'Seats must be 1-20';
        if (isNaN(rent) || rent <= 0) return 'Rent must be positive';
        return null;
    }

    const add = async (e) => {
        e.preventDefault();
        const err = validate(form);
        if (err) return setMsg({ text: err, type: 'error' });

        const res = await createCar(form);
        if (res.success) {
            setMsg({ text: 'Car added!', type: 'success' });
            setForm(empty);
            myCars().then(d => Array.isArray(d) && setCars(d));
        } else {
            setMsg({ text: res.error, type: 'error' });
        }
    }

    const save = async (e) => {
        e.preventDefault();
        const err = validate(editing);
        if (err) return setMsg({ text: err, type: 'error' });

        const res = await updateCar(editing.id, editing);
        if (res.success) {
            setEditing(null);
            myCars().then(d => Array.isArray(d) && setCars(d));
        } else {
            setMsg({ text: res.error, type: 'error' });
        }
    }

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: 520 }}>
                <h2>Add New Car</h2>
                {msg.text && <div className={`alert alert-${msg.type}`} style={{ display: 'block' }}>{msg.text}</div>}
                <form onSubmit={add}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div className="form-group">
                            <label>Vehicle Model *</label>
                            <input name="vehicle_model" value={form.vehicle_model} onChange={update} placeholder="e.g. Toyota Innova" required />
                        </div>
                        <div className="form-group">
                            <label>Vehicle Number *</label>
                            <input name="vehicle_number" value={form.vehicle_number} onChange={update} placeholder="e.g. MH12AB1234" required />
                        </div>
                        <div className="form-group">
                            <label>Seating Capacity *</label>
                            <input name="seating_capacity" type="number" value={form.seating_capacity} onChange={update} placeholder="e.g. 5" min="1" max="20" required />
                        </div>
                        <div className="form-group">
                            <label>Rent Per Day (Rs.) *</label>
                            <input name="rent_per_day" type="number" value={form.rent_per_day} onChange={update} placeholder="e.g. 1500" min="1" required />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: 4 }}>Add Car</button>
                </form>
            </div>

            <div className="card" style={{ marginTop: 24 }}>
                <h2 style={{ marginBottom: 16 }}>My Cars</h2>
                <div className="table-wrap">
                    {cars.length === 0
                        ? <p style={{ color: '#888', fontSize: 14 }}>No cars added yet.</p>
                        : <table>
                            <thead>
                                <tr><th>Model</th><th>Vehicle Number</th><th>Seats</th><th>Rent/Day</th><th>Status</th><th></th></tr>
                            </thead>
                            <tbody>
                                {cars.map(c => (
                                    <tr key={c.id}>
                                        <td>{c.vehicle_model}</td>
                                        <td>{c.vehicle_number}</td>
                                        <td>{c.seating_capacity}</td>
                                        <td>Rs. {c.rent_per_day}</td>
                                        <td style={{ color: c.is_available ? '#2e7d32' : '#c62828' }}>
                                            {c.is_available ? 'Available' : 'Booked'}
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-primary" onClick={() => setEditing({ ...c })}>Edit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                </div>
            </div>

            {editing && (
                <div className="modal-overlay active">
                    <div className="modal">
                        <h3>Edit Car Details</h3>
                        <form onSubmit={save}>
                            {[
                                { key: 'vehicle_model', label: 'Vehicle Model' },
                                { key: 'vehicle_number', label: 'Vehicle Number' },
                                { key: 'seating_capacity', label: 'Seating Capacity' },
                                { key: 'rent_per_day', label: 'Rent Per Day (Rs.)' }
                            ].map(({ key, label }) => (
                                <div className="form-group" key={key}>
                                    <label>{label}</label>
                                    <input
                                        name={key}
                                        value={editing[key]}
                                        onChange={e => setEditing({ ...editing, [key]: e.target.value })}
                                        required
                                    />
                                </div>
                            ))}
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

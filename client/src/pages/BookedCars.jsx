import { useEffect, useState } from 'react';
import { myBookings } from '../api';
import { useAuth } from '../context/AuthContext';
import useBodyClass from '../components/useBodyClass';

export default function BookedCars() {
    useBodyClass('agency-bg');
    const [bookings, setBookings] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user?.role === 'agency') {
            myBookings().then(d => Array.isArray(d) && setBookings(d));
        }
    }, [user]);

    return (
        <div className="container">
            <h2 style={{ marginBottom: 24 }}>Customer Bookings</h2>
            <div className="card">
                <div className="table-wrap">
                    {bookings.length === 0
                        ? <p style={{ color: '#888', fontSize: 14 }}>No bookings yet.</p>
                        : <table>
                            <thead>
                                <tr>
                                    <th>Car</th>
                                    <th>Vehicle No.</th>
                                    <th>Customer</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Start Date</th>
                                    <th>Days</th>
                                    <th>Total</th>
                                    <th>Booked On</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(b => (
                                    <tr key={b.id}>
                                        <td>{b.vehicle_model}</td>
                                        <td>{b.vehicle_number}</td>
                                        <td>{b.customer_name}</td>
                                        <td>{b.customer_email}</td>
                                        <td>{b.customer_phone || '-'}</td>
                                        <td>{new Date(b.start_date).toLocaleDateString()}</td>
                                        <td>{b.num_days}</td>
                                        <td>Rs. {b.total_cost}</td>
                                        <td>{new Date(b.booked_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                </div>
            </div>
        </div>
    );
}

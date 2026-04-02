import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupAgency } from '../api';
import useBodyClass from '../components/useBodyClass';

export default function RegisterAgency() {
    useBodyClass('auth-bg');
    const [form, setForm] = useState({ agency_name: '', email: '', phone: '', address: '', password: '' });
    const [showPw, setShowPw] = useState(false);
    const [msg, setMsg] = useState({ text: '', type: '' });
    const nav = useNavigate();

    function update(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const { agency_name, email, phone, password } = form;

        if (agency_name.trim().length < 2) return setMsg({ text: 'Agency name is too short.', type: 'error' });
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setMsg({ text: 'Enter a valid email.', type: 'error' });
        if (phone && !/^\d{7,15}$/.test(phone)) return setMsg({ text: 'Phone must be 7-15 digits.', type: 'error' });
        if (password.length < 6) return setMsg({ text: 'Password must be at least 6 characters.', type: 'error' });

        const data = await signupAgency(form);
        if (data.success) {
            setMsg({ text: 'Agency registered! Redirecting...', type: 'success' });
            setTimeout(() => nav('/login'), 1500);
        } else {
            setMsg({ text: data.error, type: 'error' });
        }
    }

    return (
        <div className="auth-page">
            <div className="card">
                <h2>Agency Registration</h2>
                <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
                    Are you a customer? <Link to="/register">Register here</Link>
                </p>

                {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Agency Name *</label>
                        <input name="agency_name" value={form.agency_name} onChange={update} placeholder="XYZ Car Rentals" required />
                    </div>
                    <div className="form-group">
                        <label>Email *</label>
                        <input name="email" type="email" value={form.email} onChange={update} placeholder="agency@example.com" required />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input name="phone" value={form.phone} onChange={update} placeholder="9876543210" />
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <textarea name="address" value={form.address} onChange={update} rows={2} placeholder="123 Main St, City" />
                    </div>
                    <div className="form-group">
                        <label>Password *</label>
                        <div className="pw-wrap">
                            <input name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={update} placeholder="Min 6 characters" required />
                            <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>{showPw ? 'Hide' : 'Show'}</button>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register Agency</button>
                </form>

                <p style={{ marginTop: 14, fontSize: 13, textAlign: 'center' }}>
                    Already registered? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

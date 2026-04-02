import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupCustomer } from '../api';
import useBodyClass from '../components/useBodyClass';

export default function RegisterCustomer() {
    useBodyClass('auth-bg');
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
    const [showPw, setShowPw] = useState(false);
    const [msg, setMsg] = useState({ text: '', type: '' });
    const nav = useNavigate();

    function update(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const { name, email, phone, password } = form;

        if (name.trim().length < 2) return setMsg({ text: 'Please enter your full name.', type: 'error' });
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setMsg({ text: 'Enter a valid email.', type: 'error' });
        if (phone && !/^\d{7,15}$/.test(phone)) return setMsg({ text: 'Phone must be 7-15 digits.', type: 'error' });
        if (password.length < 6) return setMsg({ text: 'Password must be at least 6 characters.', type: 'error' });

        const data = await signupCustomer(form);
        if (data.success) {
            setMsg({ text: 'Registered! Redirecting...', type: 'success' });
            setTimeout(() => nav('/login'), 1500);
        } else {
            setMsg({ text: data.error, type: 'error' });
        }
    }

    return (
        <div className="auth-page">
            <div className="card">
                <h2>Customer Registration</h2>
                <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
                    Are you an agency? <Link to="/register-agency">Register here</Link>
                </p>

                {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name *</label>
                        <input name="name" value={form.name} onChange={update} placeholder="John Doe" required />
                    </div>
                    <div className="form-group">
                        <label>Email *</label>
                        <input name="email" type="email" value={form.email} onChange={update} placeholder="john@example.com" required />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input name="phone" value={form.phone} onChange={update} placeholder="9876543210" />
                    </div>
                    <div className="form-group">
                        <label>Password *</label>
                        <div className="pw-wrap">
                            <input name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={update} placeholder="Min 6 characters" required />
                            <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>{showPw ? 'Hide' : 'Show'}</button>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Account</button>
                </form>

                <p style={{ marginTop: 14, fontSize: 13, textAlign: 'center' }}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

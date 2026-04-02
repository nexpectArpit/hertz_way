import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api';
import { useAuth } from '../context/AuthContext';
import useBodyClass from '../components/useBodyClass';

export default function Login() {
    useBodyClass('auth-bg');
    const [role, setRole] = useState('customer');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [err, setErr] = useState('');
    const { setUser } = useAuth();
    const nav = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setErr('');
        const res = await login(email, password, role);
        if (res.success) {
            setUser(res.user);
            nav(res.role === 'agency' ? '/add-car' : '/cars');
        } else {
            setErr(res.error);
        }
    }

    return (
        <div className="auth-page">
            <div className="card">
                <h2>Login</h2>
                <div className="tabs">
                    <button type="button" className={role === 'customer' ? 'tab-btn active' : 'tab-btn'} onClick={() => setRole('customer')}>Customer</button>
                    <button type="button" className={role === 'agency' ? 'tab-btn active' : 'tab-btn'} onClick={() => setRole('agency')}>Agency</button>
                </div>

                {err && <div className="alert alert-error">{err}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <div className="pw-wrap">
                            <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required />
                            <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>{showPw ? 'Hide' : 'Show'}</button>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
                </form>

                <p style={{ marginTop: 14, fontSize: 13, textAlign: 'center' }}>
                    Don't have an account?{' '}
                    <Link to={role === 'agency' ? '/register-agency' : '/register'}>Register here</Link>
                </p>
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../api';

export default function Navbar() {
    const { user, setUser } = useAuth();
    const nav = useNavigate();
    const [bgClass, setBgClass] = useState(document.body.className);

    // watch body class changes so nav theme stays in sync
    useEffect(() => {
        const observer = new MutationObserver(() => {
            setBgClass(document.body.className);
        });
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    async function handleLogout() {
        await logout();
        setUser(null);
        nav('/login');
    }

    return (
        <nav className={bgClass}>
            <Link to="/" className="logo">Hertzway Rentals</Link>
            <ul>
                <li><Link to="/cars">Browse Cars</Link></li>

                {!user && <>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                </>}

                {user?.role === 'agency' && <>
                    <li><Link to="/add-car">Manage Cars</Link></li>
                    <li><Link to="/bookings">View Bookings</Link></li>
                    <li><button onClick={handleLogout}>Logout</button></li>
                </>}

                {user?.role === 'customer' && <>
                    <li><span className="greeting">Hi, {user.name}</span></li>
                    <li><button onClick={handleLogout}>Logout</button></li>
                </>}
            </ul>
        </nav>
    );
}

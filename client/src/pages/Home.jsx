import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useBodyClass from '../components/useBodyClass';

export default function Home() {
    const { user } = useAuth();
    useBodyClass(user?.role === 'agency' ? 'agency-bg' : 'customer-bg');

    return (
        <div className="container">
            <div className="hero">
                <h1>Find Your Perfect Ride</h1>
                <p>Browse from a wide range of cars available for rent.</p>
                <div className="hero-btns">
                    <Link to="/cars" className="btn btn-primary">Browse Cars</Link>

                    {!user && (
                        <Link to="/register" className="btn btn-secondary">Register as Customer</Link>
                    )}
                    {user?.role === 'agency' && (
                        <Link to="/add-car" className="btn btn-secondary">Manage Cars</Link>
                    )}
                </div>
            </div>
        </div>
    );
}

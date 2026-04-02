import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterCustomer from './pages/RegisterCustomer';
import RegisterAgency from './pages/RegisterAgency';
import Cars from './pages/Cars';
import AddCar from './pages/AddCar';
import BookedCars from './pages/BookedCars';

function AppRoutes() {
    const { loading } = useAuth();

    // fix #9 - dont flash pages before session is known
    if (loading) {
        return <div className="loading-screen">Loading...</div>;
    }

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterCustomer />} />
                <Route path="/register-agency" element={<RegisterAgency />} />
                <Route path="/cars" element={<Cars />} />
                <Route path="/add-car" element={
                    <ProtectedRoute allowedRoles={['agency']}>
                        <AddCar />
                    </ProtectedRoute>
                } />
                <Route path="/bookings" element={
                    <ProtectedRoute allowedRoles={['agency']}>
                        <BookedCars />
                    </ProtectedRoute>
                } />
            </Routes>
        </>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}

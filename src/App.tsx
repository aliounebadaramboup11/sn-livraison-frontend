import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Dashboard from './Dashboard';
import Regions from './Regions';
import Livreurs from './Livreurs';
import TousLivreurs from './TousLivreurs';
import AjouterLivreur from './AjouterLivreur';
import DetailLivreur from './DetailLivreur';
import Documents from './Documents';
import Colis from './Colis';
import AjouterColis from './AjouterColis';
import DetailColis from './DetailColis';
import SessionExpiree from './SessionExpiree';
import Profil from './Profil';
import Utilisateurs from './Utilisateurs';

function NavLink({ to, children }: { to: string, children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`px-4 py-2 rounded-md font-medium transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
      {children}
    </Link>
  );
}

function Navigation({ onLogout }: { onLogout: () => void }) {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">SN Livraison</span>
          </div>
          <div className="flex items-center space-x-1">
            <NavLink to="/">Dashboard</NavLink>
            <NavLink to="/regions">Régions</NavLink>
            <NavLink to="/livreurs">Livreurs en attente</NavLink>
            <NavLink to="/tous-livreurs">Tous les livreurs</NavLink>
            <NavLink to="/colis">Colis</NavLink>
            <NavLink to="/utilisateurs">Utilisateurs</NavLink>
            <NavLink to="/ajouter-livreur">Ajouter un livreur</NavLink>
            <NavLink to="/ajouter-colis">Ajouter un colis</NavLink>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/profil" className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md font-medium transition-colors">
              Profil
            </Link>
            <button onClick={onLogout} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition-colors">
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) setIsLoggedIn(true);
  }, []);
  const handleLoginSuccess = () => setIsLoggedIn(true);
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) return <Login onLogin={handleLoginSuccess} />;

  return (
    <div>
      <Navigation onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/regions" element={<Regions />} />
        <Route path="/livreurs" element={<Livreurs />} />
        <Route path="/tous-livreurs" element={<TousLivreurs />} />
        <Route path="/ajouter-livreur" element={<AjouterLivreur />} />
        <Route path="/livreur/:id" element={<DetailLivreur />} />
        <Route path="/livreur/:id/documents" element={<Documents />} />
        <Route path="/colis" element={<Colis />} />
        <Route path="/ajouter-colis" element={<AjouterColis />} />
        <Route path="/colis/:id" element={<DetailColis />} />
        <Route path="/session-expiree" element={<SessionExpiree />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/utilisateurs" element={<Utilisateurs />} />
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;

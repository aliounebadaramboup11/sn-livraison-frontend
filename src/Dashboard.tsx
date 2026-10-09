import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function Dashboard() {
  const [stats, setStats] = useState({
    totalLivreurs: 0,
    livreursActifs: 0,
    livreursEnAttente: 0,
    totalRegions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      axios.get('http://localhost:3000/livreurs/admin/all', { headers }),
      axios.get('http://localhost:3000/locations/regions', { headers })
    ]).then(([livreursRes, regionsRes]) => {
      const livreurs = livreursRes.data;
      setStats({
        totalLivreurs: livreurs.length,
        livreursActifs: livreurs.filter((l: any) => l.status === 'active').length,
        livreursEnAttente: livreurs.filter((l: any) => l.status === 'pending').length,
        totalRegions: regionsRes.data.length,
      });
      setLoading(false);
    }).catch((err) => {
      console.error("Erreur :", err);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Chargement...</div>;

  // Données pour le graphique en camembert
  const pieData = [
    { name: 'Actifs', value: stats.livreursActifs, color: '#10B981' },
    { name: 'En attente', value: stats.livreursEnAttente, color: '#F59E0B' },
  ];

  // Données pour le graphique en barres
  const barData = [
    { name: 'Livreurs', value: stats.totalLivreurs, color: '#3B82F6' },
    { name: 'Régions', value: stats.totalRegions, color: '#8B5CF6' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Tableau de bord</h1>
      <p className="text-gray-500 mb-8">Vue d'ensemble de votre application</p>
      
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <p className="text-blue-800 font-medium mb-1">Total des livreurs</p>
          <p className="text-4xl font-bold text-blue-600">{stats.totalLivreurs}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <p className="text-green-800 font-medium mb-1">Livreurs actifs</p>
          <p className="text-4xl font-bold text-green-600">{stats.livreursActifs}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <p className="text-yellow-800 font-medium mb-1">En attente</p>
          <p className="text-4xl font-bold text-yellow-600">{stats.livreursEnAttente}</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <p className="text-purple-800 font-medium mb-1">Régions</p>
          <p className="text-4xl font-bold text-purple-600">{stats.totalRegions}</p>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Répartition des livreurs</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Statistiques globales</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Accès rapides */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Accès rapides</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/livreurs" className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Livreurs en attente</h3>
          <p className="text-gray-500 text-sm">Valider les nouveaux livreurs</p>
        </Link>
        <Link to="/tous-livreurs" className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Tous les livreurs</h3>
          <p className="text-gray-500 text-sm">Voir la liste complète</p>
        </Link>
        <Link to="/ajouter-livreur" className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Ajouter un livreur</h3>
          <p className="text-gray-500 text-sm">Créer un nouveau compte livreur</p>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;

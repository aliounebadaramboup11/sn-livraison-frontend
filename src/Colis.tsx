import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from './api';

function Colis() {
  const [colis, setColis] = useState<any[]>([]);
  const [filteredColis, setFilteredColis] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/parcels/admin/all')
      .then((response) => {
        setColis(response.data);
        setFilteredColis(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur :", err);
        setError("Impossible de charger les colis.");
        setLoading(false);
      });
  }, []);

  // Filtrage combiné : recherche + statut
  useEffect(() => {
    let results = colis;

    // Filtre par recherche
    if (searchTerm) {
      results = results.filter(item => 
        (item.trackingNumber && item.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.recipientName && item.recipientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.recipientPhone && item.recipientPhone.includes(searchTerm)) ||
        (item.deliveryAddress && item.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      results = results.filter(item => item.status === statusFilter);
    }

    setFilteredColis(results);
  }, [searchTerm, statusFilter, colis]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'picked_up': return 'bg-purple-100 text-purple-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Chargement...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Liste des Colis</h1>
      
      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Rechercher par numéro, destinataire, téléphone ou adresse..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="picked_up">Récupéré</option>
            <option value="in_transit">En transit</option>
            <option value="delivered">Livré</option>
            <option value="failed">Échec</option>
          </select>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {filteredColis.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">Aucun colis ne correspond à votre recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColis.map((item: any) => (
            <Link 
              to={`/colis/${item.id}`} 
              key={item.id} 
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow block"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Colis #{item.trackingNumber || item.id.substring(0, 8)}
                </h2>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                  {item.status || 'pending'}
                </span>
              </div>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Destinataire :</span> {item.recipientName || 'N/A'}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Adresse :</span> {item.deliveryAddress || 'N/A'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Colis;

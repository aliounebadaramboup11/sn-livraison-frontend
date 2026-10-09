import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from './api';

function TousLivreurs() {
  const [livreurs, setLivreurs] = useState<any[]>([]);
  const [filteredLivreurs, setFilteredLivreurs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  useEffect(() => {
    api.get('/livreurs/admin/all')
      .then((response) => {
        setLivreurs(response.data);
        setFilteredLivreurs(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur :", err);
        setError("Impossible de charger les livreurs.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const results = livreurs.filter(livreur => 
      livreur.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      livreur.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      livreur.phone.includes(searchTerm)
    );
    setFilteredLivreurs(results);
    setCurrentPage(1);
  }, [searchTerm, livreurs]);

  if (loading) return <div className="p-8 text-center text-gray-500">Chargement...</div>;

  const totalLivreurs = livreurs.length;
  const livreursActifs = livreurs.filter(l => l.status === 'active').length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLivreurs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLivreurs.length / itemsPerPage);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Tous les Livreurs</h1>
        <input 
          type="text" 
          placeholder="Rechercher un livreur..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 font-medium">Total des livreurs</p>
          <p className="text-3xl font-bold text-blue-600">{totalLivreurs}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">Livreurs actifs</p>
          <p className="text-3xl font-bold text-green-600">{livreursActifs}</p>
        </div>
      </div>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {currentItems.length === 0 ? (
        <p className="text-gray-500">Aucun livreur trouvé.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentItems.map((livreur: any) => (
              <Link 
                to={`/livreur/${livreur.id}`} 
                key={livreur.id} 
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow block"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {livreur.firstName} {livreur.lastName}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    livreur.status === 'active' ? 'bg-green-100 text-green-800' : 
                    livreur.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {livreur.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Téléphone :</span> {livreur.phone}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Rôle :</span> {livreur.role}
                </p>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                Précédent
              </button>
              <span className="text-gray-600 font-medium">
                Page {currentPage} sur {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                Suivant
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TousLivreurs;

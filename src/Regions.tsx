import { useEffect, useState } from 'react';
import axios from 'axios';

function Regions() {
  const [regions, setRegions] = useState<any[]>([]);
  const [filteredRegions, setFilteredRegions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    axios.get('http://localhost:3000/locations/regions', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        setRegions(response.data);
        setFilteredRegions(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur :", err);
        setError("Impossible de charger les régions.");
        setLoading(false);
      });
  }, []);

  // Filtrage en temps réel
  useEffect(() => {
    const results = regions.filter(region => 
      region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      region.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRegions(results);
  }, [searchTerm, regions]);

  if (loading) return <div className="p-8 text-center text-gray-500">Chargement...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Liste des Régions</h1>
        
        <input 
          type="text" 
          placeholder="Rechercher une région..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
      </div>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {filteredRegions.length === 0 ? (
        <p className="text-gray-500">Aucune région trouvée.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRegions.map((region: any) => (
            <div key={region.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {region.name}
              </h2>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Code :</span> {region.code}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Latitude :</span> {region.latitude}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Regions;

import { useEffect, useState } from 'react';
import api from './api';

function Livreurs() {
  const [livreurs, setLivreurs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const chargerLivreurs = () => {
    api.get('/livreurs/admin/pending')
      .then((response) => {
        setLivreurs(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur :", err);
        setError("Impossible de charger les livreurs.");
        setLoading(false);
      });
  };

  useEffect(() => {
    chargerLivreurs();
  }, []);

  const validerLivreur = async (id: string) => {
    try {
      await api.patch(`/livreurs/${id}/activate`);
      alert("Livreur validé !");
      chargerLivreurs();
    } catch (err: any) {
      console.error("Erreur :", err.response?.data || err.message);
      alert("ERREUR : " + (err.response?.data?.message || err.message));
    }
  };

  const toutValider = async () => {
    if (!window.confirm("Voulez-vous vraiment valider TOUS les livreurs en attente ?")) return;
    try {
      await Promise.all(
        livreurs.map(livreur => api.patch(`/livreurs/${livreur.id}/activate`))
      );
      alert("Tous les livreurs ont été validés !");
      chargerLivreurs();
    } catch (err) {
      alert("Erreur lors de la validation groupée.");
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Chargement...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Livreurs en attente</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-6 py-3">
          <p className="text-yellow-800 font-medium text-sm">En attente</p>
          <p className="text-3xl font-bold text-yellow-600">{livreurs.length}</p>
        </div>
      </div>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {livreurs.length === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <p className="text-green-800 font-medium">Aucun livreur en attente. Tout est à jour !</p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <button 
              onClick={toutValider}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Tout valider
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {livreurs.map((livreur: any) => (
              <div key={livreur.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {livreur.firstName} {livreur.lastName}
                  </h2>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                    {livreur.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Téléphone :</span> {livreur.phone}
                </p>
                <button 
                  onClick={() => validerLivreur(livreur.id)}
                  className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors"
                >
                  Valider
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Livreurs;

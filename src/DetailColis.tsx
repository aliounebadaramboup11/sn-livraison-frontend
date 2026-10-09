import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from './api';

function DetailColis() {
  const { id } = useParams();
  const [colis, setColis] = useState<any>(null);
  const [livreurs, setLivreurs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const chargerColis = () => {
    api.get(`/parcels/${id}`)
      .then((response) => {
        setColis(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur :", err);
        setError("Impossible de charger le colis.");
        setLoading(false);
      });
  };

  const chargerLivreurs = () => {
    api.get('/livreurs/admin/all')
      .then((response) => setLivreurs(response.data))
      .catch((err) => console.error("Erreur livreurs :", err));
  };

  useEffect(() => {
    chargerColis();
    chargerLivreurs();
  }, [id]);

  const changerStatut = async (nouveauStatut: string) => {
    try {
      await api.patch(`/parcels/${id}/status`, { status: nouveauStatut });
      setToast({ message: "Statut mis à jour !", type: 'success' });
      chargerColis();
    } catch (err) {
      setToast({ message: "Erreur lors du changement de statut.", type: 'error' });
    }
  };

  const assignerLivreur = async (livreurId: string) => {
    try {
      await api.patch(`/parcels/${id}/assign`, { livreurId });
      setToast({ message: "Livreur assigné !", type: 'success' });
      chargerColis();
    } catch (err) {
      setToast({ message: "Erreur lors de l'assignation.", type: 'error' });
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Chargement...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!colis) return <div className="p-8 text-center text-gray-500">Colis introuvable.</div>;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'picked_up': return 'bg-purple-100 text-purple-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {toast.message}
        </div>
      )}

      <Link to="/colis" className="text-blue-600 hover:text-blue-800 font-medium mb-6 inline-block">
        ← Retour à la liste des colis
      </Link>

      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Colis #{colis.trackingNumber || colis.id.substring(0, 8)}
            </h1>
            <p className="text-gray-500 mt-1">Créé le {new Date(colis.createdAt).toLocaleDateString('fr-FR')}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(colis.status)}`}>
            {colis.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-500 text-sm font-medium mb-1">Destinataire</p>
            <p className="text-gray-800 font-semibold">{colis.recipientName}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-500 text-sm font-medium mb-1">Téléphone</p>
            <p className="text-gray-800 font-semibold">{colis.recipientPhone}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-500 text-sm font-medium mb-1">Adresse de livraison</p>
            <p className="text-gray-800 font-semibold">{colis.deliveryAddress}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-500 text-sm font-medium mb-1">Prix</p>
            <p className="text-gray-800 font-semibold">{colis.price} FCFA</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Actions</h2>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={() => changerStatut('picked_up')} className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded transition-colors">
              Récupéré
            </button>
            <button onClick={() => changerStatut('in_transit')} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors">
              En transit
            </button>
            <button onClick={() => changerStatut('delivered')} className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-colors">
              Livré
            </button>
            <button onClick={() => changerStatut('failed')} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition-colors">
              Échec
            </button>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Assigner un livreur</label>
            {livreurs.length === 0 ? (
              <p className="text-yellow-600 bg-yellow-50 p-2 rounded">
                Aucun livreur disponible.
              </p>
            ) : (
              <select 
                onChange={(e) => assignerLivreur(e.target.value)}
                className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue=""
              >
                <option value="" disabled>Choisir un livreur...</option>
                {livreurs.map((livreur: any) => (
                  <option key={livreur.id} value={livreur.id}>
                    {livreur.firstName} {livreur.lastName} ({livreur.phone})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* NOUVELLE SECTION : Historique */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Historique du colis</h2>
        
        {(!colis.history || colis.history.length === 0) ? (
          <p className="text-gray-500">Aucun historique disponible.</p>
        ) : (
          <div className="relative border-l-2 border-gray-200 ml-4">
            {colis.history.map((entry: any, index: number) => (
              <div key={index} className="mb-6 ml-6">
                <span className="absolute -left-[9px] mt-1.5 w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></span>
                <p className="text-sm text-gray-500">
                  {new Date(entry.date).toLocaleString('fr-FR')}
                </p>
                <p className="font-semibold text-gray-800 capitalize">{entry.status}</p>
                {entry.note && <p className="text-gray-600 text-sm">{entry.note}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DetailColis;

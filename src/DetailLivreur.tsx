import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function DetailLivreur() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [livreur, setLivreur] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    axios.get(`http://localhost:3000/livreurs/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        setLivreur(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur :", err);
        setError("Impossible de charger les détails du livreur.");
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce livreur ?")) return;
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://localhost:3000/livreurs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Livreur supprimé !");
      navigate('/tous-livreurs');
    } catch (err) {
      alert("Erreur lors de la suppression.");
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Chargement...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!livreur) return <div className="p-8 text-center text-gray-500">Livreur introuvable.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link to="/tous-livreurs" className="text-blue-600 hover:text-blue-800 font-medium mb-6 inline-block">
        ← Retour à la liste
      </Link>
      
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-4xl font-bold text-gray-800">
            {livreur.firstName} {livreur.lastName}
          </h1>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
            livreur.status === 'active' ? 'bg-green-100 text-green-800' : 
            livreur.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'
          }`}>
            {livreur.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-500 text-sm font-medium mb-1">Téléphone</p>
            <p className="text-gray-800 font-semibold">{livreur.phone}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-500 text-sm font-medium mb-1">Rôle</p>
            <p className="text-gray-800 font-semibold">{livreur.role}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-500 text-sm font-medium mb-1">Date d'inscription</p>
            <p className="text-gray-800 font-semibold">
              {new Date(livreur.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-500 text-sm font-medium mb-1">Vérifié</p>
            <p className="text-gray-800 font-semibold">{livreur.phoneVerified ? 'Oui' : 'Non'}</p>
          </div>
        </div>

        <div className="flex gap-4 border-t border-gray-200 pt-6">
          <Link 
            to={`/livreur/${id}/documents`}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Voir les documents
          </Link>
          <button 
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Supprimer ce livreur
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailLivreur;

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Toast from './Toast';

function Documents() {
  const { id } = useParams();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const chargerDocuments = () => {
    const token = localStorage.getItem('access_token');
    axios.get(`http://localhost:3000/livreurs/${id}/documents`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        setDocuments(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur :", err);
        setError("Impossible de charger les documents.");
        setLoading(false);
      });
  };

  useEffect(() => {
    chargerDocuments();
  }, [id]);

  const verifierDocument = async (docId: string) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.patch(`http://localhost:3000/livreurs/documents/${docId}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setToast({ message: "Document vérifié avec succès !", type: 'success' });
      chargerDocuments();
    } catch (err) {
      setToast({ message: "Erreur lors de la vérification.", type: 'error' });
    }
  };

  const rejeterDocument = async (docId: string) => {
    const raison = window.prompt("Pourquoi rejetez-vous ce document ?");
    if (!raison) return;

    try {
      const token = localStorage.getItem('access_token');
      await axios.patch(`http://localhost:3000/livreurs/documents/${docId}/reject`, 
        { reason: raison },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setToast({ message: "Document rejeté !", type: 'success' });
      chargerDocuments();
    } catch (err) {
      setToast({ message: "Erreur lors du rejet.", type: 'error' });
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Chargement...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Affichage du Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <Link to={`/livreur/${id}`} className="text-blue-600 hover:text-blue-800 font-medium mb-6 inline-block">
        ← Retour aux détails du livreur
      </Link>
      
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Documents du Livreur</h1>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {documents.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">Aucun document trouvé pour ce livreur.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc: any) => (
            <div key={doc.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-semibold text-gray-800">{doc.type}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  doc.status === 'verified' ? 'bg-green-100 text-green-800' : 
                  doc.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {doc.status}
                </span>
              </div>

              {doc.status === 'rejected' && doc.rejectionReason && (
                <p className="text-red-600 text-sm mb-4 bg-red-50 p-2 rounded">
                  <span className="font-medium">Raison :</span> {doc.rejectionReason}
                </p>
              )}
              
              {doc.status === 'pending' && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => verifierDocument(doc.id)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors"
                  >
                    Vérifier
                  </button>
                  <button 
                    onClick={() => rejeterDocument(doc.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors"
                  >
                    Rejeter
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Documents;

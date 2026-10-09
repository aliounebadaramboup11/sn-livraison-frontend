import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

function AjouterColis() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/parcels/admin/create', {
        trackingNumber: trackingNumber || undefined, // Le backend générera un numéro si vide
        recipientName,
        recipientPhone,
        deliveryAddress,
        description,
        price: parseFloat(price) || 0,
      });

      setSuccess('Colis créé avec succès !');
      // Réinitialiser le formulaire
      setTrackingNumber('');
      setRecipientName('');
      setRecipientPhone('');
      setDeliveryAddress('');
      setDescription('');
      setPrice('');
      
      // Rediriger vers la page des colis après 2 secondes
      setTimeout(() => {
        navigate('/colis');
      }, 2000);
      
    } catch (err: any) {
      console.error("Erreur :", err.response?.data || err.message);
      setError(err.response?.data?.message || "Erreur lors de la création du colis.");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Ajouter un Colis</h1>

      {error && <p className="text-red-500 mb-4 bg-red-50 p-2 rounded">{error}</p>}
      {success && <p className="text-green-500 mb-4 bg-green-50 p-2 rounded">{success}</p>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Numéro de suivi (optionnel)</label>
          <input 
            type="text" 
            value={trackingNumber} 
            onChange={(e) => setTrackingNumber(e.target.value)} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: COL-12345"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Nom du destinataire</label>
            <input 
              type="text" 
              value={recipientName} 
              onChange={(e) => setRecipientName(e.target.value)} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Téléphone du destinataire</label>
            <input 
              type="text" 
              value={recipientPhone} 
              onChange={(e) => setRecipientPhone(e.target.value)} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Adresse de livraison</label>
          <input 
            type="text" 
            value={deliveryAddress} 
            onChange={(e) => setDeliveryAddress(e.target.value)} 
            required 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Dakar, Plateau"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Description (optionnel)</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Prix (FCFA)</label>
          <input 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 2000"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Créer le colis
        </button>
      </form>
    </div>
  );
}

export default AjouterColis;

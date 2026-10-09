import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AjouterLivreur() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('access_token');
      await axios.post('http://localhost:3000/livreurs/admin/create', {
        firstName,
        lastName,
        phone,
        password,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Livreur créé avec succès !');
      // Réinitialiser le formulaire
      setFirstName('');
      setLastName('');
      setPhone('');
      setPassword('');
      
      // Rediriger vers la page des livreurs en attente après 2 secondes
      setTimeout(() => {
        navigate('/livreurs');
      }, 2000);
      
    } catch (err: any) {
      console.error("Erreur :", err.response?.data || err.message);
      setError(err.response?.data?.message || "Erreur lors de la création du livreur.");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Ajouter un Livreur</h1>

      {error && <p className="text-red-500 mb-4 bg-red-50 p-2 rounded">{error}</p>}
      {success && <p className="text-green-500 mb-4 bg-green-50 p-2 rounded">{success}</p>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Prénom</label>
            <input 
              type="text" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Nom</label>
            <input 
              type="text" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Numéro de téléphone</label>
          <input 
            type="text" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            required 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 770000300"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Mot de passe</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Créer le livreur
        </button>
      </form>
    </div>
  );
}

export default AjouterLivreur;

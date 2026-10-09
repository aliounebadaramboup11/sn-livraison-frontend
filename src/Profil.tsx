import { useEffect, useState } from 'react';
import api from './api';

function Profil() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (err) {
        setError("Impossible de lire les informations du token.");
      }
    }
    setLoading(false);
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (newPassword !== confirmPassword) {
      setMessage({ text: "Les deux mots de passe ne correspondent pas.", type: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ text: "Le mot de passe doit contenir au moins 6 caractères.", type: 'error' });
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const payload = JSON.parse(atob(token!.split('.')[1]));
      
      // Appel à l'API pour changer le mot de passe
      await api.patch(`/users/${payload.sub}/password`, {
        currentPassword,
        newPassword,
      });

      setMessage({ text: "Mot de passe modifié avec succès !", type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error("Erreur :", err.response?.data || err.message);
      setMessage({ 
        text: err.response?.data?.message || "Erreur lors de la modification du mot de passe.", 
        type: 'error' 
      });
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Chargement...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Mon Profil</h1>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {user ? (
        <>
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 mb-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-600">
                  {user.phone ? user.phone.substring(0, 2) : '?'}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Administrateur</h2>
                <p className="text-gray-500">Connecté</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm font-medium mb-1">Numéro de téléphone</p>
                <p className="text-gray-800 font-semibold">{user.phone}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm font-medium mb-1">Rôle</p>
                <p className="text-gray-800 font-semibold capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Formulaire de changement de mot de passe */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Changer le mot de passe</h2>

            {message.text && (
              <p className={`mb-4 p-2 rounded ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message.text}
              </p>
            )}

            <form onSubmit={handleChangePassword}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Mot de passe actuel</label>
                <input 
                  type="password" 
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)} 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Nouveau mot de passe</label>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Confirmer le nouveau mot de passe</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Modifier le mot de passe
              </button>
            </form>
          </div>
        </>
      ) : (
        <p className="text-gray-500">Aucune information disponible.</p>
      )}
    </div>
  );
}

export default Profil;

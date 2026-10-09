import { useEffect, useState } from 'react';
import api from './api';

function Utilisateurs() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Formulaire d'ajout
  const [showForm, setShowForm] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [message, setMessage] = useState({ text: '', type: '' });

  // Formulaire de modification
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editRole, setEditRole] = useState('');

  const chargerUtilisateurs = () => {
    api.get('/users')
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur :", err);
        setError("Impossible de charger les utilisateurs.");
        setLoading(false);
      });
  };

  useEffect(() => {
    chargerUtilisateurs();
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    try {
      await api.post('/users', { firstName, lastName, phone, password, role });
      setMessage({ text: "Utilisateur créé avec succès !", type: 'success' });
      setFirstName(''); setLastName(''); setPhone(''); setPassword(''); setRole('admin');
      setShowForm(false);
      chargerUtilisateurs();
    } catch (err: any) {
      setMessage({ text: err.response?.data?.message || "Erreur lors de la création.", type: 'error' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer l'utilisateur "${name}" ?`)) return;
    try {
      await api.delete(`/users/${id}`);
      setMessage({ text: "Utilisateur supprimé avec succès !", type: 'success' });
      chargerUtilisateurs();
    } catch (err) {
      setMessage({ text: "Erreur lors de la suppression.", type: 'error' });
    }
  };

  // NOUVELLE FONCTION : Ouvrir le formulaire de modification
  const openEdit = (user: any) => {
    setEditingUser(user);
    setEditFirstName(user.firstName);
    setEditLastName(user.lastName);
    setEditRole(user.role);
  };

  // NOUVELLE FONCTION : Enregistrer la modification
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    try {
      await api.patch(`/users/${editingUser.id}`, {
        firstName: editFirstName,
        lastName: editLastName,
        role: editRole,
      });
      setMessage({ text: "Utilisateur modifié avec succès !", type: 'success' });
      setEditingUser(null);
      chargerUtilisateurs();
    } catch (err: any) {
      setMessage({ text: "Erreur lors de la modification.", type: 'error' });
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Chargement...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Gestion des Utilisateurs</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          {showForm ? 'Annuler' : 'Ajouter un utilisateur'}
        </button>
      </div>

      {message.text && (
        <p className={`mb-4 p-2 rounded ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </p>
      )}

      {/* Formulaire d'ajout */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Nouvel utilisateur</h2>
          <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Prénom</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Nom</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Téléphone</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: 770000300" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Mot de passe</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Rôle</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="admin">Administrateur</option>
                <option value="livreur">Livreur</option>
                <option value="client">Client</option>
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                Créer l'utilisateur
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Formulaire de modification */}
      {editingUser && (
        <div className="bg-yellow-50 rounded-lg shadow-md p-6 mb-8 border border-yellow-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Modifier : {editingUser.firstName} {editingUser.lastName}</h2>
          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Prénom</label>
              <input type="text" value={editFirstName} onChange={(e) => setEditFirstName(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Nom</label>
              <input type="text" value={editLastName} onChange={(e) => setEditLastName(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Rôle</label>
              <select value={editRole} onChange={(e) => setEditRole(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="admin">Administrateur</option>
                <option value="livreur">Livreur</option>
                <option value="client">Client</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                Enregistrer
              </button>
              <button type="button" onClick={() => setEditingUser(null)} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user: any) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 
                    user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-4">
                  {/* Bouton Modifier */}
                  <button 
                    onClick={() => openEdit(user)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Modifier
                  </button>
                  
                  {/* Bouton Supprimer (désactivé pour soi-même) */}
                  <button 
                    onClick={() => handleDelete(user.id, `${user.firstName} ${user.lastName}`)}
                    disabled={user.phone === '770000200'}
                    className={`font-medium ${user.phone === '770000200' ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-800'}`}
                  >
                    {user.phone === '770000200' ? 'Vous-même' : 'Supprimer'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Utilisateurs;

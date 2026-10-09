import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SessionExpiree() {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          localStorage.removeItem('access_token');
          window.location.href = '/'; // Redirection vers la connexion
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Session expirée</h1>
        <p className="text-gray-600 mb-6">
          Votre session a expiré pour des raisons de sécurité.
        </p>
        <p className="text-gray-800 font-semibold mb-6">
          Redirection dans {countdown} seconde{countdown > 1 ? 's' : ''}...
        </p>
        <button 
          onClick={() => {
            localStorage.removeItem('access_token');
            window.location.href = '/';
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Se reconnecter maintenant
        </button>
      </div>
    </div>
  );
}

export default SessionExpiree;

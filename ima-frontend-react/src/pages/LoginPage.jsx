import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/AuthService';

const LoginPage = () => {

    const navigator = useNavigate();

    // --- 1. État pour les identifiants et le processus ---
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    // --- 2. Gestion des changements des champs ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials( prev => ({ ...prev, [name]: value }) );
    };

    // --- 3. Gestion de la soumission ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await loginUser(credentials);
            
            // --- CORRECTION CLÉ POUR LE PROTECTED ROUTE ---
            const accessToken = response.data.accessToken; 
            
            if (accessToken) {
                // IMPORTANT : Stocker le token en utilisant la même clé que ProtectedRoute.jsx
                localStorage.setItem('token', accessToken); 
                
                // OPTIONNEL : Stocker le refreshToken pour le renouvellement
                localStorage.setItem('refreshToken', response.data.refreshToken); 
                
                // OPTIONNEL : Stocker les infos utilisateur
                // localStorage.setItem('user', JSON.stringify(response.data.userSummaryResponse));

            } else {
                // Gérer le cas où l'API réussit mais n'envoie pas le token (improbable ici)
                throw new Error("Token d'accès manquant dans la réponse de l'API.");
            }
            
            console.log("Connexion réussie. Token d'accès stocké et prêt pour la redirection.");
            
            // Redirection vers le tableau de bord
            navigator('/dashboard'); // <-- Ceci sera maintenant autorisé par ProtectedRoute

        } catch (err) {
            console.error("Erreur de connexion:", err);
            
            // Gestion spécifique des codes d'erreur (ex: 401 Unauthorized)
            let errorMessage = "Erreur de connexion inconnue.";

            if (err.response) {
                // Erreur reçue du backend (ex: email/mot de passe incorrects)
                if (err.response.status === 401) {
                    errorMessage = "Email ou mot de passe incorrect.";
                } else {
                    errorMessage = err.response.data.message || "Erreur de serveur.";
                }
            } else if (err.request) {
                // La requête a été faite, mais aucune réponse n'a été reçue (problème réseau)
                errorMessage = "Impossible de joindre le serveur. Vérifiez votre connexion.";
            }
            
            setError(errorMessage);
            setLoading(false);
        } finally {
             // Assurez-vous que le loading est désactivé si l'erreur n'a pas été gérée dans le catch
             if (!error) setLoading(false); 
        }
    };


    // --- 4. Rendu JSX ---
    return (
        <div className="container d-flex justify-content-center my-5">
            
            <div className="card shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>

                <div className="card-header text-center bg-success text-white">
                    <h3>Connexion</h3>
                </div>

                <div className="card-body">
                    <form onSubmit={handleSubmit}>

                        {/* Afficher l'erreur si elle existe */}
                        {error && <div className="alert alert-danger">{error}</div>}

                        {/* Champ Email */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input 
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={credentials.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Champ Mot de passe */}
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Mot de passe</label>
                            <input 
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Boutons */}
                        <div className="mb-3 d-flex justify-content-between mt-4">
                            
                            {/* Lien vers l'inscription */}
                            <button 
                                type="button" 
                                className="btn btn-outline-primary"
                                onClick={() => navigator('/register')} // Assurez-vous que cette route existe
                            >
                                <i className="fa fa-user-plus"></i> S'inscrire
                            </button>

                            {/* Bouton de Connexion */}
                            <button 
                                type="submit" 
                                className="btn btn-success"
                                disabled={loading || !credentials.email || !credentials.password} 
                            >
                                {loading ? 'Connexion en cours...' : (
                                    <>
                                        <i className="fa fa-sign-in-alt"></i> Se connecter
                                    </>
                                )}
                            </button>
                        </div>
                        
                    </form>

                </div>

            </div>
            
        </div>
    );
}

export default LoginPage;
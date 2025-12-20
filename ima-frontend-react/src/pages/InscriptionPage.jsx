import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { registerUser } from '../services/AuthService';

const InscriptionPage = () => {

    const navigator = useNavigate(); // Utilisation du hook useNavigate

    const [user, setUser] = useState({
        
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        telephone: "",
        // Dans une page d'inscription publique, les rôles sont généralement gérés par le backend (ex: ROLE_USER par défaut). 
        // On peut laisser ce champ vide ici, car il ne devrait pas être saisi par l'utilisateur.
        roles: [] 
        
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    // Ajout d'un état pour la confirmation du mot de passe (bonne pratique de sécurité)
    const [confirmPassword, setConfirmPassword] = useState(''); 

    // Gère les changements pour les champs de formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser( prev => ({ ...prev, [name]: value }) );
    };

    // Gère le changement du champ de confirmation du mot de passe
    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    // Gère la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Vérification de la correspondance des mots de passe
        if (user.password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            setLoading(false);
            return;
        }

        try {
            // L'objet 'user' contient toutes les données nécessaires
            await registerUser(user);
            
            alert("Inscription réussie ! Redirection vers la page de connexion.");
            navigator('/login'); // Utilisation de navigate()

        } catch (err) {
            console.error("Erreur d'inscription:", err);
            
            // Gestion d'erreur améliorée pour extraire le message du backend (ex: conflit d'email)
            const backendError = err.response?.data?.message || err.message;
            setError(backendError || "Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
            setLoading(false);
        }
    };


    return (
        <div className="container d-flex justify-content-center my-5">
            
            <div className="card shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>

                <div className="card-header text-center bg-primary text-white">
                    <h3>S'inscrire</h3>
                </div>

                <div className="card-body">
                    <form onSubmit={handleSubmit}>

                        {/* Afficher l'erreur si elle existe */}
                        {error && <div className="alert alert-danger">{error}</div>}

                        {/* --- Champs de saisie --- */}
                        
                        {/* Prénom et Nom */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="firstName" className="form-label">Prénom</label>
                                <input 
                                    type="text"
                                    className="form-control"
                                    id="firstName"
                                    name="firstName"
                                    value={user.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="lastName" className="form-label">Nom</label>
                                <input 
                                    type="text"
                                    className="form-control"
                                    id="lastName"
                                    name="lastName"
                                    value={user.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input 
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Mot de passe */}
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Mot de passe</label>
                            <input 
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                                required
                                minLength="6" // Optionnel: pour une validation côté client
                            />
                        </div>

                        {/* Confirmation du Mot de passe */}
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">Confirmer le mot de passe</label>
                            <input 
                                type="password"
                                className="form-control"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                required
                            />
                        </div>

                        {/* Téléphone (Optionnel) */}
                        <div className="mb-3">
                            <label htmlFor="telephone" className="form-label">Téléphone (Optionnel)</label>
                            <input 
                                type="tel"
                                className="form-control"
                                id="telephone"
                                name="telephone"
                                value={user.telephone}
                                onChange={handleChange}
                            />
                        </div>


                        {/* Boutons */}
                        <div className="mb-3 d-flex justify-content-between mt-4">
                            <button 
                                type="button" 
                                className="btn btn-outline-secondary"
                                onClick={() => navigator('/login')} // Utilisation de navigate()
                            >
                                <i className="fa fa-sign-in-alt"></i> Se connecter
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={loading || user.password.length === 0 || user.password !== confirmPassword} 
                            >
                                {loading ? 'En cours...' : (
                                    <>
                                        <i className="fa fa-user-plus"></i> S'inscrire
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

export default InscriptionPage;
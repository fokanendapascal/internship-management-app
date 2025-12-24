import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/AuthService';

const LoginPage = ({ onLogin }) => { // <--- Ne pas oublier onLogin ici
    const navigate = useNavigate(); // Changé navigator par navigate (standard)

    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials( prev => ({ ...prev, [name]: value }) );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await loginUser(credentials);
            
            console.log(response);
            // 1. On récupère l'objet imbriqué userSummaryResponse
            const { accessToken, refreshToken, userSummaryResponse } = response.data;

            if (accessToken && userSummaryResponse) {

                localStorage.setItem('accessToken', accessToken);
                // 2. On stocke les données avec les clés exactes du DTO Java
                const userDetails = {
                    firstName: userSummaryResponse.firstName,
                    lastName: userSummaryResponse.lastName,
                    email: userSummaryResponse.email
                };
                
                localStorage.setItem('user', JSON.stringify(userDetails));

                if (refreshToken) {
                    localStorage.setItem('refreshToken', refreshToken);
                }

                onLogin(accessToken); 
                navigate('/dashboard'); 
            } else {
                throw new Error("Données utilisateur ou Token manquants.");
            }
        } catch (err) {
            let errorMessage = "Erreur de connexion.";
                    if (err.response?.status === 401) {
                        errorMessage = "Email ou mot de passe incorrect.";
                    } else if (err.response?.data?.message) {
                        errorMessage = err.response.data.message;
                    }
                    setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center my-5">
            <div className="card shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
                <div className="card-header text-center bg-success text-white">
                    <h3 className="mb-0">Connexion</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        {error && <div className="alert alert-danger py-2">{error}</div>}

                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input 
                                type="email"
                                className="form-control"
                                name="email"
                                value={credentials.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Mot de passe</label>
                            <input 
                                type="password"
                                className="form-control"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <button 
                                type="button" 
                                className="btn btn-link p-0 text-decoration-none"
                                onClick={() => navigate('/register')}
                            >
                                Créer un compte
                            </button>

                            <button 
                                type="submit" 
                                className="btn btn-success px-4"
                                disabled={loading || !credentials.email || !credentials.password} 
                            >
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm mr-2"></span>
                                ) : 'Se connecter'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
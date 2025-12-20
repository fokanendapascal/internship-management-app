import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listUsers, deleteUser } from '../services/UserService'; 
import { formatRole, getRoleColor } from '../styles/Util';

const UsersPage = () => {

    const navigate = useNavigate();

    // --- 1. État ---
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- 2. Fonctions de chargement et d'action ---

    // Fonction pour charger les utilisateurs depuis l'API
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await listUsers();
            setUsers(response.data); // Assurez-vous que les données sont dans response.data
        } catch (err) {
            console.error("Erreur lors de la récupération des utilisateurs:", err);
            // Gestion de l'erreur, potentiellement liée à l'authentification (401/403)
            setError("Erreur lors du chargement des utilisateurs. Veuillez vérifier vos permissions.");
        } finally {
            setLoading(false);
        }
    };

    // Redirige vers la page de création d'utilisateur
    const addNewUser = () => {
        navigate('/users/add'); 
    };

    // Redirige vers la page de modification de l'utilisateur
    const editUser = (id) => {
        navigate(`/users/edit/${id}`); 
    };

    // Supprime un utilisateur après confirmation
    const removeUser = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
            setLoading(true);
            try {
                await deleteUser(id);
                // Rafraîchit la liste après la suppression
                alert(`Utilisateur avec l'ID ${id} supprimé avec succès.`);
                await fetchUsers(); 
            } catch (err) {
                console.error(`Erreur lors de la suppression de l'utilisateur ${id}:`, err);
                setError("Erreur lors de la suppression. L'utilisateur pourrait avoir des données liées.");
                setLoading(false);
            }
        }
    };

    // --- 3. Effet de chargement initial ---
    useEffect(() => {
        fetchUsers();
    }, []); // Le tableau de dépendances vide assure l'exécution une seule fois au montage

    const goToSpecialization = (user) => {
        if (user.roles.includes('STUDENT')) {
            navigate(`/students/new/${user.id}`);
        } else if (user.roles.includes('TEACHER')) {
            navigate(`/teachers/new/${user.id}`);
        } else if (user.roles.includes('COMPANY')) {
            navigate(`/companies/new/${user.id}`);
        } else {
            alert("Aucune spécialisation disponible pour cet utilisateur.");
        }
    };




    // --- 4. Rendu JSX ---

    if (loading && users.length === 0) {
        return <div className="text-center my-5">Chargement de la liste des utilisateurs...</div>;
    }

    if (error) {
        return <div className="alert alert-danger text-center my-5">{error}</div>;
    }


    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Liste des Utilisateurs</h2>

            <button className="btn btn-primary mb-3" onClick={addNewUser}>
                <i className="fa fa-plus"></i> Ajouter un utilisateur
            </button>

            {loading && users.length > 0 && 
                <div className="alert alert-info text-center">Mise à jour en cours...</div>
            }

            <div className="table-responsive">
                <table className="table table-striped table-hover shadow-sm">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Prénom</th>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Téléphone</th>
                            <th>Rôles</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.telephone || 'N/A'}</td>                               
                                <td>
                                    {/* Vérifie si user.roles existe et est un tableau */}
                                    {user.roles && user.roles.map((role, index) => (
                                        <span key={index} className={`badge ${getRoleColor(role)} me-1`}>
                                            {formatRole(role)}
                                        </span>
                                    ))}
                                </td>    

                                <td>
                                    <button
                                        className="btn btn-sm btn-warning me-2"
                                        onClick={() => editUser(user.id)}
                                    >
                                        <i className="fa fa-edit"></i>Modifier
                                    </button>

                                    {(user.roles.includes('STUDENT') ||
                                    user.roles.includes('TEACHER') ||
                                    user.roles.includes('COMPANY')) && (
                                        <button
                                            className="btn btn-sm btn-info me-2"
                                            onClick={() => goToSpecialization(user)}
                                            title="Compléter le profil"
                                        >
                                            <i className="fa fa-user-graduate"></i>
                                        </button>
                                    )}

                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => removeUser(user.id)}
                                        disabled={loading}
                                    >
                                        <i className="fa fa-trash"></i>Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {users.length === 0 && !loading && 
                <div className="alert alert-info text-center mt-4">Aucun utilisateur trouvé.</div>
            }
        </div>
    );
}

export default UsersPage;
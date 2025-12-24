import React, { useEffect, useState } from 'react';
import { createMessage } from '../services/MessageService';
import { listUsers } from '../services/UserService';

const NewMessageComponent = ({ onMessageCreated }) => {
    
    const [users, setUsers] = useState([]);
    const [recipientId, setRecipientId] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);


    // Charger les utilisateurs au montage du composant
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await listUsers();
                console.log("USERS RESPONSE =", res.data);

                const userData = res.data.content || res.data || []

                const currentUserId = Number(localStorage.getItem("userId"));

                const filteredAndSortedUsers = userData
                    .filter(u => u.id !== currentUserId)
                    .sort((a, b) =>
                        a.lastName.localeCompare(b.lastName)
                    );

                setUsers(filteredAndSortedUsers);

            } catch (error) {
                console.error("Erreur chargement utilisateurs", error);
                setUsers([]);
            }
        };

        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!recipientId || !content) return;

        setLoading(true);
        try {
            await createMessage({ 
                recipientId: parseInt(recipientId), 
                content 
            });
            setRecipientId('');
            setContent('');
            // Informe le parent qu'un nouveau message existe
            if (onMessageCreated) onMessageCreated();
        } catch (error) {
            console.error("Erreur création:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card shadow mb-4">
            <div className="card-header bg-success text-white">Nouveau Message</div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label small fw-bold">Destinataire</label>
                        <select 
                            className="form-select" 
                            value={recipientId}
                            onChange={(e) => setRecipientId(e.target.value)}
                            required
                        >
                            <option value="">
                                {users.length === 0 ? "Chargement des utilisateurs..." : "Sélectionnez un utilisateur..."}
                            </option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.firstName && user.lastName
                                        ? `${user.firstName} ${user.lastName}`
                                        : user.email}
                                    
                                    {/* Affichage des rôles entre parenthèses */}
                                    {user.roles && user.roles.length > 0 && 
                                        ` (${user.roles.map(r => r.replace('ROLE_', '')).join(', ')})`
                                    }
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label small fw-bold">Message</label>
                        <textarea 
                            className="form-control" 
                            rows="3"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100" disabled={loading}   >
                        {loading ? 'Envoi...' : 'Envoyer'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewMessageComponent;
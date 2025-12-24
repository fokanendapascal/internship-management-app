import React, { useCallback, useEffect, useState } from 'react';
import { deleteMessage, listMessages, updateMessage } from '../services/MessageService';
import { useNavigate } from 'react-router-dom';

const MessagesPage = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 5;

    const navigate = useNavigate();

    const loadMessages = useCallback(async () => {
        setLoading(true);
        try {
            const res = await listMessages(currentPage, pageSize);
            setMessages(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error("Erreur lors du chargement des messages", error);
        } finally {
            setLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        loadMessages();
    }, [loadMessages]);
    
    const handleDelete = async (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer ce message ?")) {
            try {
                await deleteMessage(id);
                if (messages.length === 1 && currentPage > 0) {
                    setCurrentPage(currentPage - 1);
                } else {
                    loadMessages();
                }
            } catch (error) {
                console.error("Erreur suppression", error);
            }
        }
    };

    const markAsRead = async (id) => {
        try {
            await updateMessage(id, { isRead: true });
            setMessages(messages.map(msg => 
                msg.id === id ? { ...msg, isRead: true } : msg
            ));
        } catch (error) {
            console.error("Erreur mise à jour :", error);
        }
    };

    const addNewMessage = () => navigate('/messages/new');
    const editMessage = (id) => navigate(`/messages/edit/${id}`);

    if (loading) return <div className="text-center p-5">Chargement...</div>;   

    return (
        <div className="container py-4">
            <div className="card shadow">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Boîte de réception</h5>
                    <div>
                        <button className="btn btn-light btn-sm me-2" onClick={loadMessages}>
                            <i className="bi bi-arrow-clockwise"></i> Actualiser
                        </button>
                        <button className="btn btn-success btn-sm" onClick={addNewMessage}>
                            <i className="bi bi-plus-lg"></i> Nouveau Message
                        </button>
                    </div>
                </div>
                
                <ul className="list-group list-group-flush">
                    {messages.length === 0 ? (
                        <li className="list-group-item text-center py-5 text-muted">
                            Aucun message trouvé.
                        </li>
                    ) : (
                        messages.map(msg => (
                            <li key={msg.id} className={`list-group-item ${!msg.isRead ? 'bg-light border-left-primary' : ''}`}>
                                <div className="d-flex justify-content-between align-items-start">
                                    <div style={{ flex: 1 }}>
                                        <div className="d-flex align-items-center mb-1">
                                            {/* Correction : msg.sender est un objet selon votre DTO */}
                                            <span className="fw-bold text-dark">
                                                {msg.sender?.username || "Système"}
                                            </span>
                                            <i className="bi bi-arrow-right mx-2 text-muted small"></i>
                                            <span className="text-muted small">
                                                Vers: {msg.recipient?.username}
                                            </span>
                                            {!msg.isRead && <span className="badge bg-primary ms-2">Nouveau</span>}
                                        </div>
                                        <p className="mb-1 text-secondary">{msg.content}</p>
                                        <small className="text-muted d-block">
                                            {/* Utilisation de sentDate du DTO */}
                                            Envoyé le {new Date(msg.sentDate).toLocaleString()}
                                        </small>
                                    </div>
                                    <div className="btn-group ms-3">
                                        {!msg.isRead && (
                                            <button className="btn btn-sm btn-outline-success" onClick={() => markAsRead(msg.id)} title="Marquer comme lu">
                                                <i className="bi bi-check2-circle"></i>
                                            </button>
                                        )}
                                        <button className="btn btn-sm btn-outline-warning" onClick={() => editMessage(msg.id)}>
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(msg.id)}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="card-footer d-flex justify-content-center">
                        <nav>
                            <ul className="pagination mb-0">
                                <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Précédent</button>
                                </li>
                                {[...Array(totalPages)].map((_, i) => (
                                    <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => setCurrentPage(i)}>{i + 1}</button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Suivant</button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MessagesPage;
import React, { useState } from 'react';
import { listMessages, updateMessage } from '../services/MessageService';

const MessagesPage = () => {

    const [messages, setMessages] = useState([]);

    const loadMessages = async () => {
        const res = await listMessages();
        setMessages(res.data);
    };

    const markAsRead = async (id) => {
        await updateMessage(id, { isRead: true });
        loadMessages(); // Rafraîchir
    };

    return (
        <div className="card shadow">
            <div className="card-header bg-primary text-white">Boîte de réception</div>
            <ul className="list-group list-group-flush">
                {messages.map(msg => (
                    <li key={msg.id} className={`list-group-item ${!msg.isRead ? 'bg-light font-weight-bold' : ''}`}>
                        <div className="d-flex justify-content-between">
                            <span>{msg.sender}</span>
                            <small>{msg.date}</small>
                        </div>
                        <p className="mb-1">{msg.content}</p>
                        {!msg.isRead && (
                            <button className="btn btn-sm btn-link" onClick={() => markAsRead(msg.id)}>
                                Marquer comme lu
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MessagesPage;
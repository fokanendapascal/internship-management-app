package com.techsolution.ima_backend.services.impl;

import com.techsolution.ima_backend.dtos.request.MessageRequest;
import com.techsolution.ima_backend.dtos.response.MessageResponse;
import com.techsolution.ima_backend.entities.Message;
import com.techsolution.ima_backend.entities.User;
import com.techsolution.ima_backend.exceptions.ResourceNotFoundException;
import com.techsolution.ima_backend.mappers.MessageMapper;
import com.techsolution.ima_backend.repository.MessageRepository;
import com.techsolution.ima_backend.repository.UserRepository;
import com.techsolution.ima_backend.services.AuthService;
import com.techsolution.ima_backend.services.MessageService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final AuthService authService;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional
    public MessageResponse createMessage(MessageRequest messageRequest) {

        // 1️⃣ Expéditeur (depuis le JWT)
        User sender = authService.getAuthenticatedUser();

        // 2️⃣ Destinataire (depuis l’ID)
        User recipient = userRepository.findById(messageRequest.getRecipientId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Destinataire introuvable : " + messageRequest.getRecipientId()
                ));

        if (messageRequest.getContent() == null || messageRequest.getContent().isBlank()) {
            throw new IllegalArgumentException("Le contenu du message est obligatoire");
        }

        // 3️⃣ Mapping partiel
        Message message = MessageMapper.toEntity(messageRequest);

        // 4️⃣ Associations obligatoires
        message.setSender(sender);
        message.setRecipient(recipient);

        // 5️⃣ Sauvegarde
        Message savedMessage = messageRepository.save(message);

        // Notification WebSocket pour le destinataire
        messagingTemplate.convertAndSend("/topic/messages", MessageMapper.toResponseDto(savedMessage));

        // 6️⃣ Retour DTO
        return MessageMapper.toResponseDto(savedMessage);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MessageResponse> getAllMessages(Pageable pageable) {
        Page<Message> messages = messageRepository.findAll( pageable);

        return messages.map(MessageMapper::toResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public MessageResponse getMessageById(Long messageId) {
        Message message = messageRepository.findById(messageId).orElseThrow(() ->
                new ResourceNotFoundException("Message is not exist with given id : " + messageId));

        return MessageMapper.toResponseDto(message);
    }

    @Override
    @Transactional
    public MessageResponse updateMessage(Long messageId, MessageRequest messageRequest) {

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Message not found with id : " + messageId
                        )
                );

        // 🔐 Sécurité : seul l'expéditeur peut modifier son message
        User currentUser = authService.getAuthenticatedUser();
        if (!message.getSender().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Vous ne pouvez pas modifier ce message");
        }

        if (messageRequest.getContent() == null || messageRequest.getContent().isBlank()) {
            throw new IllegalArgumentException("Le contenu du message est obligatoire");
        }

        // ✅ Mise à jour
        message.setContent(messageRequest.getContent());

        Message savedMessage = messageRepository.save(message);

        // Notification WebSocket
        messagingTemplate.convertAndSend("/topic/messages", MessageMapper.toResponseDto(savedMessage));

        return MessageMapper.toResponseDto(savedMessage);
    }

    @Override
    @Transactional
    public void deleteMessage(Long messageId) {
        Message message = messageRepository.findById(messageId).orElseThrow(() ->
                new ResourceNotFoundException("Message is not exist with given id : " + messageId));

        // 2️⃣ Vérification sécurité : seul l'expéditeur peut supprimer
        User currentUser = authService.getAuthenticatedUser();
        if (!message.getSender().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Vous ne pouvez pas supprimer ce message");
        }

        messageRepository.deleteById(messageId);

        // Notification WebSocket uniquement avec l'ID
        messagingTemplate.convertAndSend("/topic/messages/deleted", messageId);

    }

}

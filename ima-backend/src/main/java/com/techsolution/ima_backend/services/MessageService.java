package com.techsolution.ima_backend.services;

import com.techsolution.ima_backend.dtos.request.MessageRequest;
import com.techsolution.ima_backend.dtos.response.MessageResponse;

import java.util.List;

public interface MessageService {

    MessageResponse createMessage(MessageRequest messageRequest);
    List<MessageResponse> getAllMessages();
    MessageResponse getMessageById(Long messageId);
    MessageResponse updateMessage(Long messageId, MessageRequest messageRequest);
    void deleteMessage(Long messageId);
}

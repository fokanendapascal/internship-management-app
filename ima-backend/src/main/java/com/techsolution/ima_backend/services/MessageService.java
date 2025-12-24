package com.techsolution.ima_backend.services;

import com.techsolution.ima_backend.dtos.request.MessageRequest;
import com.techsolution.ima_backend.dtos.response.MessageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MessageService {

    MessageResponse createMessage(MessageRequest messageRequest);
    Page<MessageResponse> getAllMessages(Pageable pageable);
    MessageResponse getMessageById(Long messageId);
    MessageResponse updateMessage(Long messageId, MessageRequest messageRequest);
    void deleteMessage(Long messageId);
}

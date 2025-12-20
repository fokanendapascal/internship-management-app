package com.techsolution.ima_backend.services.impl;

import com.techsolution.ima_backend.dtos.request.MessageRequest;
import com.techsolution.ima_backend.dtos.response.MessageResponse;
import com.techsolution.ima_backend.entities.Message;
import com.techsolution.ima_backend.exceptions.ResourceNotFoundException;
import com.techsolution.ima_backend.mappers.MessageMapper;
import com.techsolution.ima_backend.repository.MessageRepository;
import com.techsolution.ima_backend.services.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;

    @Override
    @Transactional
    public MessageResponse createMessage(MessageRequest messageRequest) {
        Message message = MessageMapper.toEntity(messageRequest);
        Message savedMessage = messageRepository.save(message);
        return MessageMapper.toResponseDto(savedMessage);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponse> getAllMessages() {
        List<Message> messages = messageRepository.findAll();

        return messages.stream()
                .map(MessageMapper::toResponseDto)
                .collect(Collectors.toList());
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
        Message message = messageRepository.findById(messageId).orElseThrow(() ->
                new ResourceNotFoundException("Message is not exist with given id : " + messageId));

        message.setContent(messageRequest.getContent());

        Message savedMessage = messageRepository.save(message);
        return MessageMapper.toResponseDto(savedMessage);
    }

    @Override
    @Transactional
    public void deleteMessage(Long messageId) {
        Message message = messageRepository.findById(messageId).orElseThrow(() ->
                new ResourceNotFoundException("Message is not exist with given id : " + messageId));

        messageRepository.deleteById(messageId);
    }
}

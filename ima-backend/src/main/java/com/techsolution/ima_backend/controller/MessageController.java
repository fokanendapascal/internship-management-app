package com.techsolution.ima_backend.controller;

import com.techsolution.ima_backend.dtos.request.MessageRequest;
import com.techsolution.ima_backend.dtos.response.MessageResponse;
import com.techsolution.ima_backend.services.MessageService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/messages")
@Tag(name = "Messages", description = "Api de gestion des messages")
public class MessageController {

    private final MessageService messageService;

    //Build add message REST API
    @PostMapping
    public ResponseEntity<MessageResponse> createMessage(@RequestBody MessageRequest messageRequest) {
        MessageResponse savedMessage = messageService.createMessage(messageRequest);
        return new ResponseEntity<>(savedMessage, HttpStatus.CREATED);
    }

    //Build get message REST API
    @GetMapping("{id}")
    public ResponseEntity<MessageResponse> getMessageById(@PathVariable("id") Long messageId) {
        MessageResponse message = messageService.getMessageById(messageId);
        return ResponseEntity.ok(message);
    }

    //Build get all messages REST API
    @GetMapping
    public ResponseEntity<Page<MessageResponse>> getAllMessages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<MessageResponse> messages = messageService.getAllMessages(pageable);
        return ResponseEntity.ok(messages);
    }

    //Build update message REST API
    @PutMapping("{id}")
    public ResponseEntity<MessageResponse> updateMessage(@PathVariable("id") Long messageId,
                                                         @RequestBody MessageRequest messageRequest) {
        MessageResponse updatedMessage = messageService.updateMessage(messageId, messageRequest);
        return ResponseEntity.ok(updatedMessage);
    }

    //Build delete message REST API
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable("id") Long messageId) {
        messageService.deleteMessage(messageId);
        return ResponseEntity.noContent().build();
    }
}

package com.techsolution.ima_backend.controller;

import com.techsolution.ima_backend.dtos.request.MessageRequest;
import com.techsolution.ima_backend.dtos.response.MessageResponse;
import com.techsolution.ima_backend.services.MessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Contrôleur pour la gestion de la messagerie interne.
 * Gère l'envoi, la consultation paginée et la maintenance des messages entre utilisateurs.
 */
@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/messages")
@Tag(name = "Messages", description = "Api de gestion des messages (Communication interne et notifications)")
public class MessageController {

    private final MessageService messageService;

    //Build add message REST API
    @Operation(
            summary = "Envoyer un nouveau message",
            description = "Enregistre un nouveau message dans le système. Le destinataire pourra le consulter via ses notifications."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Message envoyé avec succès"),
            @ApiResponse(responseCode = "400", description = "Contenu du message ou destinataire invalide")
    })
    @PostMapping
    public ResponseEntity<MessageResponse> createMessage(@RequestBody MessageRequest messageRequest) {
        MessageResponse savedMessage = messageService.createMessage(messageRequest);
        return new ResponseEntity<>(savedMessage, HttpStatus.CREATED);
    }

    //Build get message REST API
    @Operation(summary = "Récupérer un message par son ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Message récupéré"),
            @ApiResponse(responseCode = "404", description = "Message non trouvé")
    })
    @GetMapping("{id}")
    public ResponseEntity<MessageResponse> getMessageById(
            @Parameter(description = "Identifiant unique du message") @PathVariable("id") Long messageId) {
        MessageResponse message = messageService.getMessageById(messageId);
        return ResponseEntity.ok(message);
    }

    //Build get all messages REST API
    @Operation(
            summary = "Lister tous les messages (Pagination)",
            description = "Récupère une page de messages triés par ID décroissant (les plus récents en premier)."
    )
    @GetMapping
    public ResponseEntity<Page<MessageResponse>> getAllMessages(
            @Parameter(description = "Numéro de la page (commence à 0)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Nombre de messages par page") @RequestParam(defaultValue = "10") int size ) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<MessageResponse> messages = messageService.getAllMessages(pageable);
        return ResponseEntity.ok(messages);
    }

    //Build update message REST API
    @Operation(summary = "Modifier un message existant")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Message mis à jour"),
            @ApiResponse(responseCode = "404", description = "Message introuvable")
    })
    @PutMapping("{id}")
    public ResponseEntity<MessageResponse> updateMessage(
            @PathVariable("id") Long messageId,
            @RequestBody MessageRequest messageRequest) {
        MessageResponse updatedMessage = messageService.updateMessage(messageId, messageRequest);
        return ResponseEntity.ok(updatedMessage);
    }

    //Build delete message REST API
    @Operation(
            summary = "Supprimer un message",
            description = "Supprime définitivement un message de la base de données."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Message supprimé avec succès"),
            @ApiResponse(responseCode = "404", description = "Message non trouvé")
    })
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable("id") Long messageId) {
        messageService.deleteMessage(messageId);
        return ResponseEntity.noContent().build();
    }
}

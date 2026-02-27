package com.LilawatTechBlog.Controller;

import com.LilawatTechBlog.Services.NoteService;
import com.LilawatTechBlog.Services.UserService;
import com.LilawatTechBlog.domain.dto.NoteDto;
import com.LilawatTechBlog.domain.dto.NoteRequest;
import com.LilawatTechBlog.domain.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notes")
@RequiredArgsConstructor
public class NoteController {
    private final NoteService noteService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<NoteDto>>getAllNotes(
          @RequestAttribute UUID userId,
          @RequestParam(required = false) String folder

    ) {
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(noteService.getAllNotes(user, folder));
    }

    @GetMapping("/folders")
    public ResponseEntity<List<String>>getFolders(@RequestAttribute UUID userId) {
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(noteService.getFolders(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoteDto> getNote (
            @PathVariable UUID id,
            @RequestAttribute UUID userId
    ) {
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(noteService.getNote(id, user));
    }

    @PostMapping
    public ResponseEntity<NoteDto>createNote(
            @RequestBody NoteRequest request,
            @RequestAttribute UUID userId
            ) {
        User user = userService.getUserById(userId);
        return new ResponseEntity<>(noteService.createNote(user, request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NoteDto> updateNote(
            @PathVariable UUID id,
            @RequestBody NoteRequest request,
            @RequestAttribute UUID userId
    ) {
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(noteService.updateNote(id, user, request));

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(
            @PathVariable UUID id,
            @RequestAttribute UUID userId
    ) {
        User user = userService.getUserById(userId);
        noteService.deleteNote(id, user);
        return ResponseEntity.noContent().build();
    }
}

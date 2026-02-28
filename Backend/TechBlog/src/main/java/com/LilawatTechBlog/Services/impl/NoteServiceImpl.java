package com.LilawatTechBlog.Services.impl;

import com.LilawatTechBlog.Services.NoteService;
import com.LilawatTechBlog.domain.dto.NoteDto;
import com.LilawatTechBlog.domain.dto.NoteRequest;
import com.LilawatTechBlog.domain.entity.Note;
import com.LilawatTechBlog.domain.entity.User;
import com.LilawatTechBlog.repository.NoteRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NoteServiceImpl implements NoteService {
    private final NoteRepository noteRepository;

    @Override
    @Transactional(readOnly = true)
    public List<NoteDto> getAllNotes(User user, String folder) {
       List<Note>notes;
       if (folder != null && !folder.isBlank()) {
           notes = noteRepository.findAllByOwnerAndFolderOrderByUpdatedAtDesc(user, folder);
       } else {
           notes = noteRepository.findAllByOwnerOrderByUpdatedAtDesc(user);
       }
       return notes.stream().map(this::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public NoteDto getNote(UUID id, User user) {
       Note note = noteRepository.findByIdAndOwner(id, user)
               .orElseThrow(() -> new EntityNotFoundException("Note not found"));
       return toDto(note);
    }

    @Override
    @Transactional
    public NoteDto createNote(User user, NoteRequest noteRequest) {
       Note note = Note.builder()
               .title(noteRequest.getTitle())
               .content(noteRequest.getContent())
               .tags(noteRequest.getTags() != null ? noteRequest.getTags() : new java.util.HashSet<>())
               .folder(noteRequest.getFolder())
               .owner(user)
               .build();

       return toDto(noteRepository.save(note));
    }

    @Override
    @Transactional
    public NoteDto updateNote(UUID id, User user, NoteRequest noteRequest) {
        Note note = noteRepository.findByIdAndOwner(id, user)
                .orElseThrow(() -> new EntityNotFoundException("Note not found"));

        note.setTitle(noteRequest.getTitle());
        note.setContent(noteRequest.getContent());
        note.setTags(noteRequest.getTags() != null ? noteRequest.getTags() : new java.util.HashSet<>());
        note.setFolder(noteRequest.getFolder());

        return toDto(noteRepository.save(note));
    }

    @Override
    @Transactional
    public void deleteNote(UUID id, User user) {
        Note note = noteRepository.findByIdAndOwner(id, user)
                .orElseThrow(() -> new EntityNotFoundException("Note not found"));

        noteRepository.delete(note);
    }

    @Override
    public List<String> getFolders(User user) {
        return noteRepository.findDistinctFoldersByOwner(user);
    }

    private NoteDto toDto(Note note) {
        return NoteDto.builder()
                .id(note.getId())
                .title(note.getTitle())
                .content(note.getContent())
                .tags(note.getTags())
                .folder(note.getFolder())
                .createdAt(note.getCreatedAt())
                .updatedAt(note.getUpdatedAt())
                .build();
    }
}

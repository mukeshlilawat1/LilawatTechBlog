package com.LilawatTechBlog.Services;

import com.LilawatTechBlog.domain.dto.NoteDto;
import com.LilawatTechBlog.domain.dto.NoteRequest;
import com.LilawatTechBlog.domain.entity.User;

import java.util.List;
import java.util.UUID;

public interface NoteService {
    List<NoteDto> getAllNotes(User user, String folder);
    NoteDto getNote(UUID id, User user);
    NoteDto createNote(User user, NoteRequest noteRequest);
    NoteDto updateNote(UUID id, User user, NoteRequest noteRequest);
    void deleteNote(UUID id, User user);
    List<String> getFolders(User user);
}

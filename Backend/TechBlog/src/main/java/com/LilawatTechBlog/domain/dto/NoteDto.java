package com.LilawatTechBlog.domain.dto;

import lombok.*;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoteDto {
    private UUID id;
    private String title;
    private String content;
    private Set<String> tags;
    private String folder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

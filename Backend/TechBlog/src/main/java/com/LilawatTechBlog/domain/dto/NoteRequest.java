package com.LilawatTechBlog.domain.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class NoteRequest {
    private String title;
    private String content;
    private Set<String> tags;
    private String folder;
}

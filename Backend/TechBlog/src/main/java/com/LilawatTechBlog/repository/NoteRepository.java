package com.LilawatTechBlog.repository;

import com.LilawatTechBlog.domain.entity.Note;
import com.LilawatTechBlog.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface NoteRepository extends JpaRepository<Note, UUID> {
    List<Note> findAllByOwnerOrderByUpdatedAtDesc(User owner);

    List<Note> findAllByOwnerAndFolderOrderByUpdatedAtDesc(User owner, String folder);

    @Query("SELECT DISTINCT n.folder FROM Note n WHERE n.owner = :owner AND n.folder IS NOT NULL")
    List<String> findDistinctFoldersByOwner(@Param("owner") User owner);

    Optional<Note> findByIdAndOwner(UUID id, User owner);

}

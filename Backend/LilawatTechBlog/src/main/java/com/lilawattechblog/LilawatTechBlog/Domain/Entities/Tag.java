package com.lilawattechblog.LilawatTechBlog.Domain.Entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "tags")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Getter
@Setter
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Tag tag = (Tag) o;
        return Objects.equals(getId(), tag.getId()) && Objects.equals(getName(), tag.getName());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getName());
    }
}

package com.qtanime.animebackend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post extends BaseEntity {

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String thumbnail;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "topic_id")
    private Topic topic;
}
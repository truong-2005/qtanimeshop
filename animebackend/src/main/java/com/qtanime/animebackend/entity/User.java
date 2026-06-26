package com.qtanime.animebackend.entity;

import java.time.LocalDate;
import java.util.List;

import com.qtanime.animebackend.enums.Gender;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Column(
            unique = true,
            nullable = false
    )
    private String username;

    @Column(
            unique = true,
            nullable = false
    )
    private String email;

    @Column(unique = true)
    private String phone;

    private String password;

    private String fullName;

    // FILE IMAGE
    private String avatar;

    private LocalDate birthday;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private Boolean enabled;

    // OAuth2 provider: LOCAL, GOOGLE, FACEBOOK
    private String provider;

    // ID từ provider (sub của Google, id của Facebook)
    private String providerId;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orders;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Cart cart;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RefreshToken> refreshTokens;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CommentReply> commentReplies;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatMessage> chatMessages;
}
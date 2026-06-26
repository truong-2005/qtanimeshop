package com.qtanime.animebackend.security.service;

import com.qtanime.animebackend.entity.User;
import com.qtanime.animebackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService
        implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        User user = userRepository
                .findByUsernameOrEmail(username, username)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Tài khoản không tồn tại"
                        ));

        return UserDetailsImpl.build(user);
    }
}
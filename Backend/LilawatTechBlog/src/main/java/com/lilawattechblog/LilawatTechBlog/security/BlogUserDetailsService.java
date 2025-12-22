package com.lilawattechblog.LilawatTechBlog.security;

import com.lilawattechblog.LilawatTechBlog.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import com.lilawattechblog.LilawatTechBlog.Domain.Entities.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BlogUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return new BlogUserDetails(user);
    }
}

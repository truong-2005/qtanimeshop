package com.qtanime.animebackend.service.impl;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.qtanime.animebackend.dto.user.ChangePasswordRequest;
import com.qtanime.animebackend.dto.user.UpdateProfileRequest;
import com.qtanime.animebackend.dto.user.UserResponse;
import com.qtanime.animebackend.entity.Role;
import com.qtanime.animebackend.entity.User;
import com.qtanime.animebackend.enums.RoleName;
import com.qtanime.animebackend.exception.BadRequestException;
import com.qtanime.animebackend.exception.ResourceNotFoundException;
import com.qtanime.animebackend.repository.RoleRepository;
import com.qtanime.animebackend.repository.UserRepository;
import com.qtanime.animebackend.service.UserService;
import org.springframework.dao.DataIntegrityViolationException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    // =========================
    // ADMIN CRUD
    // =========================

    @Override
    public List<UserResponse> getAll() {

        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public UserResponse getById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User không tồn tại"
                        )
                );

        return mapToResponse(user);
    }

    @Override
    public User create(User user) {

        if (
                userRepository.existsByUsername(
                        user.getUsername()
                )
        ) {

            throw new BadRequestException(
                    "Username đã tồn tại"
            );
        }

        if (
                userRepository.existsByEmail(
                        user.getEmail()
                )
        ) {

            throw new BadRequestException(
                    "Email đã tồn tại"
            );
        }

        if (
                userRepository.existsByPhone(
                        user.getPhone()
                )
        ) {

            throw new BadRequestException(
                    "Số điện thoại đã tồn tại"
            );
        }

        Role role = roleRepository.findByName(
                        RoleName.CUSTOMER
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Role không tồn tại"
                        )
                );

        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );

        user.setRole(role);

        user.setEnabled(true);

        return userRepository.save(user);
    }

    @Override
    public User update(
            Long id,
            User request
    ) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User không tồn tại"
                        )
                );

        user.setFullName(
                request.getFullName()
        );

        user.setPhone(
                request.getPhone()
        );

        user.setAvatar(
                request.getAvatar()
        );

        user.setGender(
                request.getGender()
        );

        userRepository.save(user);

        return user;
    }

    @Override
    public void delete(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User không tồn tại"
                        )
                );

        try {
            userRepository.delete(user);
        } catch (DataIntegrityViolationException e) {
            throw new BadRequestException("Không thể xóa thành viên này vì đã có dữ liệu liên quan (Đơn hàng, Bình luận, ...)");
        }
    }

    // =========================
    // USER PROFILE
    // =========================

    @Override
    public UserResponse getMyProfile() {

        User user = getCurrentUser();

        return mapToResponse(user);
    }

    @Override
    public UserResponse updateProfile(
            UpdateProfileRequest request
    ) {

        User user = getCurrentUser();

        user.setFullName(
                request.getFullName()
        );

        user.setPhone(
                request.getPhone()
        );

        user.setGender(
                request.getGender()
        );

        // VALIDATE IMAGE
        if (
                request.getAvatarValidationMessage()
                        != null
        ) {

            throw new BadRequestException(
                    request.getAvatarValidationMessage()
            );
        }

        // UPLOAD IMAGE
        if (
                request.getAvatar() != null
                        &&
                        !request.getAvatar().isEmpty()
        ) {

            user.setAvatar(
                    uploadAvatar(
                            request.getAvatar()
                    )
            );
        }

        userRepository.save(user);

        return mapToResponse(user);
    }

    @Override
    public void changePassword(
            ChangePasswordRequest request
    ) {

        User user = getCurrentUser();

        boolean isMatch =
                passwordEncoder.matches(
                        request.getOldPassword(),
                        user.getPassword()
                );

        if (!isMatch) {

            throw new BadRequestException(
                    "Mật khẩu cũ không chính xác"
            );
        }

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);
    }

    // =========================
    // UPLOAD AVATAR
    // =========================

    private String uploadAvatar(
            MultipartFile file
    ) {

        try {

            if (
                    file == null
                            ||
                            file.isEmpty()
            ) {

                return null;
            }

            File folder =
                    new File(
                            "uploads/users"
                    );

            if (!folder.exists()) {

                folder.mkdirs();
            }

            String fileName =
                    UUID.randomUUID()
                            +
                            "_"
                            +
                            file.getOriginalFilename();

            File destination =
                    new File(folder.getAbsolutePath(), fileName);

            file.transferTo(destination);

            return "/uploads/users/"
                    +
                    fileName;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Upload ảnh đại diện thất bại"
            );
        }
    }

    // =========================
    // GET CURRENT USER
    // =========================

    private User getCurrentUser() {

        String username =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        return userRepository.findByUsername(
                        username
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User không tồn tại"
                        )
                );
    }

    // =========================
    // MAP RESPONSE
    // =========================

    private UserResponse mapToResponse(
            User user
    ) {

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .avatar(user.getAvatar())
                .gender(
                        user.getGender() != null
                                ? user.getGender().name()
                                : null
                )
                .role(
                        user.getRole() != null
                                ? user.getRole()
                                .getName()
                                .name()
                                : null
                )
                .build();
    }
}
package com.yaritrip.backend.repository;

import com.yaritrip.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    Optional<User> findByEmailOrMobile(String email, String mobile);

    boolean existsByEmail(String email);

    boolean existsByMobile(String mobile);
}

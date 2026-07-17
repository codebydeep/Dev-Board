package com.devboard.auth;
import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
interface UserRepository extends JpaRepository<User,Long> { Optional<User> findByEmail(String email); }
interface ApiKeyRepository extends JpaRepository<ApiKey,Long> {
    Optional<ApiKey> findByKeyHashAndRevokedAtIsNull(String hash);
    List<ApiKey> findByUserIdOrderByCreatedAtDesc(Long userId);
}

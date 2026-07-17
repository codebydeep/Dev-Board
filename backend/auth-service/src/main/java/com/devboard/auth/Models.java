package com.devboard.auth;
import jakarta.persistence.*; import java.time.Instant;
@Entity @Table(name="users") class User { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) Long id; @Column(nullable=false) String name; @Column(nullable=false,unique=true) String email; @Column(nullable=false) String passwordHash; Instant createdAt=Instant.now(); }
@Entity @Table(name="api_keys") class ApiKey { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) Long id; @Column(nullable=false,unique=true,length=64) String keyHash; @Column(nullable=false) Long userId; Instant createdAt=Instant.now(); Instant revokedAt; }

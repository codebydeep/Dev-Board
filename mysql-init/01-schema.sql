-- DevBoard database initialisation
-- Runs once when the MySQL container is first created.
-- Spring Boot's ddl-auto=update will keep columns in sync after this.

CREATE DATABASE IF NOT EXISTS devboard
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE devboard;

-- ── Users ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            BIGINT       NOT NULL AUTO_INCREMENT,
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── API keys ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS api_keys (
  id          BIGINT      NOT NULL AUTO_INCREMENT,
  key_hash    VARCHAR(64) NOT NULL,
  user_id     BIGINT      NOT NULL,
  created_at  DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  revoked_at  DATETIME(6)          DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_api_keys_hash (key_hash),
  KEY idx_api_keys_user (user_id),
  CONSTRAINT fk_api_keys_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Projects ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id          BIGINT        NOT NULL AUTO_INCREMENT,
  owner_id    BIGINT        NOT NULL,
  title       VARCHAR(255)  NOT NULL,
  description VARCHAR(2000)          DEFAULT NULL,
  created_at  DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at  DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  deleted_at  DATETIME(6)            DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_projects_owner (owner_id),
  KEY idx_projects_deleted (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Collaborators ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS collaborators (
  id          BIGINT      NOT NULL AUTO_INCREMENT,
  project_id  BIGINT      NOT NULL,
  user_id     BIGINT      NOT NULL,
  created_at  DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  revoked_at  DATETIME(6)          DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_collabs_project (project_id),
  KEY idx_collabs_user    (user_id),
  CONSTRAINT fk_collabs_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
  CONSTRAINT fk_collabs_user    FOREIGN KEY (user_id)    REFERENCES users    (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Tasks ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id          BIGINT        NOT NULL AUTO_INCREMENT,
  project_id  BIGINT        NOT NULL,
  title       VARCHAR(255)  NOT NULL,
  description VARCHAR(2000)          DEFAULT NULL,
  status      ENUM('TODO','IN_PROGRESS','DONE') NOT NULL DEFAULT 'TODO',
  priority    ENUM('LOW','MEDIUM','HIGH')        NOT NULL DEFAULT 'MEDIUM',
  due_date    DATE                               DEFAULT NULL,
  created_at  DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at  DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  deleted_at  DATETIME(6)            DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_tasks_project (project_id),
  KEY idx_tasks_status  (status),
  KEY idx_tasks_deleted (deleted_at),
  CONSTRAINT fk_tasks_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

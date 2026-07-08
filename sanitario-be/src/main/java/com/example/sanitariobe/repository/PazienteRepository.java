package com.example.sanitariobe.repository;

import com.example.sanitariobe.entity.Paziente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PazienteRepository extends JpaRepository<Paziente, Long> {
    Optional<Paziente> findByEmail(String email);
}


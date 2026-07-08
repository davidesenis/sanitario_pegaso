package com.example.sanitariobe.service;

import com.example.sanitariobe.entity.Paziente;
import com.example.sanitariobe.repository.PazienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PazienteService {

    private final PazienteRepository pazienteRepository;
    private final PasswordEncoder passwordEncoder;

    public List<Paziente> findAll() {
        return pazienteRepository.findAll();
    }

    public Optional<Paziente> findById(Long id) {
        return pazienteRepository.findById(id);
    }

    public Paziente save(Paziente paziente) {
        // Hash della password se non è già hashata
        if (paziente.getPassword() != null && !paziente.getPassword().isEmpty()) {
            paziente.setPassword(passwordEncoder.encode(paziente.getPassword()));
        }
        return pazienteRepository.save(paziente);
    }

    public boolean existsByEmail(String email) {
        return pazienteRepository.findByEmail(email).isPresent();
    }


    public Optional<Paziente> login(String email, String password) {
        Optional<Paziente> paziente = pazienteRepository.findByEmail(email);
        if (paziente.isPresent() && passwordEncoder.matches(password, paziente.get().getPassword())) {
            return paziente;
        }
        return Optional.empty();
    }
}


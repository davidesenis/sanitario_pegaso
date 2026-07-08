package com.example.sanitariobe.service;

import com.example.sanitariobe.entity.Medico;
import com.example.sanitariobe.repository.MedicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MedicoService {

    private final MedicoRepository medicoRepository;
    private final PasswordEncoder passwordEncoder;

    public List<Medico> findAll() {
        return medicoRepository.findAll();
    }


    public Optional<Medico> login(String email, String password) {
        Optional<Medico> medico = medicoRepository.findByEmail(email);
        if (medico.isPresent() && passwordEncoder.matches(password, medico.get().getPassword())) {
            return medico;
        }
        return Optional.empty();
    }
}


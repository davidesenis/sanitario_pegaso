package com.example.sanitariobe.config;

import com.example.sanitariobe.repository.MedicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final MedicoRepository medicoRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Hash delle password per i medici
        medicoRepository.findAll().forEach(medico -> {
            // Se la password non è già hashata (non inizia con $2a$, $2b$, $2y$ = BCrypt)
            if (medico.getPassword() != null && !medico.getPassword().startsWith("$2")) {
                // Genera la password di default: nome.cognome minuscolo
                String defaultPassword = (medico.getNome() + "." + medico.getCognome()).toLowerCase();
                medico.setPassword(passwordEncoder.encode(defaultPassword));
                medicoRepository.save(medico);
            }
        });
    }
}



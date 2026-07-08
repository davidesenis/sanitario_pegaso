package com.example.sanitariobe.controller;

import com.example.sanitariobe.entity.Medico;
import com.example.sanitariobe.dto.LoginRequestDto;
import com.example.sanitariobe.service.MedicoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medici")
@RequiredArgsConstructor
@Tag(name = "Medici", description = "Gestione dei professionisti sanitari")
public class MedicoController {

    private final MedicoService medicoService;

    @GetMapping
    @Operation(summary = "Ottieni tutti i medici", description = "Recupera la lista completa di tutti i medici presenti nel sistema")
    @ApiResponse(responseCode = "200", description = "Lista dei medici")
    public List<Medico> getAll() {
        return medicoService.findAll();
    }

    @PostMapping("/login")
    @Operation(summary = "Effettua il login del medico", description = "Autentica un medico con email e password")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Login completato con successo"),
        @ApiResponse(responseCode = "401", description = "Email o password non valide")
    })
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequest) {
        var medico = medicoService.login(loginRequest.getEmail(), loginRequest.getPassword());
        if (medico.isPresent()) {
            return ResponseEntity.ok(medico.get());
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email o password non valide");
    }
}


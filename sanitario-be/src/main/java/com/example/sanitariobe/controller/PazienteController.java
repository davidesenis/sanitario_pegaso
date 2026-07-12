package com.example.sanitariobe.controller;

import com.example.sanitariobe.dto.LoginRequestDto;
import com.example.sanitariobe.dto.PazienteProfiloResponseDto;
import com.example.sanitariobe.dto.PazienteSintesiResponseDto;
import com.example.sanitariobe.entity.Paziente;
import com.example.sanitariobe.service.PazienteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pazienti")
@RequiredArgsConstructor
@Tag(name = "Pazienti", description = "Gestione dei pazienti e autenticazione")
public class PazienteController {

    private final PazienteService pazienteService;

    @GetMapping
    @Operation(summary = "Ottieni tutti i pazienti", description = "Recupera la sintesi dei pazienti presenti nel sistema")
    @ApiResponse(responseCode = "200", description = "Lista sintetica dei pazienti")
    public List<PazienteSintesiResponseDto> getAll() {
        return pazienteService.findAll().stream()
                .map(PazienteSintesiResponseDto::from)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Ottieni un paziente per ID", description = "Recupera la sintesi di un paziente specifico tramite il suo ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Paziente trovato"),
        @ApiResponse(responseCode = "404", description = "Paziente non trovato")
    })
    public ResponseEntity<PazienteSintesiResponseDto> getById(@PathVariable Long id) {
        return pazienteService.findById(id)
                .map(paziente -> ResponseEntity.ok(PazienteSintesiResponseDto.from(paziente)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Registra un nuovo paziente", description = "Registra un nuovo paziente nel sistema con hashatura della password")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Paziente creato con successo"),
        @ApiResponse(responseCode = "400", description = "Dati non validi"),
        @ApiResponse(responseCode = "409", description = "Email già registrata")
    })
    public ResponseEntity<?> create(@RequestBody Paziente paziente) {
        if (pazienteService.existsByEmail(paziente.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email già registrata");
        }
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(PazienteProfiloResponseDto.from(pazienteService.save(paziente)));
    }

    @PostMapping("/login")
    @Operation(summary = "Effettua il login", description = "Autentica un paziente con email e password")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Login completato con successo"),
        @ApiResponse(responseCode = "401", description = "Email o password non valide")
    })
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequest) {
        var paziente = pazienteService.login(loginRequest.getEmail(), loginRequest.getPassword());
        if (paziente.isPresent()) {
            return ResponseEntity.ok(PazienteProfiloResponseDto.from(paziente.get()));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email o password non valide");
    }

}


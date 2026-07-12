package com.example.sanitariobe.dto;

import com.example.sanitariobe.entity.Paziente;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PazienteSintesiResponseDto {

    private Long id;
    private String nome;
    private String cognome;

    public static PazienteSintesiResponseDto from(Paziente paziente) {
        return new PazienteSintesiResponseDto(
                paziente.getId(),
                paziente.getNome(),
                paziente.getCognome()
        );
    }
}
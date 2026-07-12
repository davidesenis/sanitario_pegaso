package com.example.sanitariobe.dto;

import com.example.sanitariobe.entity.Medico;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicoDirectoryResponseDto {

    private Long id;
    private String nome;
    private String cognome;
    private String numeroTelefono;
    private String reparto;

    public static MedicoDirectoryResponseDto from(Medico medico) {
        return new MedicoDirectoryResponseDto(
                medico.getId(),
                medico.getNome(),
                medico.getCognome(),
                medico.getNumeroTelefono(),
                medico.getReparto()
        );
    }
}
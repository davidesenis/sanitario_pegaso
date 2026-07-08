package com.example.sanitariobe.entity;

import javax.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "prenotazione")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prenotazione {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "paziente_id", nullable = false)
    private Paziente paziente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "medico_id", nullable = false)
    private Medico medico;

    @Column(name = "data_ora", nullable = false)
    private LocalDateTime dataOra;

    @Column(name = "stato", nullable = false)
    @Enumerated(EnumType.STRING)
    private StatoPrenotazione stato = StatoPrenotazione.IN_ATTESA;
}



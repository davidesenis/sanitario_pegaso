package com.example.sanitariobe.repository;

import com.example.sanitariobe.entity.Prenotazione;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PrenotazioneRepository extends JpaRepository<Prenotazione, Long> {
    List<Prenotazione> findByPazienteId(Long pazienteId);
    List<Prenotazione> findByMedicoId(Long medicoId);
    boolean existsByMedicoIdAndDataOra(Long medicoId, LocalDateTime dataOra);
    List<Prenotazione> findByMedicoIdAndDataOraBetween(Long medicoId, LocalDateTime start, LocalDateTime end);

    @Query("SELECT p FROM Prenotazione p JOIN FETCH p.paziente JOIN FETCH p.medico WHERE p.id = :id")
    Optional<Prenotazione> findByIdWithJoin(@Param("id") Long id);
}


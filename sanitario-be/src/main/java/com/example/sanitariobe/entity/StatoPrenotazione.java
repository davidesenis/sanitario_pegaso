package com.example.sanitariobe.entity;

public enum StatoPrenotazione {
    IN_ATTESA("In Attesa"),
    CONFERMATA("Confermata"),
    RIFIUTATA("Rifiutata");

    private final String descrizione;

    StatoPrenotazione(String descrizione) {
        this.descrizione = descrizione;
    }

    public String getDescrizione() {
        return descrizione;
    }
}


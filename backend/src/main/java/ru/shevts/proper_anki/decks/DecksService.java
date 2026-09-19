package ru.shevts.proper_anki.decks;

import jakarta.inject.Singleton;

import java.util.*;

@Singleton
public class DecksService {
    private final DeckRepository repo;

    public DecksService(DeckRepository repo) {
        this.repo = repo;
    }

    public List<Deck> all() {
        return repo.all();
    }

    public Deck create(String name) {
        if (name == null || name.isBlank()) throw new IllegalArgumentException("Deck name cannot be empty");
        return repo.create(name);
    }
}

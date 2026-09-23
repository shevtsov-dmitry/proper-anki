package ru.shevts.proper_anki.decks;

import io.micronaut.core.annotation.Introspected;

@Introspected
public record Deck(long id, String name, String createdAt) {
}

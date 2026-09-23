package ru.shevts.proper_anki.decks;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.serde.annotation.Serdeable;

@Introspected
@Serdeable
public record Deck(long id, String name, String createdAt) {
}

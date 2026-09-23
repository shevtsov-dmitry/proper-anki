package ru.shevts.proper_anki.notes;

import io.micronaut.core.annotation.Introspected;

import java.util.*;

@Introspected
public record Note(long id, long deckId, String front, String back, List<Long> flagIds, String createdAt,
                   String updatedAt) {
}

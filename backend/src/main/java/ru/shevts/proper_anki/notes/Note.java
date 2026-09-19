package ru.shevts.proper_anki.notes;

import java.util.*;

public record Note(long id, long deckId, String front, String back, List<Long> flagIds, String createdAt,
                   String updatedAt) {
}

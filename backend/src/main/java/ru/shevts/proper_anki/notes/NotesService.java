package ru.shevts.proper_anki.notes;

import jakarta.inject.Singleton;
import ru.shevts.proper_anki.decks.DeckRepository;

@Singleton
public class NotesService {
    private final NoteRepository notes;
    private final DeckRepository decks;

    public NotesService(NoteRepository n, DeckRepository d) {
        notes = n;
        decks = d;
    }

    public Note save(Request r) {
        if (r.deckId() <= 0 || decks.byId(r.deckId()).isEmpty()) throw new IllegalArgumentException("Deck not found");
        return notes.save(r.id(), r.deckId(), r.front() == null ? "" : r.front(), r.back() == null ? "" : r.back(), r.flagIds());
    }

    public Note get(long id) {
        return notes.byId(id).orElseThrow(() -> new IllegalArgumentException("Note not found"));
    }

    public record Request(Long id, long deckId, String front, String back, java.util.List<Long> flagIds) {
    }
}

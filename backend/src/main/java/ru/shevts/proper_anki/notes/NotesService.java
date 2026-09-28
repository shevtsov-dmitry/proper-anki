package ru.shevts.proper_anki.notes;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.serde.annotation.Serdeable;
import jakarta.inject.Singleton;
import ru.shevts.proper_anki.decks.DeckRepository;

import java.util.List;

@Singleton
public class NotesService {
  private final NoteRepository notes;
  private final DeckRepository decks;

  public NotesService(NoteRepository n, DeckRepository d) {
    notes = n;
    decks = d;
  }

  public Note save(Request r) {
    if (r.deckId() <= 0 || decks.byId(r.deckId()).isEmpty())
      throw new IllegalArgumentException("Deck not found");
    return notes.save(r.id(), r.deckId(), r.front() == null ? "" : r.front(), r.back() == null ? "" : r.back(),
        r.flagIds());
  }

  public Note get(long id) {
    return notes.byId(id).orElseThrow(() -> new IllegalArgumentException("Note not found"));
  }

  public List<Note> byDeck(long deckId) {
    if (deckId <= 0 || decks.byId(deckId).isEmpty())
      throw new IllegalArgumentException("Deck not found");
    return notes.byDeck(deckId);
  }

  @Introspected
  @Serdeable
  public record Request(Long id, long deckId, String front, String back, List<Long> flagIds) {
  }
}

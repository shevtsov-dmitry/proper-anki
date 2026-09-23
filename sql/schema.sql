-- Enable foreign key support in SQLite (recommended per connection)
PRAGMA foreign_keys = ON;

-- Table for Deck record
CREATE TABLE IF NOT EXISTS decks (
                                     id INTEGER PRIMARY KEY AUTOINCREMENT,
                                     name TEXT NOT NULL,
                                     created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
    );

-- Table for Note record
CREATE TABLE IF NOT EXISTS notes (
                                     id INTEGER PRIMARY KEY AUTOINCREMENT,
                                     deck_id INTEGER NOT NULL,
                                     front TEXT NOT NULL,
                                     back TEXT NOT NULL,
                                     created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
    updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
    FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
    );

-- Junction table for Note's List<Long> flagIds (Many-to-Many mapping)
CREATE TABLE IF NOT EXISTS note_flags (
                                          note_id INTEGER NOT NULL,
                                          flag_id INTEGER NOT NULL,
                                          PRIMARY KEY (note_id, flag_id),
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
    );

-- Indexes for foreign key lookup performance
CREATE INDEX IF NOT EXISTS idx_notes_deck_id ON notes(deck_id);
CREATE INDEX IF NOT EXISTS idx_note_flags_note_id ON note_flags(note_id);
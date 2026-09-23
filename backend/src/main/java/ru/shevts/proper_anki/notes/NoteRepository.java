package ru.shevts.proper_anki.notes;

import jakarta.inject.Singleton;

import javax.sql.DataSource;
import java.sql.*;
import java.util.*;

@Singleton
public class NoteRepository {
    private final DataSource ds;

    public NoteRepository(DataSource ds) {
        this.ds = ds;
    }

    public Note save(Long id, long deck, String front, String back, List<Long> flags) {
        try (Connection c = ds.getConnection()) {
            c.setAutoCommit(false);
            try {
                long noteId;
                if (id == null) {
                    try (PreparedStatement p = c.prepareStatement("INSERT INTO notes(deck_id,front,back) VALUES(?,?,?)",
                            Statement.RETURN_GENERATED_KEYS)) {
                        p.setLong(1, deck);
                        p.setString(2, front);
                        p.setString(3, back);
                        p.executeUpdate();
                        try (ResultSet r = p.getGeneratedKeys()) {
                            r.next();
                            noteId = r.getLong(1);
                        }
                    }
                } else {
                    try (PreparedStatement p = c.prepareStatement(
                            "UPDATE notes SET deck_id=?,front=?,back=?,updated_at=CURRENT_TIMESTAMP WHERE id=?")) {
                        p.setLong(1, deck);
                        p.setString(2, front);
                        p.setString(3, back);
                        p.setLong(4, id);
                        if (p.executeUpdate() == 0)
                            throw new IllegalArgumentException("Note not found");
                    }
                    noteId = id;
                }
                try (PreparedStatement p = c.prepareStatement("DELETE FROM note_flags WHERE note_id=?")) {
                    p.setLong(1, noteId);
                    p.executeUpdate();
                }
                if (flags != null)
                    try (PreparedStatement p = c
                            .prepareStatement("INSERT INTO note_flags(note_id,flag_id) VALUES(?,?)")) {
                        for (Long f : flags) {
                            p.setLong(1, noteId);
                            p.setLong(2, f);
                            p.addBatch();
                        }
                        p.executeBatch();
                    }
                c.commit();
                return byId(noteId).orElseThrow();
            } catch (Exception e) {
                c.rollback();
                throw e;
            } finally {
                c.setAutoCommit(true);
            }
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    public Optional<Note> byId(long id) {
        try (Connection c = ds.getConnection();
                PreparedStatement p = c
                        .prepareStatement("SELECT id,deck_id,front,back,created_at,updated_at FROM notes WHERE id=?")) {
            p.setLong(1, id);
            try (ResultSet r = p.executeQuery()) {
                if (!r.next())
                    return Optional.empty();
                List<Long> f = new ArrayList<>();
                try (PreparedStatement q = c.prepareStatement("SELECT flag_id FROM note_flags WHERE note_id=?")) {
                    q.setLong(1, id);
                    try (ResultSet z = q.executeQuery()) {
                        while (z.next())
                            f.add(z.getLong(1));
                    }
                }
                return Optional.of(new Note(r.getLong(1), r.getLong(2), r.getString(3), r.getString(4), f,
                        r.getString(5), r.getString(6)));
            }
        } catch (SQLException e) {
            throw new IllegalStateException(e);
        }
    }
}

package ru.shevts.proper_anki.decks;

import jakarta.inject.Singleton;

import javax.sql.DataSource;
import java.sql.*;
import java.util.*;

@Singleton
public class DeckRepository {
    private final DataSource ds;

    public DeckRepository(DataSource ds) {
        this.ds = ds;
    }

    public List<Deck> all() {
        try (Connection c = ds.getConnection(); PreparedStatement p = c.prepareStatement("SELECT id,name,created_at FROM decks ORDER BY id"); ResultSet r = p.executeQuery()) {
            List<Deck> x = new ArrayList<>();
            while (r.next()) x.add(new Deck(r.getLong(1), r.getString(2), r.getString(3)));
            return x;
        } catch (SQLException e) {
            throw new IllegalStateException(e);
        }
    }

    public Optional<Deck> byId(long id) {
        try (Connection c = ds.getConnection(); PreparedStatement p = c.prepareStatement("SELECT id,name,created_at FROM decks WHERE id=?")) {
            p.setLong(1, id);
            try (ResultSet r = p.executeQuery()) {
                return r.next() ? Optional.of(new Deck(r.getLong(1), r.getString(2), r.getString(3))) : Optional.empty();
            }
        } catch (SQLException e) {
            throw new IllegalStateException(e);
        }
    }

    public Deck create(String name) {
        try (Connection c = ds.getConnection(); PreparedStatement p = c.prepareStatement("INSERT INTO decks(name) VALUES(?)", Statement.RETURN_GENERATED_KEYS)) {
            p.setString(1, name.trim());
            p.executeUpdate();
            try (ResultSet r = p.getGeneratedKeys()) {
                r.next();
                return byId(r.getLong(1)).orElseThrow();
            }
        } catch (SQLException e) {
            throw new IllegalArgumentException("Deck name already exists or is invalid", e);
        }
    }
}

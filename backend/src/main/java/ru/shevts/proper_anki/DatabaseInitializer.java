package ru.shevts.proper_anki;

import jakarta.annotation.PostConstruct;
import jakarta.inject.Singleton;

import javax.sql.DataSource;

import io.micronaut.context.annotation.Context;

import java.nio.file.*;
import java.sql.*;

@Context
public class DatabaseInitializer {
  private final DataSource ds;

  public DatabaseInitializer(DataSource ds) {
    this.ds = ds;
  }

  @PostConstruct
  void init() throws Exception {
    try (Connection c = ds.getConnection(); Statement s = c.createStatement()) {
      s.executeUpdate(
          "CREATE TABLE IF NOT EXISTS decks(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL UNIQUE,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)");
      s.executeUpdate(
          "CREATE TABLE IF NOT EXISTS flags(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL UNIQUE)");
      s.executeUpdate(
          "CREATE TABLE IF NOT EXISTS notes(id INTEGER PRIMARY KEY AUTOINCREMENT,deck_id INTEGER NOT NULL,front TEXT NOT NULL DEFAULT '',back TEXT NOT NULL DEFAULT '',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(deck_id) REFERENCES decks(id) ON DELETE CASCADE)");
      s.executeUpdate(
          "CREATE TABLE IF NOT EXISTS note_flags(note_id INTEGER NOT NULL,flag_id INTEGER NOT NULL,PRIMARY KEY(note_id,flag_id),FOREIGN KEY(note_id) REFERENCES notes(id) ON DELETE CASCADE,FOREIGN KEY(flag_id) REFERENCES flags(id) ON DELETE CASCADE)");
    }
    Files.createDirectories(Path.of(System.getProperty("app.image-dir", "./data/images")));
  }
}

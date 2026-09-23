package ru.shevts.proper_anki;

import io.micronaut.runtime.Micronaut;

import java.io.IOException;
import java.nio.file.*;

public class Application {

  public static void main(String[] args) throws IOException {
    Micronaut.run(Application.class, args);
  }
}

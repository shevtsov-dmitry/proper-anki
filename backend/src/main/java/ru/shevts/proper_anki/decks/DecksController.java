package ru.shevts.proper_anki.decks;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.http.*;
import io.micronaut.http.annotation.*;
import io.micronaut.serde.annotation.Serdeable;

import java.util.*;

@Controller("/api/decks")
public class DecksController {
  private final DecksService s;

  public DecksController(DecksService s) {
    this.s = s;
  }

  @Get
  public List<Deck> all() {
    return s.all();
  }

  @Post
  public HttpResponse<?> create(@Body Request r) {
    try {
      return HttpResponse.created(s.create(r.name()));
    } catch (Exception e) {
      return HttpResponse.badRequest(Map.of("message", e.getMessage()));
    }
  }

  @Serdeable
  public record Request(String name) {
  }
}

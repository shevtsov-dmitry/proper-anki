package ru.shevts.proper_anki.notes;

import io.micronaut.http.*;
import io.micronaut.http.annotation.*;

import java.util.*;

@Controller("/api/notes")
public class NotesController {
    private final NotesService s;

    public NotesController(NotesService s) {
        this.s = s;
    }

    @Get("/{id}")
    public HttpResponse<?> get(long id) {
        try {
            return HttpResponse.ok(s.get(id));
        } catch (Exception e) {
            return HttpResponse.notFound(Map.of("message", e.getMessage()));
        }
    }

    @Post
    public HttpResponse<?> save(@Body NotesService.Request r) {
        try {
            return HttpResponse.ok(s.save(r));
        } catch (Exception e) {
            return HttpResponse.badRequest(Map.of("message", e.getMessage()));
        }
    }
}

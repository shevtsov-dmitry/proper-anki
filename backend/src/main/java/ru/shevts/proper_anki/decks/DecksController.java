package ru.shevts.proper_anki.decks;

import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Post;

public class DecksController {

    @Post
    public Response addDeck(String name) {

    }

    @Get
    public Response listAllDeckNames() {
    }
}

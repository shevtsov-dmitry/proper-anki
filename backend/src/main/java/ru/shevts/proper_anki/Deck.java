package ru.shevts.proper_anki;

import java.util.List;

@Entity
public class Deck {

    private Long id;
    private String name;
    private List<Note> notes;

}

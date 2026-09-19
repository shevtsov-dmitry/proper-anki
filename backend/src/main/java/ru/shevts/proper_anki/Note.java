package ru.shevts.proper_anki;

import java.util.List;

@Entity
public class Note {

    private Long id;
    private Object front; // can be any text or even with image.
    private Object back; // can be any text or even with image.
    private List<Flag> flags;

}

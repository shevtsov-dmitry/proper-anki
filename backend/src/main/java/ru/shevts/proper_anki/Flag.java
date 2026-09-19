package ru.shevts.proper_anki;

@Entity
public class Flag {
    private Long id;
    @Unique
    private String name;
}

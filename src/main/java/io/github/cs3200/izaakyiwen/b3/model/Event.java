package io.github.cs3200.izaakyiwen.b3.model;

import javax.persistence.*;
import java.util.Collection;

@Entity
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private int eventId;
    private String name;

    @ManyToMany(mappedBy = "events", fetch = FetchType.LAZY)
    private Collection<User> users;

    private Collection<Item> items;
}

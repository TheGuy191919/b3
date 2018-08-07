package io.github.cs3200.izaakyiwen.b3.model;

import net.minidev.json.annotate.JsonIgnore;

import javax.persistence.*;
import java.util.Collection;
import java.util.Date;

@Entity
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private int eventId;
    private String name;
    private Date creatTime;

    @ManyToMany(mappedBy = "events", fetch = FetchType.LAZY)
    private Collection<User> users;

    @OneToMany(mappedBy = "event",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private Collection<Item> items;
    @OneToOne(mappedBy = "event",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private Tax tax;
    @OneToOne(mappedBy = "event",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private Tip tip;
    @OneToMany(mappedBy = "event",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private Collection<Payer> payers;
}

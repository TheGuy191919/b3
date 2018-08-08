package io.github.cs3200.izaakyiwen.b3.model;

import net.minidev.json.annotate.JsonIgnore;

import javax.persistence.*;

@Entity
public class Payer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payer_id")
    private int payerId;
    private int amount;
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id")
    private Event event;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public int getPayerId() {
        return payerId;
    }

    public void setPayerId(int payerId) {
        this.payerId = payerId;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}

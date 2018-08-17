package io.github.cs3200.izaakyiwen.b3.model;

import javax.persistence.*;
import java.util.Collection;
import java.util.Date;
import java.util.Set;

@Entity
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private int eventId;
    private String name;
    private Date createTime;

    @JoinTable(
            name = "user_attend_event",
            joinColumns = @JoinColumn(
                    name = "event_id", referencedColumnName = "event_id"
            ),
            inverseJoinColumns = @JoinColumn(
                    name = "user_id", referencedColumnName = "user_id"
            )
    )
    @ManyToMany(fetch = FetchType.LAZY)
    private Set<User> users;

    @OneToMany(mappedBy = "event",
            orphanRemoval = true)
    private Set<Item> items;
    private int tax;
    private int tip;
    @OneToMany(mappedBy = "event",
            orphanRemoval = true)
    private Set<Payer> payers;

    public int getEventId() {
        return eventId;
    }

    public void setEventId(int eventId) {
        this.eventId = eventId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    public Set<Item> getItems() {
        return items;
    }

    public void setItems(Set<Item> items) {
        this.items = items;
    }

    public int getTax() {
        return tax;
    }

    public void setTax(int tax) {
        this.tax = tax;
    }

    public int getTip() {
        return tip;
    }

    public void setTip(int tip) {
        this.tip = tip;
    }

    public Set<Payer> getPayers() {
        return payers;
    }

    public void setPayers(Set<Payer> payers) {
        this.payers = payers;
    }
}

package io.github.cs3200.izaakyiwen.b3.model;

import javax.persistence.*;
import java.util.Date;

@Entity
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private int paymentId;
    private Date lastEditTime;
    private int amount;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User payerUser;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User payeeUser;

    public int getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(int paymentId) {
        this.paymentId = paymentId;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public User getPayerUser() {
        return payerUser;
    }

    public void setPayerUser(User payerUser) {
        this.payerUser = payerUser;
    }

    public User getPayeeUser() {
        return payeeUser;
    }

    public void setPayeeUser(User payeeUser) {
        this.payeeUser = payeeUser;
    }

    public Date getLastEditTime() {
        return lastEditTime;
    }

    public void setLastEditTime(Date lastEditTime) {
        this.lastEditTime = lastEditTime;
    }
}

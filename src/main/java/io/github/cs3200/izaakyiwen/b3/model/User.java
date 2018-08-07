package io.github.cs3200.izaakyiwen.b3.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.crypto.bcrypt.BCrypt;

import javax.persistence.*;
import java.security.SecureRandom;
import java.util.Collection;
import java.util.Date;
import java.util.UUID;

@Entity
public class User {
    private static final String AB = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static SecureRandom rnd = new SecureRandom();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private int userId;
    private String name;
    private String email;
    @JsonIgnore
    private String password;
    @Column(unique = true)
    private String handle;
    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_attend_event",
            joinColumns = @JoinColumn(
                    name = "user_id", referencedColumnName = "user_id"
            ),
            inverseJoinColumns = @JoinColumn(
                    name = "event_id", referencedColumnName = "event_id"
            )
    )
    private Collection<Event> events;
    @OneToMany(mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private Collection<Payment> payments;

    @JsonIgnore
    private String token;
    @JsonIgnore
    private long tokenExpiration;

    /**
     * Check if password is correct.
     * @param plainPassword Password in paintext to check.
     * @return True if password matches that is stored in database.
     */
    private boolean checkPassword(String plainPassword) {
        return BCrypt.checkpw(plainPassword, this.password);
    }

    /**
     * Get the current token if the password is valid. Token will have at least
     * 10 minutes before it expires.
     *
     * @param plainPassword Plain text password of this user.
     * @return token to access the user.
     * @throws IllegalAccessException If the password is wrong or user is disabled.
     */
    public String getToken(String plainPassword) throws IllegalAccessException {
        if (this.checkPassword(plainPassword)) {
            this.updateTokenExpiration(600000);
            return this.token;
        }
        throw new IllegalAccessException("Do not have permission to access token");
    }

    /**
     * Update the expiration of the current token or create a new one if expired.
     *
     * @param time how long until the current token expires.
     */
    private void updateTokenExpiration(long time) {
        if (this.isTokenExpired()) {
            this.token = UUID.randomUUID().toString();
        }
        this.tokenExpiration = new Date().getTime() + time;
    }

    /**
     * Check if current token is expired.
     *
     * @return true if current token is expired.
     */
    private boolean isTokenExpired() {
        return new Date().after(new Date(this.tokenExpiration));
    }

    /**
     * Set the current token as expired.
     */
    public void setTokenExpired() {
        if (!isTokenExpired()) {
            this.tokenExpiration = 0;
        }
    }

    /**
     * Check if the given token is valid. Make sure it has at least 10 minutes
     * before expiring.
     *
     * @param token String to check if it is a valid token.
     * @return true if given token is right and not expired.
     */
    public boolean validToken(String token) {
        if (!this.isTokenExpired() && this.token.equals(token)) {
            this.updateTokenExpiration(600000);
            return true;
        }
        return false;
    }

}

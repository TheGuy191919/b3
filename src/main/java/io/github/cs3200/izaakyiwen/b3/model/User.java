package io.github.cs3200.izaakyiwen.b3.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.github.cs3200.izaakyiwen.b3.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCrypt;

import javax.persistence.*;
import java.security.SecureRandom;
import java.util.Collection;
import java.util.Date;
import java.util.Set;
import java.util.UUID;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private int userId;
    private String name;
    private String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    @Column(unique = true)
    private String handle;
    @JsonIgnore
    @ManyToMany(mappedBy = "users", fetch = FetchType.LAZY)
    private Set<Event> events;
    @JsonIgnore
    @OneToMany(mappedBy = "payerUser",
            orphanRemoval = true)
    private Set<Payment> paymentsFrom;
    @JsonIgnore
    @OneToMany(mappedBy = "payeeUser",
            orphanRemoval = true)
    private Set<Payment> paymentsTo;

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
        return BCrypt.checkpw(plainPassword, this.getPassword());
    }

    /**
     * Get the current token if the password is valid. Token will have at least
     * 10 minutes before it expires.
     *
     * @param plainPassword Plain text password of this user.
     * @return token to access the user.
     * @throws IllegalAccessException If the password is wrong or user is disabled.
     */
    public String getToken(String plainPassword, UserRepository userRepository) throws IllegalAccessException {
        if (this.checkPassword(plainPassword)) {
            this.updateTokenExpiration(600000);
            userRepository.save(this);
            return this.getToken();
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
            this.setToken(UUID.randomUUID().toString());
        }
        this.setTokenExpiration(new Date().getTime() + time);
    }

    /**
     * Check if current token is expired.
     *
     * @return true if current token is expired.
     */
    public boolean isTokenExpired() {
        return new Date().after(new Date(this.getTokenExpiration()));
    }

    /**
     * Set the current token as expired.
     */
    public void setTokenExpired() {
        if (!isTokenExpired()) {
            this.setTokenExpiration(0);
        }
    }

    /**
     * Check if the given token is valid. Make sure it has at least 30 days
     * before expiring.
     *
     * @param token String to check if it is a valid token.
     * @return true if given token is right and not expired.
     */
    public boolean validToken(String token, UserRepository userRepository) {
        if (!this.isTokenExpired() && this.getToken().equals(token)) {
            this.updateTokenExpiration(2592000000L);
            userRepository.save(this);
            return true;
        }
        return false;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getHandle() {
        return handle;
    }

    public void setHandle(String handle) {
        this.handle = handle;
    }

    public Set<Event> getEvents() {
        return events;
    }

    public void setEvents(Set<Event> events) {
        this.events = events;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public long getTokenExpiration() {
        return tokenExpiration;
    }

    public void setTokenExpiration(long tokenExpiration) {
        this.tokenExpiration = tokenExpiration;
    }

    public Set<Payment> getPaymentsFrom() {
        return paymentsFrom;
    }

    public void setPaymentsFrom(Set<Payment> paymentsFrom) {
        this.paymentsFrom = paymentsFrom;
    }

    public Set<Payment> getPaymentsTo() {
        return paymentsTo;
    }

    public void setPaymentsTo(Set<Payment> paymentsTo) {
        this.paymentsTo = paymentsTo;
    }
}

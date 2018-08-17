package io.github.cs3200.izaakyiwen.b3.service;

import io.github.cs3200.izaakyiwen.b3.model.*;
import io.github.cs3200.izaakyiwen.b3.repository.EventRepository;
import io.github.cs3200.izaakyiwen.b3.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.Optional;
import java.util.function.Consumer;
import java.util.function.Predicate;

@RestController
@CrossOrigin(
        origins = "*")
public class EventService {

    @Autowired
    EventRepository eventRepository;
    @Autowired
    UserRepository userRepository;

    @PostMapping("/api/{token}/event")
    public ResponseEntity<Event> insertEvent(@PathVariable String token, @RequestBody Event event) {
        User dbUser = this.userRepository.findUserByToken(token);
        if (dbUser != null && dbUser.validToken(token, this.userRepository)) {
            if (event.getUsers() == null){
                event.setUsers(new HashSet<>());
            }
            event.getUsers().add(this.userRepository.findUserByToken(token));
            event.setCreateTime(new Date());
            dbUser.getEvents().add(event);
            return ResponseEntity.ok(this.eventRepository.save(event));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @GetMapping("/api/{token}/event/{eventId}")
    public ResponseEntity<Event> getEventById(@PathVariable Integer eventId, @PathVariable String token) {
        Optional<Event> dbEvent = this.eventRepository.findById(eventId);
        if (dbEvent.isPresent()) {
            Event event = dbEvent.get();
            for (User user : event.getUsers()) {
                if (user.validToken(token, this.userRepository)) {
                    return ResponseEntity.ok(event);
                }
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @PutMapping("/api/{token}/event/{eventId}")
    public ResponseEntity<Event> putEventById(@PathVariable Integer eventId, @PathVariable String token, @RequestBody Event event) {
        Optional<Event> optionalEvent = this.eventRepository.findById(eventId);
        if (optionalEvent.isPresent()) {
            Event dbEvent = optionalEvent.get();
            for (User user : dbEvent.getUsers()) {
                if (user.validToken(token, this.userRepository)) {
                    dbEvent.setName(event.getName());
                    dbEvent.setTax(event.getTax());
                    dbEvent.setTip(event.getTip());
                    return ResponseEntity.ok(this.eventRepository.save(dbEvent));
                }
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @PostMapping("/api/{token}/event/{eventId}/user/{userId}")
    public ResponseEntity<Event> addUserToEvent(@PathVariable Integer eventId, @PathVariable String token, @PathVariable Integer userId) {
        Optional<Event> optionalEvent = this.eventRepository.findById(eventId);
        if (optionalEvent.isPresent()) {
            Event dbEvent = optionalEvent.get();
            for (User user : dbEvent.getUsers()) {
                if (user.validToken(token, this.userRepository)) {
                    Optional<User> optionalUser = this.userRepository.findById(userId);
                    if (optionalUser.isPresent()) {
                        dbEvent.getUsers().add(optionalUser.get());
                        return ResponseEntity.ok(this.eventRepository.save(dbEvent));
                    }
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
                }
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    private boolean contain(Event event, User user) {
        return event.getPayers().stream().anyMatch(new Predicate<Payer>() {
            @Override
            public boolean test(Payer payer) {
                return payer.getPayerId() == user.getUserId();
            }
        }) || event.getItems().stream().anyMatch(new Predicate<Item>() {
            @Override
            public boolean test(Item item) {
                return item.getSplits().stream().anyMatch(new Predicate<Split>() {
                    @Override
                    public boolean test(Split split) {
                        return split.getUser().getUserId() == user.getUserId();
                    }
                });
            }
        });
    }

    @DeleteMapping("/api/{token}/event/{eventId}/user/{userId}")
    public void removeUserFromEvent(@PathVariable Integer eventId, @PathVariable String token, @PathVariable Integer userId) {
        Optional<Event> optionalEvent = this.eventRepository.findById(eventId);
        if (optionalEvent.isPresent()) {
            Event dbEvent = optionalEvent.get();
            for (User user : dbEvent.getUsers()) {
                if (user.validToken(token, this.userRepository) && !this.contain(dbEvent, user)) {
                    dbEvent.getUsers().removeIf(user1 -> user1.getUserId() == userId);
                    this.eventRepository.save(dbEvent);
                    return;
                }
            }
        }
        return;
    }

    @DeleteMapping("/api/{token}/event/{eventId}")
    public void deleteEventById(@PathVariable Integer eventId, @PathVariable String token) {
        Optional<Event> optionalEvent = this.eventRepository.findById(eventId);
        if (optionalEvent.isPresent()) {
            Event dbEvent = optionalEvent.get();
            for (User user : dbEvent.getUsers()) {
                if (user.validToken(token, this.userRepository)) {
                    this.eventRepository.delete(dbEvent);
                    return;
                }
            }
        }
    }
}

package io.github.cs3200.izaakyiwen.b3.service;

import io.github.cs3200.izaakyiwen.b3.model.Event;
import io.github.cs3200.izaakyiwen.b3.model.User;
import io.github.cs3200.izaakyiwen.b3.repository.EventRepository;
import io.github.cs3200.izaakyiwen.b3.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Optional;

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
            event.getUsers().add(this.userRepository.findUserByToken(token));
            event.setCreatTime(new Date());
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
                    event.setEventId(dbEvent.getEventId());
                    event.setCreatTime(dbEvent.getCreatTime());
                    return ResponseEntity.ok(this.eventRepository.save(event));
                }
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
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

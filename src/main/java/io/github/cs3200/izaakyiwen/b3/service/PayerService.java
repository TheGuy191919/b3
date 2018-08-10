package io.github.cs3200.izaakyiwen.b3.service;

import io.github.cs3200.izaakyiwen.b3.model.Event;
import io.github.cs3200.izaakyiwen.b3.model.Payer;
import io.github.cs3200.izaakyiwen.b3.model.User;
import io.github.cs3200.izaakyiwen.b3.repository.EventRepository;
import io.github.cs3200.izaakyiwen.b3.repository.PayerRepository;
import io.github.cs3200.izaakyiwen.b3.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin(
        origins = "*")
public class PayerService {
    @Autowired
    EventRepository eventRepository;
    @Autowired
    PayerRepository payerRepository;
    @Autowired
    UserRepository userRepository;

    @PostMapping("/api/{token}/event/{eventId}/payer")
    public ResponseEntity<Payer> insertPayer(@PathVariable String token, @PathVariable int eventId, @RequestBody Payer payer) {
        Optional<Event> dbEvent = this.eventRepository.findById(eventId);
        if (dbEvent.isPresent()) {
            Event event = dbEvent.get();
            for (User user : event.getUsers()) {
                if (user.validToken(token, this.userRepository)) {
                    payer.setEvent(event);
                    payer.setUser(user);
                    return ResponseEntity.ok(this.payerRepository.save(payer));
                }
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @GetMapping("/api/{token}/payer/{payerId}")
    public ResponseEntity<Payer> getPayerById(@PathVariable Integer payerId, @PathVariable String token) {
        Optional<Payer> optionalPayer = this.payerRepository.findById(payerId);
        if (optionalPayer.isPresent()) {
            Payer dbPayer = optionalPayer.get();
            for (User user : dbPayer.getEvent().getUsers()) {
                if (user.validToken(token, this.userRepository)) {
                    return ResponseEntity.ok(dbPayer);
                }
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @PutMapping("/api/{token}/payer/{payerId}")
    public ResponseEntity<Payer> putPayerById(@PathVariable Integer payerId, @PathVariable String token, @RequestBody Payer payer) {
        Optional<Payer> optionalPayer = this.payerRepository.findById(payerId);
        if (optionalPayer.isPresent()) {
            Payer dbPayer = optionalPayer.get();
            for (User user : dbPayer.getEvent().getUsers()) {
                if (user.validToken(token, this.userRepository)) {
                    payer.setPayerId(dbPayer.getPayerId());
                    payer.setUser(dbPayer.getUser());
                    payer.setEvent(dbPayer.getEvent());
                    return ResponseEntity.ok(this.payerRepository.save(payer));
                }
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @DeleteMapping("/api/{token}/payer/{payerId}")
    public void deleteEventById(@PathVariable Integer payerId, @PathVariable String token) {
        Optional<Payer> optionalPayer = this.payerRepository.findById(payerId);
        if (optionalPayer.isPresent()) {
            Payer dbPayer = optionalPayer.get();
            for (User user : dbPayer.getEvent().getUsers()) {
                if (user.validToken(token, this.userRepository)) {
                    this.payerRepository.delete(dbPayer);
                    return;
                }
            }
        }
    }
}

package io.github.cs3200.izaakyiwen.b3.service;

import io.github.cs3200.izaakyiwen.b3.model.Event;
import io.github.cs3200.izaakyiwen.b3.model.Item;
import io.github.cs3200.izaakyiwen.b3.model.User;
import io.github.cs3200.izaakyiwen.b3.repository.EventRepository;
import io.github.cs3200.izaakyiwen.b3.repository.ItemRepository;
import io.github.cs3200.izaakyiwen.b3.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin(
        origins = "*")
public class ItemService {

    @Autowired
    EventRepository eventRepository;
    @Autowired
    ItemRepository itemRepository;
    @Autowired
    UserRepository userRepository;

    @PostMapping("/api/{token}/event/{eventId}/item")
    public ResponseEntity<Item> insertItem(@PathVariable String token, @PathVariable int eventId, @RequestBody Item item) {
        Optional<Event> dbEvent = this.eventRepository.findById(eventId);
        if (dbEvent.isPresent()) {
            Event event = dbEvent.get();
            for (User user : event.getUsers()) {
                if (user.validToken(token, this.userRepository)) {
                    item.setEvent(event);
                    return ResponseEntity.ok(this.itemRepository.save(item));
                }
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @GetMapping("/api/{token}/item/{itemId}")
    public ResponseEntity<Item> getItemById(@PathVariable Integer itemId, @PathVariable String token) {
        Optional<Item> optionalItem = this.itemRepository.findById(itemId);
        if (optionalItem.isPresent()) {
            Item dbItem = optionalItem.get();
            for (User user : dbItem.getEvent().getUsers()) {
                if (user.validToken(token, this.userRepository)) {
                    return ResponseEntity.ok(dbItem);
                }
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @PutMapping("/api/{token}/item/{itemId}")
    public ResponseEntity<Item> putItemById(@PathVariable Integer itemId, @PathVariable String token, @RequestBody Item item) {
        Optional<Item> optionalItem = this.itemRepository.findById(itemId);
        if (optionalItem.isPresent()) {
            Item dbItem = optionalItem.get();
            for (User user : dbItem.getEvent().getUsers()) {
                if (user.validToken(token, this.userRepository)) {
                    dbItem.setName(item.getName());
                    dbItem.setPrice(item.getPrice());
                    return ResponseEntity.ok(this.itemRepository.save(dbItem));
                }
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @DeleteMapping("/api/{token}/item/{itemId}")
    public void deleteEventById(@PathVariable Integer itemId, @PathVariable String token) {
        Optional<Item> optionalItem = this.itemRepository.findById(itemId);
        if (optionalItem.isPresent()) {
            Item dbItem = optionalItem.get();
            for (User user : dbItem.getEvent().getUsers()) {
                if (user.validToken(token, this.userRepository)) {
                    this.itemRepository.delete(dbItem);
                    return;
                }
            }
        }
    }
}

package io.github.cs3200.izaakyiwen.b3.service;

import io.github.cs3200.izaakyiwen.b3.model.Item;
import io.github.cs3200.izaakyiwen.b3.model.Split;
import io.github.cs3200.izaakyiwen.b3.model.User;
import io.github.cs3200.izaakyiwen.b3.repository.ItemRepository;
import io.github.cs3200.izaakyiwen.b3.repository.SplitRepository;
import io.github.cs3200.izaakyiwen.b3.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin(
        origins = "*")
public class SplitService {
    @Autowired
    ItemRepository itemRepository;
    @Autowired
    SplitRepository splitRepository;
    @Autowired
    UserRepository userRepository;

    @PostMapping("/api/{token}/item/{itemId}/split")
    public ResponseEntity<Split> insertSplit(@PathVariable String token, @PathVariable int itemId, @RequestBody Split split) {
        Optional<Item> optionalItem = this.itemRepository.findById(itemId);
        if (optionalItem.isPresent()) {
            Item item = optionalItem.get();
            for (User user : item.getEvent().getUsers()) {
                if (user.validToken(token, this.userRepository)) {
                    split.setItem(item);
                    return ResponseEntity.ok(this.splitRepository.save(split));
                }
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @GetMapping("/api/{token}/split/{splitId}")
    public ResponseEntity<Split> getSplitById(@PathVariable Integer splitId, @PathVariable String token) {
        Optional<Split> optionalSplit = this.splitRepository.findById(splitId);
        if (optionalSplit.isPresent()) {
            Split dbSplit = optionalSplit.get();
            for (User user : dbSplit.getItem().getEvent().getUsers()) {
                if (user.validToken(token, this.userRepository)) {
                    return ResponseEntity.ok(dbSplit);
                }
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @PutMapping("/api/{token}/split/{splitId}")
    public ResponseEntity<Split> putSplitById(@PathVariable Integer splitId, @PathVariable String token, @RequestBody Split split) {
        Optional<Split> optionalSplit = this.splitRepository.findById(splitId);
        if (optionalSplit.isPresent()) {
            Split dbSplit = optionalSplit.get();
            for (User user : dbSplit.getItem().getEvent().getUsers()) {
                if (user.validToken(token, this.userRepository)) {
                    dbSplit.setWeight(split.getWeight());
                    return ResponseEntity.ok(this.splitRepository.save(dbSplit));
                }
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @DeleteMapping("/api/{token}/split/{splitId}")
    public void deleteSplitById(@PathVariable Integer splitId, @PathVariable String token) {
        Optional<Split> optionalSplit = this.splitRepository.findById(splitId);
        if (optionalSplit.isPresent()) {
            Split dbSplit = optionalSplit.get();
            for (User user : dbSplit.getItem().getEvent().getUsers()) {
                if (user.validToken(token, this.userRepository)) {
                    this.splitRepository.delete(dbSplit);
                    return;
                }
            }
        }
    }
}

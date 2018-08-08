package io.github.cs3200.izaakyiwen.b3.service;

import io.github.cs3200.izaakyiwen.b3.model.User;
import io.github.cs3200.izaakyiwen.b3.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(
        origins = "*")
public class UserService {

    @Autowired
    UserRepository userRepository;

    @PostMapping("/api/user")
    public ResponseEntity<String> createUser(@RequestBody User user) {
        String plainPassword = user.getPassword();
        user.setPassword(BCrypt.hashpw(plainPassword, BCrypt.gensalt()));
        try {
            user = userRepository.save(user);
            String token = user.getToken(plainPassword, this.userRepository);
            userRepository.save(user);
            return ResponseEntity.ok(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
    @PostMapping("/api/{token}/user")
    public ResponseEntity<String> createUserToken(@RequestBody User user) {
        return this.createUser(user);
    }

    @GetMapping("/api/{token}/user")
    public List<User> findAllUsers() {
        List<User> users = new ArrayList<>();
        userRepository.findAll().forEach(users::add);
        return users;
    }

    @GetMapping("/api/{token}/user/{userId}")
    public ResponseEntity<User> findUserById(@PathVariable Integer userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @PutMapping("/api/{token}/user/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable Integer userId, @PathVariable String token, @RequestBody User user) {
        Optional<User> oldUser = userRepository.findById(userId);
        if (oldUser.isPresent() && oldUser.get().validToken(token, this.userRepository)) {
            User dbUser = oldUser.get();
            dbUser.setEmail(user.getEmail());
            dbUser.setName(user.getName());
            return ResponseEntity.ok(userRepository.save(dbUser));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @DeleteMapping("/api/{token}/user/{userId}")
    public void deleteUser(@PathVariable Integer userId, @PathVariable String token) {
        Optional<User> oldUser = userRepository.findById(userId);
        if (oldUser.isPresent() && oldUser.get().validToken(token, this.userRepository)) {
            userRepository.deleteById(userId);
        }
    }

    @GetMapping(value = "/api/{token}/user", params = "handle")
    public ResponseEntity<User> findUserByHandle(@RequestParam("handle")String handle) {
        User user = this.userRepository.findUserByHandle(handle);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        return ResponseEntity.ok(user);
    }

    @GetMapping(value = "/api/{token}/user", params = "token")
    public ResponseEntity<User> findUserByToken(@RequestParam("token")String token) {
        User user = this.userRepository.findUserByToken(token);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        return ResponseEntity.ok(user);
    }

    @PostMapping("/api/user/login")
    public ResponseEntity<String> login(@RequestBody User user) {
        User dbUser = this.userRepository.findUserByHandle(user.getHandle());
        if (dbUser != null) {
            try {
                String token = dbUser.getToken(user.getPassword(), this.userRepository);
                userRepository.save(dbUser);
                return ResponseEntity.ok(token);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @PostMapping("/api/{token}/user/login")
    public ResponseEntity<String> loginToken(@RequestBody User user) {
        return this.login(user);
    }

    @PostMapping("/api/{token}/user/logout")
    public void logout(@RequestBody User user) {
        Optional<User> dbUser = this.userRepository.findById(user.getUserId());
        if (dbUser.isPresent()) {
            dbUser.get().setTokenExpired();
            this.userRepository.save(dbUser.get());
        }
    }
}

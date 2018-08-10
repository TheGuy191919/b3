package io.github.cs3200.izaakyiwen.b3.repository;

import io.github.cs3200.izaakyiwen.b3.model.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Integer> {
    User findUserByHandle(String handle);
    User findUserByToken(String token);
}

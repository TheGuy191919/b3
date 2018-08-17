package io.github.cs3200.izaakyiwen.b3.repository;

import io.github.cs3200.izaakyiwen.b3.model.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRepository extends CrudRepository<User, Integer> {
    User findUserByHandle(String handle);
    User findUserByToken(String token);
    //HQL query to find users that have attended the same event before as given user
    @Query("SELECT DISTINCT u2 " +
            "FROM User u2 " +
            "RIGHT JOIN u2.events e2 " +
            "WHERE e2 IN (SELECT e1 " +
            "             FROM User u1 " +
            "             LEFT JOIN u1.events e1 " +
            "             WHERE u1.userId = :id) " +
            "AND u2.userId != :id " +
            "ORDER BY u2.handle")
    List<User> suggestUser(@Param("id") int id);
}

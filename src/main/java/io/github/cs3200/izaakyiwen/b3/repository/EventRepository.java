package io.github.cs3200.izaakyiwen.b3.repository;

import io.github.cs3200.izaakyiwen.b3.model.Event;
import org.springframework.data.repository.CrudRepository;

public interface EventRepository extends CrudRepository<Event, Integer> {
}

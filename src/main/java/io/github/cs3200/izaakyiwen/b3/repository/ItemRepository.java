package io.github.cs3200.izaakyiwen.b3.repository;

import io.github.cs3200.izaakyiwen.b3.model.Item;
import org.springframework.data.repository.CrudRepository;

public interface ItemRepository extends CrudRepository<Item, Integer> {
}

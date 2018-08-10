package io.github.cs3200.izaakyiwen.b3.repository;

import io.github.cs3200.izaakyiwen.b3.model.Payment;
import org.springframework.data.repository.CrudRepository;

public interface PaymentRepository extends CrudRepository<Payment, Integer> {
}

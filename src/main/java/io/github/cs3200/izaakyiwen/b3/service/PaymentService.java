package io.github.cs3200.izaakyiwen.b3.service;

import io.github.cs3200.izaakyiwen.b3.model.Payment;
import io.github.cs3200.izaakyiwen.b3.model.User;
import io.github.cs3200.izaakyiwen.b3.repository.PaymentRepository;
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
public class PaymentService {
    @Autowired
    PaymentRepository paymentRepository;
    @Autowired
    UserRepository userRepository;

    @PostMapping("/api/{token}/payment")
    public ResponseEntity<Payment> insertPayment(@PathVariable String token, @RequestBody Payment payment) {
        User dbUser = this.userRepository.findUserByToken(token);
        if (dbUser != null && dbUser.validToken(token)) {
            payment.setPayerUser(dbUser);
            payment.setLastEditTime(new Date());
            return ResponseEntity.ok(this.paymentRepository.save(payment));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @GetMapping("/api/{token}/payment/{paymentId}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Integer paymentId, @PathVariable String token) {
        Optional<Payment> dbPayment = this.paymentRepository.findById(paymentId);
        if (dbPayment.isPresent()) {
            Payment payment = dbPayment.get();
            if (payment.getPayeeUser().validToken(token) ||
                    payment.getPayerUser().validToken(token)) {
                return ResponseEntity.ok(payment);
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @PutMapping("/api/{token}/payment/{paymentId}")
    public ResponseEntity<Payment> putPaymentById(@PathVariable Integer paymentId, @PathVariable String token, @RequestBody Payment payment) {
        Optional<Payment> optionalPayment = this.paymentRepository.findById(paymentId);
        if (optionalPayment.isPresent()) {
            Payment dbPayment = optionalPayment.get();
            if (dbPayment.getPayerUser().validToken(token)) {
                payment.setPaymentId(dbPayment.getPaymentId());
                payment.setLastEditTime(new Date());
                return ResponseEntity.ok(this.paymentRepository.save(payment));
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @DeleteMapping("/api/{token}/payment/{paymentId}")
    public void deletePaymentById(@PathVariable Integer paymentId, @PathVariable String token) {
        Optional<Payment> optionalPayment = this.paymentRepository.findById(paymentId);
        if (optionalPayment.isPresent()) {
            Payment dbPayment = optionalPayment.get();
            if (dbPayment.getPayerUser().validToken(token)) {
                this.paymentRepository.delete(dbPayment);
                return;
            }
        }
    }
}

package com.example.grievancetrack.Controller;

import com.example.grievancetrack.Entity.Escalation;
import com.example.grievancetrack.Service.EscalationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/escalations")
public class EscalationController {

    private final EscalationService escalationService;

    public EscalationController(
            EscalationService escalationService) {

        this.escalationService = escalationService;
    }

    // Get all escalations
    @GetMapping
    public ResponseEntity<List<Escalation>> getAllEscalations() {

        List<Escalation> escalations =
                escalationService.getAllEscalations();

        return ResponseEntity.ok(escalations);
    }

    // Get escalation by ID
    @GetMapping("/{id}")
    public ResponseEntity<Escalation> getEscalationById(
            @PathVariable Long id) {

        Escalation escalation =
                escalationService.getEscalationById(id);

        return ResponseEntity.ok(escalation);
    }
}
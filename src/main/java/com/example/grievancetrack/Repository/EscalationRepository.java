package com.example.grievancetrack.Repository;

import com.example.grievancetrack.Entity.Escalation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EscalationRepository extends JpaRepository<Escalation, Long> {
}
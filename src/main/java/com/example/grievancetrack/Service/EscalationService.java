package com.example.grievancetrack.Service;

import com.example.grievancetrack.Entity.Category;
import com.example.grievancetrack.Entity.Department;
import com.example.grievancetrack.Entity.Escalation;
import com.example.grievancetrack.Entity.Grievance;
import com.example.grievancetrack.Repository.EscalationRepository;
import com.example.grievancetrack.Repository.GrievanceRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EscalationService {

    private final GrievanceRepository grievanceRepository;
    private final EscalationRepository escalationRepository;

    public EscalationService(GrievanceRepository grievanceRepository,
                             EscalationRepository escalationRepository) {

        this.grievanceRepository = grievanceRepository;
        this.escalationRepository = escalationRepository;
    }

    // ============================================================
    // CHECK SLA AND ESCALATE
    // ============================================================

    @Scheduled(fixedRate = 60000)
    public void checkSlaAndEscalate() {

        List<Grievance> grievances =
                grievanceRepository.findByStatusNot(
                        Grievance.Status.CLOSED
                );

        LocalDateTime now = LocalDateTime.now();

        for (Grievance grievance : grievances) {

            // Do not process already escalated grievances
            if (grievance.getStatus() == Grievance.Status.CLOSED ||
                    grievance.getStatus() == Grievance.Status.RESOLVED ||
                    grievance.getStatus() == Grievance.Status.ESCALATED) {

                continue;
            }

            Category category =
                    grievance.getCategory();

            if (category == null ||
                    category.getSlaDays() == null) {

                continue;
            }

            LocalDateTime slaDeadline =
                    grievance.getCreatedAt()
                            .plusDays(category.getSlaDays());

            // Check whether SLA has expired
            if (now.isAfter(slaDeadline)) {

                escalateGrievance(grievance);
            }
        }
    }


    // ============================================================
    // ESCALATE GRIEVANCE
    // ============================================================

    public Escalation escalateGrievance(
            Grievance grievance) {

        Category category =
                grievance.getCategory();

        Department department =
                category.getDepartment();

        if (department == null) {

            throw new IllegalArgumentException(
                    "Department is not assigned to this category"
            );
        }

        if (department.getSeniorOfficerName() == null ||
                department.getSeniorOfficerName()
                        .trim()
                        .isEmpty()) {

            throw new IllegalArgumentException(
                    "Senior officer is not assigned"
            );
        }

        // Create escalation record
        Escalation escalation =
                new Escalation();

        escalation.setGrievance(grievance);

        escalation.setEscalatedTo(
                department.getSeniorOfficerName()
        );

        escalation.setEscalatedAt(
                LocalDateTime.now()
        );

        // Update grievance status
        grievance.setStatus(
                Grievance.Status.ESCALATED
        );

        grievanceRepository.save(grievance);

        return escalationRepository.save(
                escalation
        );
    }


    // ============================================================
    // GET ALL ESCALATIONS
    // ============================================================

    public List<Escalation> getAllEscalations() {

        return escalationRepository.findAll();
    }


    // ============================================================
    // GET ESCALATION BY ID
    // ============================================================

    public Escalation getEscalationById(Long id) {

        return escalationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Escalation not found with ID: "
                                        + id
                        )
                );
    }
}
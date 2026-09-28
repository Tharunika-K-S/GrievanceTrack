package com.example.grievancetrack.Service;

import com.example.grievancetrack.Entity.Category;
import com.example.grievancetrack.Entity.Grievance;
import com.example.grievancetrack.Repository.CategoryRepository;
import com.example.grievancetrack.Repository.GrievanceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class GrievanceService {

    private final GrievanceRepository grievanceRepository;
    private final CategoryRepository categoryRepository;

    public GrievanceService(GrievanceRepository grievanceRepository,
                            CategoryRepository categoryRepository) {

        this.grievanceRepository = grievanceRepository;
        this.categoryRepository = categoryRepository;
    }

    // ============================================================
    // CREATE GRIEVANCE
    // ============================================================

    public Grievance createGrievance(Grievance grievance) {

        // Validate citizen name
        if (grievance.getCitizenName() == null ||
                grievance.getCitizenName().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Citizen name is required"
            );
        }

        // Validate description
        if (grievance.getDescription() == null ||
                grievance.getDescription().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Grievance description is required"
            );
        }

        // Validate location
        if (grievance.getLocation() == null ||
                grievance.getLocation().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Location is required"
            );
        }

        // Validate category
        if (grievance.getCategory() == null ||
                grievance.getCategory().getId() == null) {

            throw new IllegalArgumentException(
                    "Category is required"
            );
        }

        // Find category from database
        Optional<Category> category =
                categoryRepository.findById(
                        grievance.getCategory().getId()
                );

        if (category.isEmpty()) {

            throw new RuntimeException(
                    "Category not found with ID: "
                            + grievance.getCategory().getId()
            );
        }

        // Attach the existing category
        grievance.setCategory(category.get());

        // Initial status
        grievance.setStatus(
                Grievance.Status.SUBMITTED
        );

        // Set creation time
        grievance.setCreatedAt(
                LocalDateTime.now()
        );

        // Initially no resolution date
        grievance.setResolvedAt(null);

        // Initially no rating
        grievance.setRating(null);

        return grievanceRepository.save(grievance);
    }


    // ============================================================
    // GET ALL GRIEVANCES
    // ============================================================

    public List<Grievance> getAllGrievances() {

        return grievanceRepository.findAll();
    }


    // ============================================================
    // GET GRIEVANCE BY ID
    // ============================================================

    public Grievance getGrievanceById(Long id) {

        Optional<Grievance> grievance =
                grievanceRepository.findById(id);

        if (grievance.isEmpty()) {

            throw new RuntimeException(
                    "Grievance not found with ID: " + id
            );
        }

        return grievance.get();
    }


    // ============================================================
    // UPDATE STATUS
    // ============================================================

    public Grievance updateStatus(Long id,
                                  Grievance.Status newStatus) {

        Grievance grievance =
                getGrievanceById(id);

        if (newStatus == null) {

            throw new IllegalArgumentException(
                    "Status is required"
            );
        }

        Grievance.Status currentStatus =
                grievance.getStatus();


        // --------------------------------------------------------
        // SUBMITTED → ASSIGNED
        // --------------------------------------------------------

        if (currentStatus == Grievance.Status.SUBMITTED &&
                newStatus != Grievance.Status.ASSIGNED) {

            throw new IllegalArgumentException(
                    "SUBMITTED grievance can only move to ASSIGNED"
            );
        }


        // --------------------------------------------------------
        // ASSIGNED → IN_PROGRESS
        // --------------------------------------------------------

        if (currentStatus == Grievance.Status.ASSIGNED &&
                newStatus != Grievance.Status.IN_PROGRESS) {

            throw new IllegalArgumentException(
                    "ASSIGNED grievance can only move to IN_PROGRESS"
            );
        }


        // --------------------------------------------------------
        // IN_PROGRESS → RESOLVED
        // --------------------------------------------------------

        if (currentStatus == Grievance.Status.IN_PROGRESS &&
                newStatus != Grievance.Status.RESOLVED) {

            throw new IllegalArgumentException(
                    "IN_PROGRESS grievance can only move to RESOLVED"
            );
        }


        // --------------------------------------------------------
        // RESOLVED → CLOSED
        // --------------------------------------------------------

        if (currentStatus == Grievance.Status.RESOLVED &&
                newStatus != Grievance.Status.CLOSED) {

            throw new IllegalArgumentException(
                    "RESOLVED grievance can only move to CLOSED"
            );
        }


        // --------------------------------------------------------
        // CLOSED cannot be changed
        // --------------------------------------------------------

        if (currentStatus == Grievance.Status.CLOSED) {

            throw new IllegalArgumentException(
                    "Closed grievance cannot be modified"
            );
        }


        // --------------------------------------------------------
        // ESCALATED
        // --------------------------------------------------------

        if (currentStatus == Grievance.Status.ESCALATED &&
                newStatus != Grievance.Status.IN_PROGRESS &&
                newStatus != Grievance.Status.RESOLVED) {

            throw new IllegalArgumentException(
                    "Escalated grievance can move to IN_PROGRESS or RESOLVED"
            );
        }


        // Set resolved time
        if (newStatus == Grievance.Status.RESOLVED) {

            grievance.setResolvedAt(
                    LocalDateTime.now()
            );
        }


        grievance.setStatus(newStatus);

        return grievanceRepository.save(grievance);
    }


    // ============================================================
    // ADD CITIZEN RATING
    // ============================================================

    public Grievance addRating(Long id, Integer rating) {

        Grievance grievance =
                getGrievanceById(id);

        // Rating only after CLOSED
        if (grievance.getStatus() !=
                Grievance.Status.CLOSED) {

            throw new IllegalArgumentException(
                    "Rating can be given only after grievance is CLOSED"
            );
        }

        // Validate rating
        if (rating == null ||
                rating < 1 ||
                rating > 5) {

            throw new IllegalArgumentException(
                    "Rating must be between 1 and 5"
            );
        }

        grievance.setRating(rating);

        return grievanceRepository.save(grievance);
    }


    // ============================================================
    // DELETE GRIEVANCE
    // ============================================================

    public void deleteGrievance(Long id) {

        Grievance grievance =
                getGrievanceById(id);

        grievanceRepository.delete(grievance);
    }
}

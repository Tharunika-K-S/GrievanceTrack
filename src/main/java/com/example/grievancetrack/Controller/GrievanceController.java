package com.example.grievancetrack.Controller;

import com.example.grievancetrack.Entity.Grievance;
import com.example.grievancetrack.Service.GrievanceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grievances")
public class GrievanceController {

    private final GrievanceService grievanceService;

    public GrievanceController(GrievanceService grievanceService) {
        this.grievanceService = grievanceService;
    }

    // Create a new grievance
    @PostMapping
    public ResponseEntity<Grievance> createGrievance(
            @RequestBody Grievance grievance) {

        Grievance savedGrievance =
                grievanceService.createGrievance(grievance);

        return new ResponseEntity<>(
                savedGrievance,
                HttpStatus.CREATED
        );
    }

    // Get all grievances
    @GetMapping
    public ResponseEntity<List<Grievance>> getAllGrievances() {

        List<Grievance> grievances =
                grievanceService.getAllGrievances();

        return ResponseEntity.ok(grievances);
    }

    // Get grievance by ID
    @GetMapping("/{id}")
    public ResponseEntity<Grievance> getGrievanceById(
            @PathVariable Long id) {

        Grievance grievance =
                grievanceService.getGrievanceById(id);

        return ResponseEntity.ok(grievance);
    }

    // Update grievance status
    @PutMapping("/{id}/status")
    public ResponseEntity<Grievance> updateStatus(
            @PathVariable Long id,
            @RequestParam Grievance.Status status) {

        Grievance updatedGrievance =
                grievanceService.updateStatus(
                        id,
                        status
                );

        return ResponseEntity.ok(updatedGrievance);
    }

    // Add rating after closure
    @PutMapping("/{id}/rating")
    public ResponseEntity<Grievance> addRating(
            @PathVariable Long id,
            @RequestParam Integer rating) {

        Grievance updatedGrievance =
                grievanceService.addRating(
                        id,
                        rating
                );

        return ResponseEntity.ok(updatedGrievance);
    }

    // Delete grievance
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteGrievance(
            @PathVariable Long id) {

        grievanceService.deleteGrievance(id);

        return ResponseEntity.ok(
                "Grievance deleted successfully"
        );
    }
}
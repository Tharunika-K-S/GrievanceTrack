package com.example.grievancetrack.Repository;

import com.example.grievancetrack.Entity.Grievance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GrievanceRepository extends JpaRepository<Grievance, Long> {

    List<Grievance> findByStatusNot(Grievance.Status status);
}
package com.example.grievancetrack.Repository;

import com.example.grievancetrack.Entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
}
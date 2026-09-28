package com.example.grievancetrack.Service;

import com.example.grievancetrack.Entity.Department;
import com.example.grievancetrack.Repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    // Create a new department
    public Department createDepartment(Department department) {

        if (department.getName() == null || department.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Department name is required");
        }

        if (department.getSeniorOfficerName() == null ||
                department.getSeniorOfficerName().trim().isEmpty()) {
            throw new IllegalArgumentException("Senior officer name is required");
        }

        return departmentRepository.save(department);
    }

    // Get all departments
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    // Get department by ID
    public Department getDepartmentById(Long id) {

        Optional<Department> department =
                departmentRepository.findById(id);

        if (department.isEmpty()) {
            throw new RuntimeException("Department not found with ID: " + id);
        }

        return department.get();
    }

    // Update department
    public Department updateDepartment(Long id, Department updatedDepartment) {

        Department existingDepartment = getDepartmentById(id);

        if (updatedDepartment.getName() == null ||
                updatedDepartment.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Department name is required");
        }

        if (updatedDepartment.getSeniorOfficerName() == null ||
                updatedDepartment.getSeniorOfficerName().trim().isEmpty()) {
            throw new IllegalArgumentException("Senior officer name is required");
        }

        existingDepartment.setName(updatedDepartment.getName());
        existingDepartment.setSeniorOfficerName(
                updatedDepartment.getSeniorOfficerName()
        );

        return departmentRepository.save(existingDepartment);
    }

    // Delete department
    public void deleteDepartment(Long id) {

        Department department = getDepartmentById(id);

        departmentRepository.delete(department);
    }
}
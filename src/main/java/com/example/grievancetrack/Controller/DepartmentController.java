package com.example.grievancetrack.Controller;

import com.example.grievancetrack.Entity.Department;
import com.example.grievancetrack.Service.DepartmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    // ============================================================
    // CREATE DEPARTMENT
    // POST /api/departments
    // ============================================================

    @PostMapping
    public ResponseEntity<Department> createDepartment(
            @RequestBody Department department) {

        Department savedDepartment =
                departmentService.createDepartment(department);

        return new ResponseEntity<>(
                savedDepartment,
                HttpStatus.CREATED
        );
    }


    // ============================================================
    // GET ALL DEPARTMENTS
    // GET /api/departments
    // ============================================================

    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {

        List<Department> departments =
                departmentService.getAllDepartments();

        return ResponseEntity.ok(departments);
    }


    // ============================================================
    // GET DEPARTMENT BY ID
    // GET /api/departments/{id}
    // ============================================================

    @GetMapping("/{id}")
    public ResponseEntity<Department> getDepartmentById(
            @PathVariable Long id) {

        Department department =
                departmentService.getDepartmentById(id);

        return ResponseEntity.ok(department);
    }


    // ============================================================
    // UPDATE DEPARTMENT
    // PUT /api/departments/{id}
    // ============================================================

    @PutMapping("/{id}")
    public ResponseEntity<Department> updateDepartment(
            @PathVariable Long id,
            @RequestBody Department department) {

        Department updatedDepartment =
                departmentService.updateDepartment(
                        id,
                        department
                );

        return ResponseEntity.ok(updatedDepartment);
    }


    // ============================================================
    // DELETE DEPARTMENT
    // DELETE /api/departments/{id}
    // ============================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDepartment(
            @PathVariable Long id) {

        departmentService.deleteDepartment(id);

        return ResponseEntity.ok(
                "Department deleted successfully"
        );
    }
}
package com.example.grievancetrack.Service;

import com.example.grievancetrack.Entity.Category;
import com.example.grievancetrack.Entity.Department;
import com.example.grievancetrack.Repository.CategoryRepository;
import com.example.grievancetrack.Repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final DepartmentRepository departmentRepository;

    public CategoryService(CategoryRepository categoryRepository,
                           DepartmentRepository departmentRepository) {

        this.categoryRepository = categoryRepository;
        this.departmentRepository = departmentRepository;
    }

    // Create a new category
    public Category createCategory(Category category) {

        // Validate category name
        if (category.getName() == null ||
                category.getName().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Category name is required"
            );
        }

        // Validate SLA
        if (category.getSlaDays() == null ||
                category.getSlaDays() <= 0) {

            throw new IllegalArgumentException(
                    "SLA days must be greater than 0"
            );
        }

        // Validate department
        if (category.getDepartment() == null ||
                category.getDepartment().getId() == null) {

            throw new IllegalArgumentException(
                    "Department is required"
            );
        }

        // Check whether department exists
        Optional<Department> department =
                departmentRepository.findById(
                        category.getDepartment().getId()
                );

        if (department.isEmpty()) {

            throw new RuntimeException(
                    "Department not found with ID: "
                            + category.getDepartment().getId()
            );
        }

        // Attach existing department
        category.setDepartment(department.get());

        return categoryRepository.save(category);
    }

    // Get all categories
    public List<Category> getAllCategories() {

        return categoryRepository.findAll();
    }

    // Get category by ID
    public Category getCategoryById(Long id) {

        Optional<Category> category =
                categoryRepository.findById(id);

        if (category.isEmpty()) {

            throw new RuntimeException(
                    "Category not found with ID: " + id
            );
        }

        return category.get();
    }

    // Update category
    public Category updateCategory(Long id,
                                   Category updatedCategory) {

        Category existingCategory =
                getCategoryById(id);

        // Validate category name
        if (updatedCategory.getName() == null ||
                updatedCategory.getName().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Category name is required"
            );
        }

        // Validate SLA
        if (updatedCategory.getSlaDays() == null ||
                updatedCategory.getSlaDays() <= 0) {

            throw new IllegalArgumentException(
                    "SLA days must be greater than 0"
            );
        }

        // Validate department
        if (updatedCategory.getDepartment() == null ||
                updatedCategory.getDepartment().getId() == null) {

            throw new IllegalArgumentException(
                    "Department is required"
            );
        }

        // Check department exists
        Optional<Department> department =
                departmentRepository.findById(
                        updatedCategory.getDepartment().getId()
                );

        if (department.isEmpty()) {

            throw new RuntimeException(
                    "Department not found with ID: "
                            + updatedCategory.getDepartment().getId()
            );
        }

        existingCategory.setName(
                updatedCategory.getName()
        );

        existingCategory.setSlaDays(
                updatedCategory.getSlaDays()
        );

        existingCategory.setDepartment(
                department.get()
        );

        return categoryRepository.save(existingCategory);
    }

    // Delete category
    public void deleteCategory(Long id) {

        Category category =
                getCategoryById(id);

        categoryRepository.delete(category);
    }
}
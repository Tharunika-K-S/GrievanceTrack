package com.example.grievancetrack.Controller;

import com.example.grievancetrack.Entity.Category;
import com.example.grievancetrack.Service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // ============================================================
    // CREATE CATEGORY
    // POST /api/categories
    // ============================================================

    @PostMapping
    public ResponseEntity<Category> createCategory(
            @RequestBody Category category) {

        Category savedCategory =
                categoryService.createCategory(category);

        return new ResponseEntity<>(
                savedCategory,
                HttpStatus.CREATED
        );
    }

    // ============================================================
    // GET ALL CATEGORIES
    // GET /api/categories
    // ============================================================

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {

        List<Category> categories =
                categoryService.getAllCategories();

        return ResponseEntity.ok(categories);
    }

    // ============================================================
    // GET CATEGORY BY ID
    // GET /api/categories/{id}
    // ============================================================

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(
            @PathVariable Long id) {

        Category category =
                categoryService.getCategoryById(id);

        return ResponseEntity.ok(category);
    }

    // ============================================================
    // UPDATE CATEGORY
    // PUT /api/categories/{id}
    // ============================================================

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable Long id,
            @RequestBody Category category) {

        Category updatedCategory =
                categoryService.updateCategory(
                        id,
                        category
                );

        return ResponseEntity.ok(updatedCategory);
    }

    // ============================================================
    // DELETE CATEGORY
    // DELETE /api/categories/{id}
    // ============================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(
            @PathVariable Long id) {

        categoryService.deleteCategory(id);

        return ResponseEntity.ok(
                "Category deleted successfully"
        );
    }
}
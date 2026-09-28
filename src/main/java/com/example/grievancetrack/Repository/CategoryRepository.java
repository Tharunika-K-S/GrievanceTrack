package com.example.grievancetrack.Repository;

import com.example.grievancetrack.Entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
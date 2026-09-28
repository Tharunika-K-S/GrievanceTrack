package com.example.grievancetrack.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "departments")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String seniorOfficerName;

    public Department() {
    }

    public Department(String name, String seniorOfficerName) {
        this.name = name;
        this.seniorOfficerName = seniorOfficerName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSeniorOfficerName() {
        return seniorOfficerName;
    }

    public void setSeniorOfficerName(String seniorOfficerName) {
        this.seniorOfficerName = seniorOfficerName;
    }
}
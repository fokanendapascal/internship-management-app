package com.techsolution.ima_backend.controller;

import com.techsolution.ima_backend.dtos.request.CompanyRequest;
import com.techsolution.ima_backend.dtos.response.CompanyResponse;
import com.techsolution.ima_backend.entities.Company;
import com.techsolution.ima_backend.services.CompanyService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/companies")
@Tag(name = "Companies", description = "Api de gestion des entreprises")
public class CompanyController {

    private final CompanyService companyService;

    //Build add company REST API
    @PostMapping
    public ResponseEntity<CompanyResponse> createCompany(@RequestParam Long userId,
                                                         @RequestBody CompanyRequest companyRequest) {
        CompanyResponse savedCompany = companyService.createCompany(userId, companyRequest);
        return new ResponseEntity<>(savedCompany, HttpStatus.CREATED);
    }

    //Build get company REST API
    @GetMapping("{id}")
    public ResponseEntity<CompanyResponse> getCompanyById(@PathVariable("id") Long companyId) {
        CompanyResponse company = companyService.getCompanyById(companyId);
        return ResponseEntity.ok(company);
    }

    //Build get all companies REST API
    @GetMapping
    public ResponseEntity<List<CompanyResponse>> getAllCompanies() {
        List<CompanyResponse> companyList = companyService.getAllCompanies();
        return ResponseEntity.ok(companyList);
    }

    //Build update company REST API
    @PutMapping("{id}")
    public ResponseEntity<CompanyResponse> updateCompany(@PathVariable("id") Long companyId,
                                                         @RequestBody CompanyRequest companyRequest) {
        CompanyResponse updatedCompany = companyService.updateCompany(companyId, companyRequest);
        return ResponseEntity.ok(updatedCompany);
    }

    //Build delete company REST API
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteCompany(@PathVariable("id") Long companyId) {
        companyService.deleteCompany(companyId);
        return ResponseEntity.noContent().build();
    }

}

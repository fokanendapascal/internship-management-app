package com.techsolution.ima_backend.services.impl;

import com.techsolution.ima_backend.dtos.request.CompanyRequest;
import com.techsolution.ima_backend.dtos.response.CompanyResponse;
import com.techsolution.ima_backend.entities.Company;
import com.techsolution.ima_backend.entities.User;
import com.techsolution.ima_backend.exceptions.ResourceNotFoundException;
import com.techsolution.ima_backend.mappers.CompanyMapper;
import com.techsolution.ima_backend.repository.CompanyRepository;
import com.techsolution.ima_backend.repository.UserRepository;
import com.techsolution.ima_backend.services.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public CompanyResponse createCompany(Long userId, CompanyRequest companyRequest) {

        // 1️⃣ Récupération du User EXISTANT
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with email : " + userId
                        )
                );

        // 2️⃣ Vérification métier (optionnelle mais recommandée)
        if(user.getCompany() != null) {
            throw new IllegalStateException("Company already exists");
        }

        // 3️⃣ Création du Company
        Company company = CompanyMapper.toEntity(companyRequest);
        company.setUser(user);
        user.setCompany(company);

        Company savedCompany = companyRepository.save(company);
        return CompanyMapper.toResponseDto(savedCompany);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanyResponse> getAllCompanies() {
        List<Company> companies = companyRepository.findAll();

        return companies.stream()
                .map(CompanyMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyResponse getCompanyById(Long companyId) {
        Company company = companyRepository.findById(companyId).orElseThrow(()->
                new ResourceNotFoundException("Company is not exists with given id : " + companyId ));

        return CompanyMapper.toResponseDto(company);
    }

    @Override
    @Transactional
    public CompanyResponse updateCompany(Long companyId, CompanyRequest companyRequest) {
        Company company = companyRepository.findById(companyId).orElseThrow(()->
                new ResourceNotFoundException("Company is not exists with given id : " + companyId ));

        company.setName(companyRequest.getName());
        company.setAddress(companyRequest.getAddress());
        company.setDescription(companyRequest.getDescription());
        company.setProfessionalEmail(companyRequest.getProfessionalEmail());
        company.setPhone(companyRequest.getPhone());
        company.setWebsite(companyRequest.getWebsite());

        Company updatedCompany = companyRepository.save(company);
        return CompanyMapper.toResponseDto(updatedCompany);
    }

    @Override
    @Transactional
    public void deleteCompany(Long companyId) {
        Company company = companyRepository.findById(companyId).orElseThrow(()->
                new ResourceNotFoundException("Company is not exists with given id : " + companyId ));

        companyRepository.delete(company);
    }
}

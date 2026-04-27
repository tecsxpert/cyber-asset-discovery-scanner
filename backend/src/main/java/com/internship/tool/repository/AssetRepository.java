package com.internship.tool.repository;

import com.internship.tool.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {

    long countByStatusIgnoreCase(String status);

    long countByRiskScoreGreaterThanEqual(Integer riskScore);
}
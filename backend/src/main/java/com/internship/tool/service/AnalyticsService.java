package com.internship.tool.service;

import com.internship.tool.dto.AnalyticsResponse;
import com.internship.tool.model.Asset;
import com.internship.tool.repository.AssetRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final AssetRepository assetRepository;

    public AnalyticsService(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    public AnalyticsResponse getAnalytics(String period) {
        List<Asset> assets = assetRepository.findAll();

        Map<String, Long> statusCount = assets.stream()
                .collect(Collectors.groupingBy(Asset::getStatus, Collectors.counting()));

        Map<String, Long> typeCount = assets.stream()
                .collect(Collectors.groupingBy(Asset::getType, Collectors.counting()));

        Map<String, Long> riskCount = assets.stream()
                .collect(Collectors.groupingBy(
                        asset -> {
                            Integer score = asset.getRiskScore();

                            if (score == null) {
                                return "UNKNOWN";
                            }

                            if (score >= 80) {
                                return "HIGH";
                            } else if (score >= 50) {
                                return "MEDIUM";
                            } else {
                                return "LOW";
                            }
                        },
                        Collectors.counting()
                ));

        return new AnalyticsResponse(
                assets.size(),
                statusCount,
                typeCount,
                riskCount
        );
    }
}
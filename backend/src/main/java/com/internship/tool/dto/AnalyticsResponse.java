package com.internship.tool.dto;

import java.util.Map;

public class AnalyticsResponse {

    private long totalAssets;
    private Map<String, Long> statusCount;
    private Map<String, Long> typeCount;
    private Map<String, Long> riskCount;

    public AnalyticsResponse(long totalAssets,
                             Map<String, Long> statusCount,
                             Map<String, Long> typeCount,
                             Map<String, Long> riskCount) {
        this.totalAssets = totalAssets;
        this.statusCount = statusCount;
        this.typeCount = typeCount;
        this.riskCount = riskCount;
    }

    public long getTotalAssets() {
        return totalAssets;
    }

    public Map<String, Long> getStatusCount() {
        return statusCount;
    }

    public Map<String, Long> getTypeCount() {
        return typeCount;
    }

    public Map<String, Long> getRiskCount() {
        return riskCount;
    }
}
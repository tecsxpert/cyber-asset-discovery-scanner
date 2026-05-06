package com.internship.tool.controller;

import com.internship.tool.dto.AnalyticsResponse;
import com.internship.tool.service.AnalyticsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping
    public AnalyticsResponse getAnalytics(@RequestParam(defaultValue = "all") String period) {
        return analyticsService.getAnalytics(period);
    }
}
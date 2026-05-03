package com.internship.tool.controller;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiController {

    @PostMapping("/analyze")
    public Map<String, String> analyzeAsset(@RequestBody Map<String, String> request) {
        String assetName = request.getOrDefault("assetName", "Unknown Asset");
        String status = request.getOrDefault("status", "Unknown");
        String type = request.getOrDefault("type", "Unknown");

        String response = """
                AI Asset Analysis:
                
                Asset Name: %s
                Asset Type: %s
                Current Status: %s
                
                Security Observation:
                This asset should be continuously monitored for unauthorized access, outdated software, and unusual network activity.
                
                Recommendation:
                Keep the asset updated, verify open ports, check logs regularly, and ensure proper access control.
                """.formatted(assetName, type, status);

        Map<String, String> result = new HashMap<>();
        result.put("response", response);

        return result;
    }
}
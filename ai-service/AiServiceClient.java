package com.internship.tool.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.HashMap;
import java.util.Map;

/**
 * AiServiceClient — connects the Spring Boot backend to the Flask AI microservice.
 *
 * Endpoints called:
 *   POST /describe         — AI description of an asset
 *   POST /recommend        — AI-powered recommendations
 *   POST /generate-report  — Full structured security report
 *   GET  /health           — AI service health check
 */
@Component
public class AiServiceClient {

    private static final Logger logger = LoggerFactory.getLogger(AiServiceClient.class);

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${ai.service.base-url:http://ai-service:5000}")
    private String aiServiceBaseUrl;

    public AiServiceClient() {
        this.restTemplate = buildRestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Build a RestTemplate with a 10-second connection and read timeout.
     */
    private RestTemplate buildRestTemplate() {
        org.springframework.http.client.SimpleClientHttpRequestFactory factory =
                new org.springframework.http.client.SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10_000);
        factory.setReadTimeout(10_000);
        return new RestTemplate(factory);
    }

    // ─────────────────────────────────────────────────────────────────────
    // POST /describe
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Ask the AI service to describe an asset.
     *
     * @param assetData Map of asset fields (name, ip, type, etc.)
     * @return Map with description fields, or null on any error
     */
    public Map<String, Object> describeAsset(Map<String, Object> assetData) {
        String url = aiServiceBaseUrl + "/describe";
        Map<String, Object> body = new HashMap<>();
        body.put("asset_data", assetData);
        return postToAiService(url, body, "describeAsset");
    }

    // ─────────────────────────────────────────────────────────────────────
    // POST /recommend
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Get AI-powered security recommendations for an asset.
     *
     * @param assetData Map of asset fields
     * @return Map with recommendations list, or null on any error
     */
    public Map<String, Object> getRecommendations(Map<String, Object> assetData) {
        String url = aiServiceBaseUrl + "/recommend";
        Map<String, Object> body = new HashMap<>();
        body.put("asset_data", assetData);
        return postToAiService(url, body, "getRecommendations");
    }

    // ─────────────────────────────────────────────────────────────────────
    // POST /generate-report
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Generate a full structured security report for an asset.
     *
     * @param assetData Map of asset fields
     * @return Map with title, summary, overview, key_items, recommendations, or null on error
     */
    public Map<String, Object> generateReport(Map<String, Object> assetData) {
        String url = aiServiceBaseUrl + "/generate-report";
        Map<String, Object> body = new HashMap<>();
        body.put("asset_data", assetData);
        return postToAiService(url, body, "generateReport");
    }

    // ─────────────────────────────────────────────────────────────────────
    // GET /health
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Check if the AI microservice is healthy.
     *
     * @return Map with status and uptime, or null if unreachable
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> checkHealth() {
        String url = aiServiceBaseUrl + "/health";
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            return objectMapper.readValue(response.getBody(), Map.class);

        } catch (Exception e) {
            logger.error("[AiServiceClient] Health check failed: {}", e.getMessage());
            return null;
        }
    }

    // ─────────────────────────────────────────────────────────────────────
    // Shared POST helper
    // ─────────────────────────────────────────────────────────────────────

    @SuppressWarnings("unchecked")
    private Map<String, Object> postToAiService(String url, Map<String, Object> body, String methodName) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return objectMapper.readValue(response.getBody(), Map.class);
            } else {
                logger.warn("[AiServiceClient] {} returned non-2xx status: {}", methodName, response.getStatusCode());
                return null;
            }

        } catch (Exception e) {
            logger.error("[AiServiceClient] {} failed: {}", methodName, e.getMessage());
            return null;  // Always return null on error — never propagate AI failures to users
        }
    }
}

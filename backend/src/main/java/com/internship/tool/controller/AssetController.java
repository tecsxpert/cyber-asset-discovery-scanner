package com.internship.tool.controller;

import com.internship.tool.model.Asset;
import com.internship.tool.service.AssetService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/assets")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost"})
public class AssetController {

    @Autowired
    private AssetService assetService;

   
    @Operation(summary = "Get all assets with pagination")
    @GetMapping("/all")
    public Page<Asset> getAllAssets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return assetService.getAllAssets(
                PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
    }

   
    @Operation(summary = "Search assets using keyword, status and date range")
    @GetMapping("/search")
    public Page<Asset> searchAssets(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return assetService.searchAssets(
                q,
                status,
                startDate,
                endDate,
                PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
    }

    @Operation(summary = "Get dashboard statistics")
    @GetMapping("/stats")
    public Map<String, Long> getStats() {
        Map<String, Long> stats = new HashMap<>();

        stats.put("totalAssets", assetService.countAllAssets());
        stats.put("activeAssets", assetService.countByStatus("ACTIVE"));
        stats.put("inactiveAssets", assetService.countByStatus("INACTIVE"));
        stats.put("highRiskAssets", assetService.countHighRiskAssets());

        return stats;
    }

    @Operation(summary = "Export all assets as CSV file")
    @GetMapping("/export")
    public void exportAssetsToCsv(HttpServletResponse response) throws IOException {

        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=assets.csv");

        Iterable<Asset> assets = assetService.getAssets();

        PrintWriter writer = response.getWriter();

        writer.println("ID,Name,Type,IP Address,Status,Risk Score");

        for (Asset asset : assets) {
            writer.println(
                    asset.getId() + "," +
                    safe(asset.getName()) + "," +
                    safe(asset.getType()) + "," +
                    safe(asset.getIpAddress()) + "," +
                    safe(asset.getStatus()) + "," +
                    asset.getRiskScore()
            );
        }

        writer.flush();
    }

    @Operation(summary = "Get asset by ID")
    @GetMapping("/{id}")
    public ResponseEntity<Asset> getAssetById(@PathVariable Long id) {
        return assetService.getAssetByIdOptional(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Get all assets")
    @GetMapping
    public Iterable<Asset> getAssets() {
        return assetService.getAssets();
    }

    @Operation(summary = "Create new asset")
    @PostMapping
    public Asset addAsset(@RequestBody Asset asset) {
        return assetService.addAsset(asset);
    }

    @Operation(summary = "Update asset by ID")
    @PutMapping("/{id}")
    public Asset updateAsset(@PathVariable Long id, @RequestBody Asset asset) {
        return assetService.updateAsset(id, asset);
    }

    @Operation(summary = "Delete asset by ID")
    @DeleteMapping("/{id}")
    public void deleteAsset(@PathVariable Long id) {
        assetService.deleteAsset(id);
    }

    private String safe(String value) {
        if (value == null) {
            return "";
        }
        return "\"" + value.replace("\"", "\"\"") + "\"";
    }
}
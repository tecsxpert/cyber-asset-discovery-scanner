package com.internship.tool.controller;

import com.internship.tool.model.Asset;
import com.internship.tool.repository.AssetRepository;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/assets")
@CrossOrigin(origins = "http://localhost:5173")
public class FileUploadController {

    private final AssetRepository assetRepository;

    public FileUploadController(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    @Operation(summary = "Upload CSV file and import assets")
    @PostMapping("/upload")
    public ResponseEntity<?> uploadCsvFile(@RequestParam("file") MultipartFile file) {

        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }

            String fileName = file.getOriginalFilename();

            if (fileName == null || !fileName.toLowerCase().endsWith(".csv")) {
                return ResponseEntity.badRequest().body("Only CSV files are allowed");
            }

            long maxSize = 2 * 1024 * 1024;

            if (file.getSize() > maxSize) {
                return ResponseEntity.badRequest().body("File size must be less than 2MB");
            }

            List<Asset> assets = new ArrayList<>();

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(file.getInputStream())
            );

            String line;
            boolean skipHeader = true;

            while ((line = reader.readLine()) != null) {

                if (skipHeader) {
                    skipHeader = false;
                    continue;
                }

                if (line.trim().isEmpty()) {
                    continue;
                }

                String[] data = line.split(",");

                if (data.length < 5) {
                    continue;
                }

                Asset asset = new Asset();

                asset.setName(clean(data[0]));
                asset.setType(clean(data[1]));
                asset.setIpAddress(clean(data[2]));
                asset.setStatus(clean(data[3]));

                try {
                    asset.setRiskScore(Integer.parseInt(clean(data[4])));
                } catch (NumberFormatException e) {
                    asset.setRiskScore(0);
                }

                assets.add(asset);
            }

            assetRepository.saveAll(assets);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("CSV uploaded successfully. Imported records: " + assets.size());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Upload failed: " + e.getMessage());
        }
    }

    private String clean(String value) {
        if (value == null) {
            return "";
        }
        return value.replace("\"", "").trim();
    }
}
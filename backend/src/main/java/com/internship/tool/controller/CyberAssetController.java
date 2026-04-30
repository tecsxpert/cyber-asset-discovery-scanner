package com.internship.tool.controller;

import com.internship.tool.entity.CyberAsset;
import com.internship.tool.service.CyberAssetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assets")
@CrossOrigin(origins = "*") // For development with React frontend
public class CyberAssetController {

    private final CyberAssetService assetService;

    @Autowired
    public CyberAssetController(CyberAssetService assetService) {
        this.assetService = assetService;
    }

    /**
     * GET /api/assets/all
     * Retrieves a paginated list of all non-deleted assets.
     */
    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @Cacheable(value = "assets", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    public ResponseEntity<Page<CyberAsset>> getAllAssets(
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        Page<CyberAsset> assets = assetService.getAllAssets(pageable);
        return ResponseEntity.ok(assets);
    }

    /**
     * GET /api/assets/{id}
     * Retrieves a single asset by ID. Returns 404 if not found or deleted.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @Cacheable(value = "asset", key = "#id")
    public ResponseEntity<CyberAsset> getAssetById(@PathVariable Long id) {
        CyberAsset asset = assetService.getAssetById(id);
        return ResponseEntity.ok(asset);
    }

    /**
     * POST /api/assets/create
     * Creates a new cyber asset.
     */
    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    @CacheEvict(value = {"assets", "asset"}, allEntries = true)
    public ResponseEntity<CyberAsset> createAsset(@Valid @RequestBody CyberAsset asset) {
        CyberAsset createdAsset = assetService.createAsset(asset);
        return new ResponseEntity<>(createdAsset, HttpStatus.CREATED);
    }
}

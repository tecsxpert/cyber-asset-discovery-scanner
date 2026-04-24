package com.internship.tool.controller;

import com.internship.tool.model.Asset;
import com.internship.tool.service.AssetService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/assets")
@CrossOrigin(origins = "http://localhost:5173")
public class AssetController {

    @Autowired
    private AssetService assetService;

    @GetMapping("/all")
    public Page<Asset> getAllAssets(Pageable pageable) {
        return assetService.getAllAssets(pageable);
    }

    // (Optional) Existing APIs
    @GetMapping
    public Iterable<Asset> getAssets() {
        return assetService.getAssets();
    }

    @PostMapping
    public Asset addAsset(@RequestBody Asset asset) {
        return assetService.addAsset(asset);
    }

    @DeleteMapping("/{id}")
    public void deleteAsset(@PathVariable Long id) {
        assetService.deleteAsset(id);
    }
}
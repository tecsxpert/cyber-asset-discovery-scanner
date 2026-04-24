package com.internship.tool.service;

import com.internship.tool.model.Asset;
import com.internship.tool.repository.AssetRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class AssetService {

    @Autowired
    private AssetRepository assetRepository;

    public Page<Asset> getAllAssets(Pageable pageable) {
        return assetRepository.findAll(pageable);
    }

    // Existing methods
    public Iterable<Asset> getAssets() {
        return assetRepository.findAll();
    }

    public Asset addAsset(Asset asset) {
        return assetRepository.save(asset);
    }

    public void deleteAsset(Long id) {
        assetRepository.deleteById(id);
    }
}
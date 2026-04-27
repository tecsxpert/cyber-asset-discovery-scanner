package com.internship.tool.service;

import com.internship.tool.model.Asset;
import com.internship.tool.repository.AssetRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class AssetService {

    @Autowired
    private AssetRepository assetRepository;

    public Page<Asset> getAllAssets(Pageable pageable) {
        return assetRepository.findAll(pageable);
    }

    public Iterable<Asset> getAssets() {
        return assetRepository.findAll();
    }

    public Asset addAsset(Asset asset) {
        return assetRepository.save(asset);
    }

    public void deleteAsset(Long id) {
        assetRepository.deleteById(id);
    }

    public long countAllAssets() {
        return assetRepository.count();
    }

    public long countByStatus(String status) {
        return assetRepository.countByStatusIgnoreCase(status);
    }

    public long countHighRiskAssets() {
        return assetRepository.countByRiskScoreGreaterThanEqual(70);
    }

    public Asset getAssetById(Long id) {
        return assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found with id: " + id));
    }

    public Asset updateAsset(Long id, Asset updatedAsset) {
        Asset existingAsset = getAssetById(id);

        existingAsset.setName(updatedAsset.getName());
        existingAsset.setIpAddress(updatedAsset.getIpAddress());
        existingAsset.setType(updatedAsset.getType());
        existingAsset.setStatus(updatedAsset.getStatus());
        existingAsset.setRiskScore(updatedAsset.getRiskScore());

        return assetRepository.save(existingAsset);
    }
}
package com.internship.tool.service;

import com.internship.tool.model.Asset;
import com.internship.tool.repository.AssetRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssetService {

    private final AssetRepository repo;

    public AssetService(AssetRepository repo) {
        this.repo = repo;
    }

    public List<Asset> getAllAssets() {
        return repo.findAll();
    }

    public Asset saveAsset(Asset asset) {
        return repo.save(asset);
    }

   
    public Asset updateAsset(Long id, Asset updatedAsset) {
        Asset asset = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        asset.setName(updatedAsset.getName());
        asset.setType(updatedAsset.getType());
        asset.setIpAddress(updatedAsset.getIpAddress());

        return repo.save(asset);
    }

   
    public void deleteAsset(Long id) {
        repo.deleteById(id);
    }
}
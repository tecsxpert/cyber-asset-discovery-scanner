package com.internship.tool.controller;

import com.internship.tool.model.Asset;
import com.internship.tool.repository.AssetRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;



import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AssetControllerMockMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Asset asset;

    @BeforeEach
    void setUp() {
        assetRepository.deleteAll();

        asset = new Asset();
        asset.setName("Test Laptop");
        asset.setIpAddress("192.168.1.10");
        asset.setType("Laptop");
        asset.setStatus("ACTIVE");
       
        assetRepository.save(asset);
    }

    @Test
    void testGetAllAssets_ShouldReturn200() throws Exception {
        mockMvc.perform(get("/api/assets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void testCreateAsset_ShouldReturnCreatedOrOk() throws Exception {
        Asset newAsset = new Asset();
        newAsset.setName("Server Asset");
        newAsset.setIpAddress("192.168.1.20");
        newAsset.setType("Server");
        newAsset.setStatus("ACTIVE");
        
        mockMvc.perform(post("/api/assets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newAsset)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Server Asset"))
                .andExpect(jsonPath("$.ipAddress").value("192.168.1.20"));
    }

    @Test
    void testUpdateAsset_ShouldReturn200() throws Exception {
        asset.setName("Updated Laptop");
        asset.setStatus("INACTIVE");

        mockMvc.perform(put("/api/assets/" + asset.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(asset)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Laptop"))
                .andExpect(jsonPath("$.status").value("INACTIVE"));
    }

    @Test
    void testDeleteAsset_ShouldReturn200() throws Exception {
        mockMvc.perform(delete("/api/assets/" + asset.getId()))
                .andExpect(status().isOk());
    }

    @Test
    void testGetAssetByInvalidId_ShouldReturn404OrNotFound() throws Exception {
        mockMvc.perform(get("/api/assets/99999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testSearchAssets_ShouldReturn200() throws Exception {
        mockMvc.perform(get("/api/assets/search")
                        .param("keyword", "Laptop")
                        .param("status", "ACTIVE"))
                .andExpect(status().isOk());
    }
    @Test
    void testGetAssetsWithPagination_ShouldReturn200() throws Exception {
        mockMvc.perform(get("/api/assets/all")
                    .param("page", "0"))
            .andExpect(status().isOk());
}
}
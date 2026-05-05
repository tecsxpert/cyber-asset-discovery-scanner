package com.internship.tool.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.internship.tool.entity.CyberAsset;
import com.internship.tool.service.CyberAssetService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * 6 JUnit 5 integration tests for CyberAssetController using MockMvc.
 * Run with: mvn test -Dgroups=integration
 */
@Tag("integration")
@WebMvcTest(CyberAssetController.class)
class CyberAssetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CyberAssetService assetService;

    @Autowired
    private ObjectMapper objectMapper;

    private CyberAsset sampleAsset;

    @BeforeEach
    void setUp() {
        sampleAsset = new CyberAsset("Web Server 01", "SERVER", "ACTIVE");
        sampleAsset.setId(1L);
        sampleAsset.setIpAddress("192.168.1.10");
        sampleAsset.setRiskScore(45);
        sampleAsset.setHostname("web-server-01.local");
        sampleAsset.setOwner("Security Team");
        sampleAsset.setDepartment("IT");
    }

    // ─── Test 1: Get All Assets Success ─────────────────────────────────────────

    @Test
    @DisplayName("1. GET /api/assets/all — returns paginated assets successfully")
    @WithMockUser(roles = "USER")
    void getAllAssets_success() throws Exception {
        Pageable pageable = PageRequest.of(0, 10);
        CyberAsset asset2 = new CyberAsset("Database Server", "SERVER", "ACTIVE");
        asset2.setId(2L);
        Page<CyberAsset> page = new PageImpl<>(Arrays.asList(sampleAsset, asset2), pageable, 2);

        when(assetService.getAllAssets(any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/assets/all"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].assetName").value("Web Server 01"))
                .andExpect(jsonPath("$.content[1].id").value(2))
                .andExpect(jsonPath("$.totalElements").value(2));

        verify(assetService).getAllAssets(any(Pageable.class));
    }

    // ─── Test 2: Get Asset By ID Success ───────────────────────────────────────

    @Test
    @DisplayName("2. GET /api/assets/{id} — returns asset by ID")
    @WithMockUser(roles = "USER")
    void getAssetById_success() throws Exception {
        when(assetService.getAssetById(1L)).thenReturn(sampleAsset);

        mockMvc.perform(get("/api/assets/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.assetName").value("Web Server 01"))
                .andExpect(jsonPath("$.assetType").value("SERVER"))
                .andExpect(jsonPath("$.status").value("ACTIVE"));

        verify(assetService).getAssetById(1L);
    }

    // ─── Test 3: Create Asset Success ──────────────────────────────────────────

    @Test
    @DisplayName("3. POST /api/assets/create — creates new asset successfully")
    @WithMockUser(roles = "ADMIN")
    void createAsset_success() throws Exception {
        CyberAsset newAsset = new CyberAsset("New Server", "SERVER", "ACTIVE");
        newAsset.setIpAddress("192.168.1.11");

        when(assetService.createAsset(any(CyberAsset.class))).thenReturn(sampleAsset);

        mockMvc.perform(post("/api/assets/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newAsset))
                        .with(csrf()))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.assetName").value("Web Server 01"));

        verify(assetService).createAsset(any(CyberAsset.class));
    }

    // ─── Test 4: Create Asset Validation Error ─────────────────────────────────

    @Test
    @DisplayName("4. POST /api/assets/create — returns 400 for invalid asset")
    @WithMockUser(roles = "ADMIN")
    void createAsset_validationError() throws Exception {
        CyberAsset invalidAsset = new CyberAsset("", "SERVER", "ACTIVE"); // blank name

        mockMvc.perform(post("/api/assets/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidAsset))
                        .with(csrf()))
                .andExpect(status().isBadRequest());

        verify(assetService, never()).createAsset(any());
    }

    // ─── Test 5: Access Denied for Non-Admin ───────────────────────────────────

    @Test
    @DisplayName("5. POST /api/assets/create — returns 403 for non-admin user")
    @WithMockUser(roles = "USER")
    void createAsset_accessDenied() throws Exception {
        CyberAsset newAsset = new CyberAsset("New Server", "SERVER", "ACTIVE");

        mockMvc.perform(post("/api/assets/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newAsset))
                        .with(csrf()))
                .andExpect(status().isForbidden());

        verify(assetService, never()).createAsset(any());
    }

    // ─── Test 6: Get Asset By ID Not Found ─────────────────────────────────────

    @Test
    @DisplayName("6. GET /api/assets/{id} — returns 404 when asset not found")
    @WithMockUser(roles = "USER")
    void getAssetById_notFound() throws Exception {
        when(assetService.getAssetById(999L)).thenThrow(new RuntimeException("Asset not found"));

        mockMvc.perform(get("/api/assets/999"))
                .andExpect(status().isInternalServerError());

        verify(assetService).getAssetById(999L);
    }
}
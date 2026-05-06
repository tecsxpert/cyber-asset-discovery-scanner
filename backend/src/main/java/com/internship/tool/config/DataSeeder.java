package com.internship.tool.config;

import com.internship.tool.model.Asset;
import com.internship.tool.repository.AssetRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final AssetRepository assetRepository;

    public DataSeeder(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    @Override
    public void run(String... args) {
        if (assetRepository.count() > 0) {
            System.out.println("Seeder skipped (data already exists)");
            return;
        }

        List<Asset> assets = List.of(
                new Asset("Web Server", "Server", "192.168.1.10", "ACTIVE", 85),
                new Asset("Database Server", "Database", "192.168.1.20", "ACTIVE", 95),
                new Asset("Admin Laptop", "Laptop", "192.168.1.30", "ACTIVE", 60),
                new Asset("Firewall", "Network", "192.168.1.1", "ACTIVE", 98),
                new Asset("Mail Server", "Server", "192.168.1.40", "INACTIVE", 75),
                new Asset("HR System", "Application", "192.168.1.50", "ACTIVE", 65),
                new Asset("Finance App", "Application", "192.168.1.60", "ACTIVE", 92),
                new Asset("Backup Server", "Server", "192.168.1.70", "MAINTENANCE", 70),
                new Asset("VPN Gateway", "Network", "192.168.1.80", "ACTIVE", 88),
                new Asset("Printer", "IoT", "192.168.1.90", "ACTIVE", 30),
                new Asset("CCTV Camera", "IoT", "192.168.1.100", "INACTIVE", 25),
                new Asset("Dev Server", "Server", "192.168.1.110", "ACTIVE", 55),
                new Asset("QA Server", "Server", "192.168.1.120", "MAINTENANCE", 60),
                new Asset("Employee Mobile", "Mobile", "192.168.1.130", "ACTIVE", 40),
                new Asset("Cloud API Gateway", "Cloud", "10.0.0.5", "ACTIVE", 97)
        );

        assetRepository.saveAll(assets);
        System.out.println("15 demo assets inserted");
    }
}
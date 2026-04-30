package com.internship.tool.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI cyberScannerOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Cyber Asset Discovery Scanner API")
                        .description("Backend APIs for asset management, AI analysis, CSV export and file upload")
                        .version("1.0"));
    }
}
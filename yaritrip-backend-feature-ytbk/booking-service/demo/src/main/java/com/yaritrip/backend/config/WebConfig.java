package com.yaritrip.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        // 🔹 Static images (existing)
        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/static/images/");

        // 🔹 Uploaded images (new)
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}
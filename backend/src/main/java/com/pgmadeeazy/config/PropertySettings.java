package com.pgmadeeazy.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@ConfigurationProperties(prefix = "property")
@PropertySource("classpath:application.properties")
public class PropertySettings {
    private String imageFolder;
    private Long imageSize;
    private Integer locationRadius;

    public String getImageFolder() {
        return imageFolder;
    }

    public void setImageFolder(String imageFolder) {
        this.imageFolder = imageFolder;
    }

    public Long getImageSize() {
        return imageSize;
    }

    public void setImageSize(Long imageSize) {
        this.imageSize = imageSize;
    }

    public Integer getLocationRadius() {
        return locationRadius;
    }

    public void setLocationRadius(Integer locationRadius) {
        this.locationRadius = locationRadius;
    }
}

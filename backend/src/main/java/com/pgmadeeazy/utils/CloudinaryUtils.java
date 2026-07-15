package com.pgmadeeazy.utils;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.pgmadeeazy.properties.CloudinaryProperties;

@Component
public class CloudinaryUtils {
    
    private static final Logger logger = LoggerFactory.getLogger(CloudinaryUtils.class);
    private final Cloudinary cloudinary;
    private final CloudinaryProperties properties;

    @Autowired
    public CloudinaryUtils(Cloudinary cloudinary, CloudinaryProperties properties) {
        this.cloudinary = cloudinary;
        this.properties = properties;
    }

    public String uploadImage(MultipartFile file, String folder) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be null or empty");
        }

        logger.info("Attempting to upload file: {}, size: {} bytes", file.getOriginalFilename(), file.getSize());

        if (file.getSize() > properties.getMaxSize()) {
            logger.error("File size {} exceeds maximum allowed size {}", file.getSize(), properties.getMaxSize());
            throw new IllegalArgumentException(String.format("File size %d exceeds maximum allowed size %d", file.getSize(), properties.getMaxSize()));
        }

        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "folder", folder,
                "resource_type", "auto"
            ));
            
            logger.info("Successfully uploaded file: {}", file.getOriginalFilename());
            return uploadResult.get("url").toString();
        } catch (IOException e) {
            logger.error("Failed to upload file: {}", file.getOriginalFilename(), e);
            throw new IOException("Failed to upload file: " + e.getMessage());
        }
    }

    public String uploadImageWithPublicId(MultipartFile file, String folder) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be null or empty");
        }

        if (file.getSize() > properties.getMaxSize()) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size");
        }

        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
            "folder", folder,
            "resource_type", "image",
            "public_id", file.getOriginalFilename()
        ));

        return uploadResult.get("url").toString();
    }

    public List<String> uploadImages(List<MultipartFile> files) throws IOException {
        if (files == null || files.isEmpty()) {
            throw new IllegalArgumentException("Files list cannot be null or empty");
        }

        logger.info("Attempting to upload {} files", files.size());

        return files.stream()
            .filter(file -> file != null && !file.isEmpty())
            .map(file -> {
                try {
                    return uploadImage(file, properties.getFolder());
                } catch (IOException e) {
                    logger.error("Failed to upload file: {}", file.getOriginalFilename(), e);
                    throw new RuntimeException("Failed to upload file: " + file.getOriginalFilename(), e);
                }
            })
            .collect(Collectors.toList());
    }

    public void deleteImage(String publicId) throws IOException {
        if (publicId == null || publicId.isEmpty()) {
            throw new IllegalArgumentException("Public ID cannot be null or empty");
        }

        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            logger.info("Successfully deleted image with public ID: {}", publicId);
        } catch (IOException e) {
            logger.error("Failed to delete image with public ID: {}", publicId, e);
            throw new IOException("Failed to delete image: " + e.getMessage());
        }
    }

    public void deleteImageByUrl(String url) {
        if (url == null || url.isEmpty()) {
            return;
        }

        try {
            cloudinary.uploader().destroy(url, ObjectUtils.asMap(
                "resource_type", "image"
            ));
            logger.info("Successfully deleted image with URL: {}", url);
        } catch (IOException e) {
            logger.error("Failed to delete image with URL: {}", url, e);
            throw new RuntimeException("Failed to delete image: " + e.getMessage());
        }
    }
}

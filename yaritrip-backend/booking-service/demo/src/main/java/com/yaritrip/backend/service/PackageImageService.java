package com.yaritrip.backend.service;

import org.springframework.stereotype.Service;

import java.io.File;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PackageImageService {

    private static final String IMAGE_PATH =
            "src/main/resources/static/images/packages/";

    public List<String> getImagesForDestination(String destination) {

        File folder = new File(IMAGE_PATH + destination.toLowerCase());

        if (!folder.exists() || !folder.isDirectory()) {
            return List.of("/images/packages/default.jpg");
        }

        File[] files = folder.listFiles();

        if (files == null) {
            return List.of("/images/packages/default.jpg");
        }

        return Arrays.stream(files)
                .filter(file -> file.getName().endsWith(".jpg")
                        || file.getName().endsWith(".png"))
                .map(file ->
                        "/images/packages/"
                                + destination.toLowerCase()
                                + "/"
                                + file.getName()
                )
                .collect(Collectors.toList());
    }
}
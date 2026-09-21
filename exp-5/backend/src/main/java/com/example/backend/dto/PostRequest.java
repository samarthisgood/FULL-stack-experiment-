package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PostRequest {

    @NotBlank(message = "Platform must not be empty")
    private String platform;

    @NotBlank(message = "Content must not be empty")
    @Size(max = 2000, message = "Content exceeds limit")
    private String content;

    public PostRequest() {}

    public String getPlatform() {
        return platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}

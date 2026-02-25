package com.knowledgesharing.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

public class AiDto {

    @Data
    public static class ImproveRequest {
        @NotBlank(message = "Content is required")
        private String content;
        private String title;
        private String action; // "rewrite", "grammar", "concise", "title"
    }

    @Data
    public static class SummarizeRequest {
        @NotBlank(message = "Content is required")
        private String content;
        private String title;
    }

    @Data
    public static class TagSuggestionRequest {
        @NotBlank(message = "Content is required")
        private String content;
        private String title;
    }

    @Data
    public static class AiResponse {
        private String result;
        private String action;
        private boolean mocked;

        public AiResponse(String result, String action, boolean mocked) {
            this.result = result;
            this.action = action;
            this.mocked = mocked;
        }
    }
}

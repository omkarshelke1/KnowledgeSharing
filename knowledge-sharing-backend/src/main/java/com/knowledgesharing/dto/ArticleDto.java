package com.knowledgesharing.dto;

import com.knowledgesharing.entity.Article;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class ArticleDto {

    @Data
    public static class CreateRequest {
        @NotBlank(message = "Title is required")
        private String title;

        @NotBlank(message = "Content is required")
        private String content;

        private String summary;

        @NotNull(message = "Category is required")
        private Article.Category category;

        private String tags;

        private boolean published = true;
    }

    @Data
    public static class UpdateRequest {
        private String title;
        private String content;
        private String summary;
        private Article.Category category;
        private String tags;
        private Boolean published;
    }

    @Data
    public static class ArticleResponse {
        private Long id;
        private String title;
        private String content;
        private String summary;
        private Article.Category category;
        private String tags;
        private AuthorInfo author;
        private boolean published;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        @Data
        public static class AuthorInfo {
            private Long id;
            private String username;
            private String email;
        }
    }
}

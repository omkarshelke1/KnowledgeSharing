package com.knowledgesharing.controller;

import com.knowledgesharing.dto.ArticleDto;
import com.knowledgesharing.entity.User;
import com.knowledgesharing.service.ArticleService;
import com.knowledgesharing.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    private final ArticleService articleService;
    private final AuthService authService;

    public ArticleController(ArticleService articleService, AuthService authService) {
        this.articleService = articleService;
        this.authService = authService;
    }

    // Public - Get all published articles
    @GetMapping
    public ResponseEntity<List<ArticleDto.ArticleResponse>> getAllArticles() {
        return ResponseEntity.ok(articleService.getAllPublished());
    }

    // Public - Get single article
    @GetMapping("/{id}")
    public ResponseEntity<?> getArticle(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(articleService.getById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Public - Search and filter
    @GetMapping("/search")
    public ResponseEntity<List<ArticleDto.ArticleResponse>> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(articleService.search(q, category));
    }

    // Protected - Get current user's articles
    @GetMapping("/my")
    public ResponseEntity<List<ArticleDto.ArticleResponse>> getMyArticles(Authentication auth) {
        User user = authService.getCurrentUser(auth.getName());
        return ResponseEntity.ok(articleService.getMyArticles(user));
    }

    // Protected - Create article
    @PostMapping
    public ResponseEntity<?> createArticle(@Valid @RequestBody ArticleDto.CreateRequest request,
            Authentication auth) {
        try {
            User user = authService.getCurrentUser(auth.getName());
            return ResponseEntity.ok(articleService.create(request, user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Protected - Update article (author only)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateArticle(@PathVariable Long id,
            @RequestBody ArticleDto.UpdateRequest request,
            Authentication auth) {
        try {
            User user = authService.getCurrentUser(auth.getName());
            return ResponseEntity.ok(articleService.update(id, request, user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Protected - Delete article (author only)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteArticle(@PathVariable Long id, Authentication auth) {
        try {
            User user = authService.getCurrentUser(auth.getName());
            articleService.delete(id, user);
            return ResponseEntity.ok(Map.of("message", "Article deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

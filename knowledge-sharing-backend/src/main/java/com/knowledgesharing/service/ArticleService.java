package com.knowledgesharing.service;

import com.knowledgesharing.dto.ArticleDto;
import com.knowledgesharing.entity.Article;
import com.knowledgesharing.entity.User;
import com.knowledgesharing.repository.ArticleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ArticleService {

    private final ArticleRepository articleRepository;

    public ArticleService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public List<ArticleDto.ArticleResponse> getAllPublished() {
        return articleRepository.findByPublishedTrueOrderByCreatedAtDesc()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ArticleDto.ArticleResponse getById(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found: " + id));
        return toResponse(article);
    }

    public List<ArticleDto.ArticleResponse> getMyArticles(User user) {
        return articleRepository.findByAuthorOrderByCreatedAtDesc(user)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ArticleDto.ArticleResponse> search(String query, String category) {
        List<Article> articles;
        if (category != null && !category.isBlank()) {
            Article.Category cat = Article.Category.valueOf(category.toUpperCase());
            if (query != null && !query.isBlank()) {
                articles = articleRepository.searchArticlesByCategory(query, cat);
            } else {
                articles = articleRepository.findByPublishedTrueAndCategory(cat);
            }
        } else {
            if (query != null && !query.isBlank()) {
                articles = articleRepository.searchArticles(query);
            } else {
                articles = articleRepository.findByPublishedTrueOrderByCreatedAtDesc();
            }
        }
        return articles.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ArticleDto.ArticleResponse create(ArticleDto.CreateRequest request, User author) {
        Article article = new Article();
        article.setTitle(request.getTitle());
        article.setContent(request.getContent());
        article.setSummary(request.getSummary());
        article.setCategory(request.getCategory());
        article.setTags(request.getTags());
        article.setAuthor(author);
        article.setPublished(request.isPublished());
        return toResponse(articleRepository.save(article));
    }

    public ArticleDto.ArticleResponse update(Long id, ArticleDto.UpdateRequest request, User user) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found: " + id));

        if (!article.getAuthor().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: you are not the author");
        }

        if (request.getTitle() != null)
            article.setTitle(request.getTitle());
        if (request.getContent() != null)
            article.setContent(request.getContent());
        if (request.getSummary() != null)
            article.setSummary(request.getSummary());
        if (request.getCategory() != null)
            article.setCategory(request.getCategory());
        if (request.getTags() != null)
            article.setTags(request.getTags());
        if (request.getPublished() != null)
            article.setPublished(request.getPublished());

        return toResponse(articleRepository.save(article));
    }

    public void delete(Long id, User user) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found: " + id));

        if (!article.getAuthor().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: you are not the author");
        }
        articleRepository.delete(article);
    }

    private ArticleDto.ArticleResponse toResponse(Article article) {
        ArticleDto.ArticleResponse response = new ArticleDto.ArticleResponse();
        response.setId(article.getId());
        response.setTitle(article.getTitle());
        response.setContent(article.getContent());
        response.setSummary(article.getSummary());
        response.setCategory(article.getCategory());
        response.setTags(article.getTags());
        response.setPublished(article.isPublished());
        response.setCreatedAt(article.getCreatedAt());
        response.setUpdatedAt(article.getUpdatedAt());

        ArticleDto.ArticleResponse.AuthorInfo authorInfo = new ArticleDto.ArticleResponse.AuthorInfo();
        authorInfo.setId(article.getAuthor().getId());
        authorInfo.setUsername(article.getAuthor().getUsername());
        authorInfo.setEmail(article.getAuthor().getEmail());
        response.setAuthor(authorInfo);

        return response;
    }
}

package com.knowledgesharing.repository;

import com.knowledgesharing.entity.Article;
import com.knowledgesharing.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    List<Article> findByPublishedTrueOrderByCreatedAtDesc();

    List<Article> findByAuthorOrderByCreatedAtDesc(User author);

    List<Article> findByCategory(Article.Category category);

    @Query("SELECT a FROM Article a WHERE a.published = true AND " +
            "(LOWER(a.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(a.content) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(a.tags) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Article> searchArticles(@Param("query") String query);

    @Query("SELECT a FROM Article a WHERE a.published = true AND " +
            "a.category = :category AND " +
            "(LOWER(a.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(a.content) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(a.tags) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Article> searchArticlesByCategory(@Param("query") String query,
            @Param("category") Article.Category category);

    List<Article> findByPublishedTrueAndCategory(Article.Category category);
}

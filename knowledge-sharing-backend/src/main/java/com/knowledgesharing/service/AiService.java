package com.knowledgesharing.service;

import com.knowledgesharing.dto.AiDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Random;

/**
 * AI Service - currently uses mocked responses.
 * To integrate real AI: set app.ai.mock=false and add OpenAI API key.
 * The method signatures and DTOs are designed for real API integration.
 */
@Service
public class AiService {

    @Value("${app.ai.mock:true}")
    private boolean useMock;

    private static final List<String> IMPROVED_INTROS = List.of(
            "In today's rapidly evolving tech landscape, ",
            "Understanding this concept is crucial for modern developers. ",
            "Let's explore this topic with clarity and depth. ");

    public AiDto.AiResponse improveContent(AiDto.ImproveRequest request) {
        if (useMock) {
            return mockImprove(request);
        }
        // TODO: Integrate OpenAI API
        // return callOpenAI(request);
        return mockImprove(request);
    }

    public AiDto.AiResponse summarizeContent(AiDto.SummarizeRequest request) {
        if (useMock) {
            return mockSummarize(request);
        }
        return mockSummarize(request);
    }

    public AiDto.AiResponse suggestTags(AiDto.TagSuggestionRequest request) {
        if (useMock) {
            return mockSuggestTags(request);
        }
        return mockSuggestTags(request);
    }

    private AiDto.AiResponse mockImprove(AiDto.ImproveRequest request) {
        String action = request.getAction() != null ? request.getAction() : "rewrite";
        String content = request.getContent();
        String result;

        switch (action.toLowerCase()) {
            case "grammar":
                result = content.trim()
                        .replaceAll("\\bi\\b", "I")
                        .replaceAll("(?<=[.?!])\\s+(?=[a-z])", " $0".toUpperCase())
                        + " [Grammar improved by AI]";
                break;
            case "concise":
                String[] words = content.split("\\s+");
                int limit = Math.max(30, words.length / 2);
                result = String.join(" ", Arrays.copyOfRange(words, 0, Math.min(limit, words.length)))
                        + "... [Concisely reformatted by AI Assistant]";
                break;
            case "title":
                String titleBase = request.getTitle() != null ? request.getTitle() : "Your Article";
                result = "💡 Suggested Title: \"" + titleBase + ": A Comprehensive Guide for Developers\"";
                break;
            default: // rewrite
                String intro = IMPROVED_INTROS.get(new Random().nextInt(IMPROVED_INTROS.size()));
                result = intro + content.trim()
                        + "\n\n*[Content enhanced and restructured by AI for better readability and engagement.]*";
        }

        return new AiDto.AiResponse(result, action, true);
    }

    private AiDto.AiResponse mockSummarize(AiDto.SummarizeRequest request) {
        String content = request.getContent();
        // Strip HTML tags for plain text summary
        String plainText = content.replaceAll("<[^>]*>", "").trim();
        String[] words = plainText.split("\\s+");
        int limit = Math.min(40, words.length);
        String summary = String.join(" ", Arrays.copyOfRange(words, 0, limit));
        if (words.length > 40)
            summary += "...";
        return new AiDto.AiResponse(summary, "summarize", true);
    }

    private AiDto.AiResponse mockSuggestTags(AiDto.TagSuggestionRequest request) {
        String content = (request.getContent() + " " + (request.getTitle() != null ? request.getTitle() : ""))
                .toLowerCase();
        StringBuilder tags = new StringBuilder();

        if (content.contains("react") || content.contains("frontend"))
            tags.append("react,frontend,");
        if (content.contains("java") || content.contains("spring"))
            tags.append("java,spring-boot,");
        if (content.contains("python"))
            tags.append("python,");
        if (content.contains("docker") || content.contains("kubernetes") || content.contains("devops"))
            tags.append("devops,docker,");
        if (content.contains("sql") || content.contains("database"))
            tags.append("database,sql,");
        if (content.contains("api") || content.contains("rest"))
            tags.append("api,rest,");
        if (content.contains("ai") || content.contains("machine learning"))
            tags.append("ai,machine-learning,");
        if (content.contains("node") || content.contains("javascript"))
            tags.append("nodejs,javascript,");
        if (content.contains("security") || content.contains("jwt"))
            tags.append("security,auth,");

        if (tags.length() == 0)
            tags.append("tech,programming,development");
        String result = tags.toString().replaceAll(",$", "");

        return new AiDto.AiResponse(result, "suggest-tags", true);
    }
}

package com.knowledgesharing.controller;

import com.knowledgesharing.dto.AiDto;
import com.knowledgesharing.service.AiService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/improve")
    public ResponseEntity<AiDto.AiResponse> improveContent(@Valid @RequestBody AiDto.ImproveRequest request) {
        return ResponseEntity.ok(aiService.improveContent(request));
    }

    @PostMapping("/summarize")
    public ResponseEntity<AiDto.AiResponse> summarize(@Valid @RequestBody AiDto.SummarizeRequest request) {
        return ResponseEntity.ok(aiService.summarizeContent(request));
    }

    @PostMapping("/suggest-tags")
    public ResponseEntity<AiDto.AiResponse> suggestTags(@Valid @RequestBody AiDto.TagSuggestionRequest request) {
        return ResponseEntity.ok(aiService.suggestTags(request));
    }
}

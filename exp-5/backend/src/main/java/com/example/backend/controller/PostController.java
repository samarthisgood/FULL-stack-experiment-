package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.PostRequest;
import com.example.backend.dto.ScheduleRequest;
import com.example.backend.model.Post;
import com.example.backend.service.PostService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
})
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Post>>> getAllPosts() {
        List<Post> posts = postService.getAllPosts();
        return ResponseEntity.ok(ApiResponse.success("Posts retrieved", posts));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Post>> getPostById(@PathVariable Long id) {
        Post post = postService.getPostById(id);
        return ResponseEntity.ok(ApiResponse.success("Post retrieved", post));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Post>> createPost(@Valid @RequestBody PostRequest request) {
        Post post = postService.createPost(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Post created", post));
    }

    /** Assignment 1: scheduling endpoint */
    @PostMapping("/schedule")
    public ResponseEntity<ApiResponse<Post>> schedulePost(@Valid @RequestBody ScheduleRequest request) {
        Post post = postService.schedulePost(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Post scheduled", post));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Post>> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody PostRequest request) {
        Post updated = postService.updatePost(id, request);
        return ResponseEntity.ok(ApiResponse.success("Post updated", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok(ApiResponse.success("Post deleted", null));
    }
}

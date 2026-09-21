package com.example.backend.service;

import com.example.backend.dto.PostRequest;
import com.example.backend.dto.ScheduleRequest;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Post;
import com.example.backend.repository.PostRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {

    private static final Logger log = LoggerFactory.getLogger(PostService.class);

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public List<Post> getAllPosts() {
        log.info("Fetching all posts");
        return postRepository.findAll();
    }

    public Post getPostById(Long id) {
        log.info("Processing request for Post ID: {}", id);
        return postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
    }

    public Post createPost(PostRequest request) {
        log.info("Creating post for platform: {}", request.getPlatform());
        Post post = new Post(request.getPlatform(), request.getContent());
        post.setStatus("PUBLISHED");
        return postRepository.save(post);
    }

    public Post schedulePost(ScheduleRequest request) {
        log.info("Scheduling post for platform: {} at {}", request.getPlatform(), request.getScheduledAt());
        Post post = new Post(request.getPlatform(), request.getContent());
        post.setStatus("SCHEDULED");
        post.setScheduledAt(request.getScheduledAt());
        return postRepository.save(post);
    }

    public Post updatePost(Long id, PostRequest request) {
        log.info("Updating Post ID: {}", id);
        Post existing = getPostById(id);
        existing.setPlatform(request.getPlatform());
        existing.setContent(request.getContent());
        return postRepository.save(existing);
    }

    public void deletePost(Long id) {
        log.info("Deleting Post ID: {}", id);
        if (!postRepository.existsById(id)) {
            throw new ResourceNotFoundException("Post not found with id: " + id);
        }
        postRepository.deleteById(id);
    }
}

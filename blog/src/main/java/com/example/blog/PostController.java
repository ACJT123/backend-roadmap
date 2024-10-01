package com.example.blog;

import jakarta.annotation.Nullable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
public class PostController {

    private final PostRepository postRepository;

    PostController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    /**
     * Get all posts or filter by title.
     *
     * @param term optional title term to filter posts
     * @return list of posts
     */
    @GetMapping
    public ResponseEntity<List<Post>> getPosts(@RequestParam @Nullable String term) {
        List<Post> posts = (term != null)
                ? postRepository.findAll(PostSpecification.titleContains(term))
                : postRepository.findAll();

        return ResponseEntity.ok(posts);
    }

    /**
     * Get a post by its ID.
     *
     * @param id the ID of the post
     * @return the found post
     */
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPost(@PathVariable Long id) {
        return postRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new PostNotFoundException(id));
    }

    /**
     * Delete a post by its ID.
     *
     * @param id the ID of the post to delete
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePost(@PathVariable Long id) {
        postRepository.deleteById(id);
    }

    /**
     * Create a new post.
     *
     * @param newPost the post to create
     * @return the created post
     */
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post newPost) {
        Post createdPost = postRepository.save(newPost);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
    }

    /**
     * Edit an existing post.
     *
     * @param newPost the new post data
     * @param id      the ID of the post to edit
     * @return the updated post
     */
    @PutMapping("/{id}")
    public ResponseEntity<Post> editPost(@RequestBody Post newPost, @PathVariable Long id) {
        return postRepository.findById(id)
                .map(existingPost -> {
                    existingPost.setTitle(newPost.getTitle());
                    existingPost.setCategory(newPost.getCategory());
                    existingPost.setContent(newPost.getContent());
                    Post updatedPost = postRepository.save(existingPost);
                    return ResponseEntity.ok(updatedPost);
                })
                .orElseGet(() -> {
                    newPost.setId(id); // Set ID to ensure the right ID is used
                    Post createdPost = postRepository.save(newPost);
                    return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
                });
    }
}

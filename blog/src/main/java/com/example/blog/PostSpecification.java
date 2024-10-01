package com.example.blog;

import org.springframework.data.jpa.domain.Specification;

public class PostSpecification {
    public static Specification<Post> titleContains(String term) {
        return (post, cq, cb) -> cb.like(post.get("title"), "%" + term + "%");
    }
}

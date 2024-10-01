package com.example.blog;

public class PostNotFoundException  extends RuntimeException{

    PostNotFoundException(Long id){
        super("Could not found post: " + id);
    }
}

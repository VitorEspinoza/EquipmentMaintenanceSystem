package br.com.backend.backend.Exceptions.Custom;

public class CategoryAlreadyExists extends RuntimeException {
    public CategoryAlreadyExists(String name) {
        super("Category with name '" + name + "' already exists.");
    }
}
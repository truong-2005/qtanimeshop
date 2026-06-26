package com.qtanime.animebackend.specification;

import org.springframework.data.jpa.domain.Specification;

import com.qtanime.animebackend.entity.Product;
import com.qtanime.animebackend.enums.ProductStatus;

public class ProductSpecification {

    private ProductSpecification() {
    }

    // =========================
    // SEARCH BY KEYWORD
    // =========================

    public static Specification<Product> hasKeyword(String keyword) {

        return (root, query, criteriaBuilder) -> {

            if (keyword == null || keyword.trim().isEmpty()) {
                return null;
            }

            String search = "%" + keyword.toLowerCase() + "%";

            return criteriaBuilder.or(

                    criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("name")),
                            search
                    ),

                    criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("slug")),
                            search
                    ),

                    criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("description")),
                            search
                    )
            );
        };
    }

    // =========================
    // FILTER CATEGORY
    // =========================

    public static Specification<Product> hasCategory(Long categoryId) {

        return (root, query, criteriaBuilder) -> {

            if (categoryId == null) {
                return null;
            }

            return criteriaBuilder.equal(
                    root.get("category").get("id"),
                    categoryId
            );
        };
    }

    // =========================
    // FILTER BRAND
    // =========================

    public static Specification<Product> hasBrand(Long brandId) {

        return (root, query, criteriaBuilder) -> {

            if (brandId == null) {
                return null;
            }

            return criteriaBuilder.equal(
                    root.get("brand").get("id"),
                    brandId
            );
        };
    }

    // =========================
    // FILTER MIN PRICE
    // =========================

    public static Specification<Product> minPrice(Double minPrice) {

        return (root, query, criteriaBuilder) -> {

            if (minPrice == null) {
                return null;
            }

            return criteriaBuilder.greaterThanOrEqualTo(
                    root.get("price"),
                    minPrice
            );
        };
    }

    // =========================
    // FILTER MAX PRICE
    // =========================

    public static Specification<Product> maxPrice(Double maxPrice) {

        return (root, query, criteriaBuilder) -> {

            if (maxPrice == null) {
                return null;
            }

            return criteriaBuilder.lessThanOrEqualTo(
                    root.get("price"),
                    maxPrice
            );
        };
    }

    // =========================
    // FILTER STATUS
    // =========================

    public static Specification<Product> hasStatus(
            ProductStatus status
    ) {

        return (root, query, criteriaBuilder) -> {

            if (status == null) {
                return null;
            }

            return criteriaBuilder.equal(
                    root.get("status"),
                    status
            );
        };
    }
}
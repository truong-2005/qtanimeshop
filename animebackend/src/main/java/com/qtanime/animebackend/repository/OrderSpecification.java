package com.qtanime.animebackend.repository;

import com.qtanime.animebackend.entity.Order;
import com.qtanime.animebackend.dto.order.OrderFilterRequest;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class OrderSpecification {
    public static Specification<Order> getFilter(OrderFilterRequest filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getSearch() != null && !filter.getSearch().trim().isEmpty()) {
                String likeSearch = "%" + filter.getSearch().toLowerCase() + "%";
                Predicate phoneMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("phone")), likeSearch);
                Predicate nameMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("receiverName")), likeSearch);
                predicates.add(criteriaBuilder.or(phoneMatch, nameMatch));
            }

            if (filter.getStatus() != null) {
                predicates.add(criteriaBuilder.equal(root.get("orderStatus"), filter.getStatus()));
            }

            if (filter.getPaymentStatus() != null) {
                predicates.add(criteriaBuilder.equal(root.get("paymentStatus"), filter.getPaymentStatus()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}

package com.qtanime.animebackend.repository;

import com.qtanime.animebackend.entity.Order;
import com.qtanime.animebackend.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);

    List<Order> findByOrderStatus(OrderStatus orderStatus);
}
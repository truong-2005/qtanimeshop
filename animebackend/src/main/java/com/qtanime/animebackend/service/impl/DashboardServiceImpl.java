package com.qtanime.animebackend.service.impl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.qtanime.animebackend.repository.OrderRepository;
import com.qtanime.animebackend.repository.ProductRepository;
import com.qtanime.animebackend.repository.UserRepository;
import com.qtanime.animebackend.service.DashboardService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final ProductRepository productRepository;

    private final UserRepository userRepository;

    private final OrderRepository orderRepository;

    @Override
    public Map<String, Object> getDashboardStatistics() {

        Map<String, Object> data = new HashMap<>();

        data.put("totalProducts", productRepository.count());

        data.put("totalUsers", userRepository.count());

        data.put("totalOrders", orderRepository.count());

        return data;
    }
}
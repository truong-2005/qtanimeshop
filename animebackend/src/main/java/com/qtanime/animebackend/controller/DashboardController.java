package com.qtanime.animebackend.controller;

import com.qtanime.animebackend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public Map<String, Object> getDashboardStatistics() {

        return dashboardService.getDashboardStatistics();
    }
}
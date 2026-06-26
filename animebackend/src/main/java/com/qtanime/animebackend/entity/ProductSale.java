package com.qtanime.animebackend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "product_sales")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSale extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private Double salePrice;

    private Integer salePercent;

    private LocalDateTime startDate;

    private LocalDateTime endDate;
}
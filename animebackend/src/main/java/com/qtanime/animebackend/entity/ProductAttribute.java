package com.qtanime.animebackend.entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "product_attributes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductAttribute extends BaseEntity {

    private String name;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @OneToMany(
            mappedBy = "productAttribute",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<ProductAttributeValue> values;
}
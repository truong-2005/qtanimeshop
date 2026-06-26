package com.qtanime.animebackend.service.impl;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.qtanime.animebackend.dto.product.ProductAttributeRequest;
import com.qtanime.animebackend.dto.product.ProductFilterRequest;
import com.qtanime.animebackend.dto.product.ProductImageRequest;
import com.qtanime.animebackend.dto.product.ProductRequest;
import com.qtanime.animebackend.dto.product.ProductResponse;
import com.qtanime.animebackend.dto.product.ProductSaleRequest;
import com.qtanime.animebackend.dto.product.ProductVariantRequest;
import com.qtanime.animebackend.entity.Brand;
import com.qtanime.animebackend.entity.Category;
import com.qtanime.animebackend.entity.Product;
import com.qtanime.animebackend.entity.ProductAttribute;
import com.qtanime.animebackend.entity.ProductAttributeValue;
import com.qtanime.animebackend.entity.ProductImage;
import com.qtanime.animebackend.entity.ProductSale;
import com.qtanime.animebackend.entity.ProductVariant;
import com.qtanime.animebackend.enums.ProductStatus;
import com.qtanime.animebackend.exception.BadRequestException;
import com.qtanime.animebackend.exception.ResourceNotFoundException;
import com.qtanime.animebackend.repository.BrandRepository;
import com.qtanime.animebackend.repository.CategoryRepository;
import com.qtanime.animebackend.repository.ProductAttributeRepository;
import com.qtanime.animebackend.repository.ProductAttributeValueRepository;
import com.qtanime.animebackend.repository.ProductImageRepository;
import com.qtanime.animebackend.repository.ProductRepository;
import com.qtanime.animebackend.repository.ProductSaleRepository;
import com.qtanime.animebackend.repository.ProductVariantRepository;
import com.qtanime.animebackend.service.ProductService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    private final CategoryRepository categoryRepository;

    private final BrandRepository brandRepository;

    private final ProductImageRepository productImageRepository;

    private final ProductAttributeRepository productAttributeRepository;

    private final ProductAttributeValueRepository
            productAttributeValueRepository;

    private final ProductVariantRepository
            productVariantRepository;

    private final ProductSaleRepository
            productSaleRepository;

    @Override
    public Page<ProductResponse> getAll(
            ProductFilterRequest request
    ) {

        Pageable pageable = PageRequest.of(
                request.getPage(),
                request.getSize(),
                Sort.by(
                        Sort.Direction.fromString(
                                request.getSortDirection()
                        ),
                        request.getSortBy()
                )
        );

        Page<Product> products =
                productRepository.findAll(pageable);

        return products.map(this::mapToResponse);
    }

    @Override
    public ProductResponse getById(Long id) {

        Product product =
                productRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Sản phẩm không tồn tại"
                                ));

        return mapToResponse(product);
    }

    @Override
    public ProductResponse getBySlug(String slug) {

        Product product =
                productRepository.findBySlug(slug)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Sản phẩm không tồn tại"
                                ));

        return mapToResponse(product);
    }

    @Override
    public ProductResponse create(
            ProductRequest request
    ) {

        if (
                productRepository.existsBySlug(
                        request.getSlug()
                )
        ) {

            throw new BadRequestException(
                    "Slug đã tồn tại"
            );
        }

        Category category =
                categoryRepository.findById(
                                request.getCategoryId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Danh mục không tồn tại"
                                ));

        Brand brand =
                brandRepository.findById(
                                request.getBrandId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Thương hiệu không tồn tại"
                                ));

       if (
        request.getThumbnailValidationMessage()
                != null
) {

    throw new BadRequestException(
            request.getThumbnailValidationMessage()
    );
}

String thumbnail =
        uploadFile(
                request.getThumbnail()
        );

        Product product = Product.builder()
                .name(request.getName())
                .slug(request.getSlug())
                .description(request.getDescription())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .thumbnail(thumbnail)
                .status(
                        request.getStatus() == null
                                ? ProductStatus.ACTIVE
                                : request.getStatus()
                )
                .category(category)
                .brand(brand)
                .build();

        productRepository.save(product);

        return mapToResponse(product);
    }

    @Override
    public ProductResponse update(
            Long id,
            ProductRequest request
    ) {

        Product product =
                productRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Sản phẩm không tồn tại"
                                ));

        Category category =
                categoryRepository.findById(
                                request.getCategoryId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Danh mục không tồn tại"
                                ));

        Brand brand =
                brandRepository.findById(
                                request.getBrandId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Thương hiệu không tồn tại"
                                ));

        product.setName(request.getName());

        product.setSlug(request.getSlug());

        product.setDescription(
                request.getDescription()
        );

        product.setPrice(request.getPrice());

        product.setQuantity(
                request.getQuantity()
        );

        if (
                request.getThumbnail() != null
                        &&
                        !request.getThumbnail().isEmpty()
        ) {

            product.setThumbnail(
                    uploadFile(
                            request.getThumbnail()
                    )
            );
        }

        product.setStatus(request.getStatus());

        product.setCategory(category);

        product.setBrand(brand);

        productRepository.save(product);

        return mapToResponse(product);
    }

    @Override
    public void delete(Long id) {

        Product product =
                productRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Sản phẩm không tồn tại"
                                ));

        productRepository.delete(product);
    }

    // =========================
    // PRODUCT IMAGE
    // =========================

    @Override
    public void addImage(
            Long productId,
            ProductImageRequest request
    ) {

        Product product =
                productRepository.findById(productId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Sản phẩm không tồn tại"
                                ));

        String imageUrl =
                uploadFile(
                        request.getImage()
                );

        ProductImage image =
                ProductImage.builder()
                        .image(imageUrl)
                        .product(product)
                        .build();

        productImageRepository.save(image);
    }

    @Override
    public void deleteImage(Long imageId) {

        ProductImage image =
                productImageRepository.findById(imageId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Hình ảnh không tồn tại"
                                ));

        productImageRepository.delete(image);
    }

    // =========================
    // PRODUCT ATTRIBUTE
    // =========================

    @Override
    public void addAttribute(
            Long productId,
            ProductAttributeRequest request
    ) {

        Product product =
                productRepository.findById(productId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Sản phẩm không tồn tại"
                                ));

        ProductAttribute attribute =
                ProductAttribute.builder()
                        .name(request.getName())
                        .product(product)
                        .build();

        productAttributeRepository.save(attribute);

        ProductAttributeValue value =
                ProductAttributeValue.builder()
                        .value(request.getValue())
                        .productAttribute(attribute)
                        .build();

        productAttributeValueRepository.save(value);
    }

    @Override
    public void deleteAttribute(
            Long attributeId
    ) {

        ProductAttribute attribute =
                productAttributeRepository.findById(
                                attributeId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Thuộc tính không tồn tại"
                                ));

        productAttributeRepository.delete(attribute);
    }

    // =========================
    // PRODUCT VARIANT
    // =========================

    @Override
    public void addVariant(
            Long productId,
            ProductVariantRequest request
    ) {

        Product product =
                productRepository.findById(productId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Sản phẩm không tồn tại"
                                ));

        ProductVariant variant =
                ProductVariant.builder()
                        .variantName(
                                request.getVariantName()
                        )
                        .price(request.getPrice())
                        .quantity(request.getQuantity())
                        .product(product)
                        .build();

        productVariantRepository.save(variant);
    }

    @Override
    public void deleteVariant(
            Long variantId
    ) {

        ProductVariant variant =
                productVariantRepository.findById(
                                variantId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Biến thể không tồn tại"
                                ));

        productVariantRepository.delete(variant);
    }

    // =========================
    // PRODUCT SALE
    // =========================

    @Override
    public void createSale(
            Long productId,
            ProductSaleRequest request
    ) {

        Product product =
                productRepository.findById(productId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Sản phẩm không tồn tại"
                                ));

        ProductSale sale =
                ProductSale.builder()
                        .product(product)
                        .salePrice(
                                request.getSalePrice()
                        )
                        .salePercent(
                                request.getSalePercent()
                        )
                        .startDate(
                                request.getStartDate()
                        )
                        .endDate(
                                request.getEndDate()
                        )
                        .build();

        productSaleRepository.save(sale);
    }

    @Override
    public void removeSale(Long productId) {

        ProductSale sale =
                productSaleRepository
                        .findByProductId(productId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Khuyến mãi không tồn tại"
                                ));

        productSaleRepository.delete(sale);
    }

    // =========================
    // UPLOAD FILE
    // =========================

    private String uploadFile(
            MultipartFile file
    ) {

        try {

            if (
                    file == null
                            ||
                            file.isEmpty()
            ) {

                return null;
            }

            File folder =
                    new File(
                            "uploads/products"
                    );

            if (!folder.exists()) {

                folder.mkdirs();
            }

            String fileName =
                    UUID.randomUUID()
                            +
                            "_"
                            +
                            file.getOriginalFilename();

            File destination =
                    new File(
                            folder.getAbsolutePath(),
                            fileName
                    );

            file.transferTo(destination);

            return "/uploads/products/"
                    +
                    fileName;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Upload file thất bại"
            );
        }
    }

    // =========================
    // MAP RESPONSE
    // =========================

    private ProductResponse mapToResponse(
            Product product
    ) {
        java.util.List<ProductResponse.ProductImageDto> imageDtos = new java.util.ArrayList<>();
        
        if (product.getThumbnail() != null) {
            imageDtos.add(ProductResponse.ProductImageDto.builder()
                    .id(-1L)
                    .imageUrl(product.getThumbnail())
                    .isPrimary(true)
                    .build());
        }
        
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            product.getImages().forEach(img -> {
                imageDtos.add(ProductResponse.ProductImageDto.builder()
                        .id(img.getId())
                        .imageUrl(img.getImage())
                        .isPrimary(false)
                        .build());
            });
        }
        
        java.util.List<ProductResponse.ProductAttributeDto> attributeDtos = new java.util.ArrayList<>();
        if (product.getAttributes() != null && !product.getAttributes().isEmpty()) {
            product.getAttributes().forEach(attr -> {
                String valStr = "";
                if (attr.getValues() != null && !attr.getValues().isEmpty()) {
                    valStr = attr.getValues().stream().map(v -> v.getValue()).reduce((a, b) -> a + ", " + b).orElse("");
                }
                attributeDtos.add(ProductResponse.ProductAttributeDto.builder()
                        .id(attr.getId())
                        .name(attr.getName())
                        .value(valStr)
                        .build());
            });
        }

        Double salePrice = null;
        if (product.getProductSale() != null) {
            ProductSale sale = product.getProductSale();
            LocalDateTime now = LocalDateTime.now();
            if ((sale.getStartDate() == null || !now.isBefore(sale.getStartDate())) &&
                (sale.getEndDate() == null || !now.isAfter(sale.getEndDate()))) {
                salePrice = sale.getSalePrice();
            }
        }

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(
                        product.getDescription()
                )
                .price(product.getPrice())
                .salePrice(salePrice)
                .quantity(
                        product.getQuantity()
                )
                .thumbnail(
                        product.getThumbnail()
                )
                .categoryName(
                        product.getCategory().getName()
                )
                .brandName(
                        product.getBrand().getName()
                )
                .status(
                        product.getStatus().name()
                )
                .images(imageDtos)
                .attributes(attributeDtos)
                .build();
    }
}
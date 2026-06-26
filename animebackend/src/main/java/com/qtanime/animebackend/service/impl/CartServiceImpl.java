package com.qtanime.animebackend.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.qtanime.animebackend.dto.cart.CartRequest;
import com.qtanime.animebackend.dto.cart.CartResponse;
import com.qtanime.animebackend.entity.Cart;
import com.qtanime.animebackend.entity.CartItem;
import com.qtanime.animebackend.entity.Product;
import com.qtanime.animebackend.entity.User;
import com.qtanime.animebackend.exception.ResourceNotFoundException;
import com.qtanime.animebackend.repository.CartItemRepository;
import com.qtanime.animebackend.repository.CartRepository;
import com.qtanime.animebackend.repository.ProductRepository;
import com.qtanime.animebackend.repository.UserRepository;
import com.qtanime.animebackend.service.CartService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;

    private final CartItemRepository cartItemRepository;

    private final ProductRepository productRepository;

    private final UserRepository userRepository;

    @Override
    public List<CartResponse> getMyCart() {

        User user = getCurrentUser();

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> createCart(user));

        List<CartResponse> responses = new ArrayList<>();

        for (CartItem item : cart.getCartItems()) {

            responses.add(
                    CartResponse.builder()
                            .cartItemId(item.getId())
                            .productId(item.getProduct().getId())
                            .productName(item.getProduct().getName())
                            .thumbnail(item.getProduct().getThumbnail())
                            .price(item.getPrice())
                            .quantity(item.getQuantity())
                            .totalPrice(item.getPrice() * item.getQuantity())
                            .build()
            );
        }

        return responses;
    }

    @Override
    public CartResponse addToCart(CartRequest request) {

        User user = getCurrentUser();

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Sản phẩm không tồn tại"));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> createCart(user));

        CartItem item = CartItem.builder()
                .cart(cart)
                .product(product)
                .quantity(request.getQuantity())
                .price(product.getPrice())
                .build();

        cartItemRepository.save(item);

        return CartResponse.builder()
                .cartItemId(item.getId())
                .productId(product.getId())
                .productName(product.getName())
                .thumbnail(product.getThumbnail())
                .price(product.getPrice())
                .quantity(item.getQuantity())
                .totalPrice(item.getPrice() * item.getQuantity())
                .build();
    }

    @Override
    public CartResponse updateQuantity(Long cartItemId, Integer quantity) {

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cart item không tồn tại"));

        item.setQuantity(quantity);

        cartItemRepository.save(item);

        return CartResponse.builder()
                .cartItemId(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .thumbnail(item.getProduct().getThumbnail())
                .price(item.getPrice())
                .quantity(item.getQuantity())
                .totalPrice(item.getPrice() * item.getQuantity())
                .build();
    }

    @Override
    public void removeItem(Long cartItemId) {

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cart item không tồn tại"));

        cartItemRepository.delete(item);
    }

    @Override
    public void clearCart() {

        User user = getCurrentUser();

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Giỏ hàng không tồn tại"));

        cartItemRepository.deleteAll(cart.getCartItems());
    }

    private Cart createCart(User user) {

        Cart cart = Cart.builder()
                .user(user)
                .cartItems(new ArrayList<>())
                .build();

        return cartRepository.save(cart);
    }

    private User getCurrentUser() {

        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User không tồn tại"));
    }
}
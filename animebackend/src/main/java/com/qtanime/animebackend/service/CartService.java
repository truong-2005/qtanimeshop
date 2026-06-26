package com.qtanime.animebackend.service;

import java.util.List;

import com.qtanime.animebackend.dto.cart.CartRequest;
import com.qtanime.animebackend.dto.cart.CartResponse;

public interface CartService {

    List<CartResponse> getMyCart();

    CartResponse addToCart(CartRequest request);

    CartResponse updateQuantity(Long cartItemId, Integer quantity);

    void removeItem(Long cartItemId);

    void clearCart();
}
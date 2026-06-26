package com.qtanime.animebackend.controller;

import com.qtanime.animebackend.dto.cart.CartRequest;
import com.qtanime.animebackend.dto.cart.CartResponse;
import com.qtanime.animebackend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    @GetMapping
    public List<CartResponse> getMyCart() {

        return cartService.getMyCart();
    }

    @PostMapping
    public CartResponse addToCart(
            @RequestBody CartRequest request
    ) {

        return cartService.addToCart(request);
    }

    @PutMapping("/{cartItemId}")
    public CartResponse updateQuantity(
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity
    ) {

        return cartService.updateQuantity(
                cartItemId,
                quantity
        );
    }

    @DeleteMapping("/{cartItemId}")
    public void removeItem(
            @PathVariable Long cartItemId
    ) {

        cartService.removeItem(cartItemId);
    }

    @DeleteMapping("/clear")
    public void clearCart() {

        cartService.clearCart();
    }
}
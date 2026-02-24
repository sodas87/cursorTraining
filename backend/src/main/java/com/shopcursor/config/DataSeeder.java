package com.shopcursor.config;

import com.shopcursor.model.Product;
import com.shopcursor.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedProducts(ProductRepository productRepository) {
        return args -> {
            List<Product> products = List.of(
                    new Product(
                            "Git Commit Hoodie",
                            "A cozy hoodie for those late-night commits. Features 'git commit -m \"fix: everything\"' on the back.",
                            new BigDecimal("59.99"),
                            "/images/hoodie.png",
                            "Apparel",
                            50
                    ),
                    new Product(
                            "404 Not Found Mug",
                            "The perfect mug for when your coffee is nowhere to be found. Holds 12oz of your favorite debugging fuel.",
                            new BigDecimal("14.99"),
                            "/images/mug.png",
                            "Drinkware",
                            100
                    ),
                    new Product(
                            "Rubber Duck Debugger",
                            "The original debugging companion. Explain your code to this duck and watch bugs disappear.",
                            new BigDecimal("9.99"),
                            "/images/duck.png",
                            "Accessories",
                            200
                    ),
                    new Product(
                            "Stack Overflow Keyboard",
                            "Mechanical keyboard with a dedicated 'Copy from Stack Overflow' key. Cherry MX switches.",
                            new BigDecimal("129.99"),
                            "/images/keyboard.png",
                            "Electronics",
                            30
                    ),
                    new Product(
                            "Semicolon Sticker Pack",
                            "50 semicolon stickers for your laptop. Because you never know when JavaScript needs one.",
                            new BigDecimal("7.99"),
                            "/images/stickers.png",
                            "Accessories",
                            500
                    ),
                    new Product(
                            "It Works On My Machine T-Shirt",
                            "The classic developer excuse, now wearable. 100% cotton, 0% accountability.",
                            new BigDecimal("24.99"),
                            "/images/tshirt.png",
                            "Apparel",
                            75
                    ),
                    new Product(
                            "Dark Mode Sunglasses",
                            "For when you accidentally switch to light mode. UV protection included.",
                            new BigDecimal("34.99"),
                            "/images/sunglasses.png",
                            "Accessories",
                            60
                    ),
                    new Product(
                            "Merge Conflict Resolution Dice",
                            "Can't resolve that merge conflict? Let fate decide. Set of 2 dice: 'Accept Ours' and 'Accept Theirs'.",
                            new BigDecimal("12.99"),
                            "/images/dice.png",
                            "Accessories",
                            150
                    )
            );

            productRepository.saveAll(products);
            System.out.println("Seeded " + products.size() + " developer products");
        };
    }
}

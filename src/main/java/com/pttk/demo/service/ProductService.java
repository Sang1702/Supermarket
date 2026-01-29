package com.pttk.demo.service;

import com.pttk.demo.dto.request.ProductCreationRequest;
import com.pttk.demo.dto.request.ProductUpdateRequest;
import com.pttk.demo.exception.AppException;
import com.pttk.demo.exception.ErrorCode;
import com.pttk.demo.model.Product;
import com.pttk.demo.repository.ProductRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductService {
    ProductRepository productRepository;

    public List<Product> getProducts() {
        return productRepository.findAll();
    }

    public Product getProduct(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    public List<Product> getProductByName(String name) {
        return productRepository.findAllByNameContainingIgnoreCase(name);
    }

    public Product createProduct(ProductCreationRequest request) {
        if (productRepository.existsByCode(request.getCode())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        Product product = new Product();
        product.setCode(request.getCode());
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setUnit(request.getUnit());
        product.setImportPrice(request.getImportPrice());
        product.setSalePrice(request.getSalePrice());
        product.setQuantity(request.getQuantity());
        product.setCategory(request.getCategory());

        return productRepository.save(product);
    }

    public Product updateProduct(String id, ProductUpdateRequest request) {
        Product product = getProduct(id);

        if (request.getCode() != null)
            product.setCode(request.getCode());
        if (request.getName() != null)
            product.setName(request.getName());
        if (request.getDescription() != null)
            product.setDescription(request.getDescription());
        if (request.getUnit() != null)
            product.setUnit(request.getUnit());
        if (request.getImportPrice() != null)
            product.setImportPrice(request.getImportPrice());
        if (request.getSalePrice() != null)
            product.setSalePrice(request.getSalePrice());
        if (request.getQuantity() != null)
            product.setQuantity(request.getQuantity());
        if (request.getCategory() != null)
            product.setCategory(request.getCategory());

        return productRepository.save(product);
    }

    public void deleteProduct(String id) {
        Product product = getProduct(id);
        productRepository.delete(product);
    }
}

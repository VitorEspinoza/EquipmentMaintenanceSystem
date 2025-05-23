package br.com.backend.backend.Controllers;

import br.com.backend.backend.DTOs.EquipmentCategory.EquipmentCategoryRequestDTO;
import br.com.backend.backend.DTOs.EquipmentCategory.EquipmentCategoryResponseDTO;
import br.com.backend.backend.DTOs.ResultViewModel;
import br.com.backend.backend.Services.EquipmentCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class EquipmentCategoryController {

    private final EquipmentCategoryService service;

    @GetMapping
    public ResponseEntity<ResultViewModel<List<EquipmentCategoryResponseDTO>>> getAll() {
        var categories = service.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResultViewModel<EquipmentCategoryResponseDTO>> getById(@PathVariable Integer id) {
        var category = service.getCategoryById(id);
        return ResponseEntity.ok(category);
    }

    @PostMapping
    public ResponseEntity<ResultViewModel<EquipmentCategoryResponseDTO>> create(@RequestBody EquipmentCategoryRequestDTO dto) {
        var created = service.createCategory(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResultViewModel<EquipmentCategoryResponseDTO>> update(@PathVariable Integer id, @RequestBody EquipmentCategoryRequestDTO dto) {
        var updated = service.updateCategory(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}

package br.com.backend.backend.Controllers;

import br.com.backend.backend.DTOs.EquipmentCategoryInputDTO;
import br.com.backend.backend.DTOs.EquipmentCategoryResponseDTO;
import br.com.backend.backend.Entities.EquipmentCategory;
import br.com.backend.backend.Services.EquipmentCategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
public class EquipmentCategoryController {

    private final EquipmentCategoryService service;

    public EquipmentCategoryController(EquipmentCategoryService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<EquipmentCategoryResponseDTO>> getAll() {
        var categories = service.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipmentCategoryResponseDTO> getById(@PathVariable Integer id) {
        var category = service.getCategoryById(id);
        return ResponseEntity.ok(category);
    }

    @PostMapping
    public ResponseEntity<EquipmentCategory> create(@RequestBody EquipmentCategoryInputDTO dto) {
        var created = service.createCategory(dto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EquipmentCategory> update(@PathVariable Integer id, @RequestBody EquipmentCategoryInputDTO dto) {
        var updated = service.updateCategory(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}

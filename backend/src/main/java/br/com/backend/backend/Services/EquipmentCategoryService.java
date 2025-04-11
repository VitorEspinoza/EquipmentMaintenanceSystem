package br.com.backend.backend.Services;

import br.com.backend.backend.DTOs.EquipmentCategoryInputDTO;
import br.com.backend.backend.DTOs.EquipmentCategoryResponseDTO;
import br.com.backend.backend.Entities.EquipmentCategory;
import br.com.backend.backend.Exceptions.Custom.CategoryAlreadyExists;
import br.com.backend.backend.Exceptions.Custom.EquipmentCategoryNotFoundException;
import br.com.backend.backend.Repositories.EquipmentCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EquipmentCategoryService {

    private final EquipmentCategoryRepository repository;

    public EquipmentCategoryService(EquipmentCategoryRepository repository) {
        this.repository = repository;
    }


    @Transactional(readOnly = true)
    public List<EquipmentCategoryResponseDTO> getAllCategories() {
        var categories = repository.findAll();
        return categories.stream()
                .map(EquipmentCategoryResponseDTO::fromEntity)
                .toList();
    }
    @Transactional(readOnly = true)
    public EquipmentCategoryResponseDTO getCategoryById(Integer id) {
        var category = repository.findById(id).orElseThrow(() -> new EquipmentCategoryNotFoundException(id));
        return EquipmentCategoryResponseDTO.fromEntity(category);
    }

    @Transactional
    public EquipmentCategory createCategory(EquipmentCategoryInputDTO equipmentCategoryInputDTO) {
        var categoryName = equipmentCategoryInputDTO.name();
        if (repository.findByNameIgnoreCase(categoryName).isPresent()) {
            throw new CategoryAlreadyExists(categoryName);
        }
        var category = EquipmentCategory.create(categoryName, equipmentCategoryInputDTO.description());
        return repository.save(category);
    }

    @Transactional
    public EquipmentCategory updateCategory(Integer id, EquipmentCategoryInputDTO equipmentCategoryInputDTO) {
        var category = repository.findById(id).orElseThrow(() -> new EquipmentCategoryNotFoundException(id));

        category.update(equipmentCategoryInputDTO.name(), equipmentCategoryInputDTO.description());

        return repository.save(category);
    }

    @Transactional
    public void deleteCategory(Integer id) {
        var category = repository.findById(id).orElseThrow(() -> new EquipmentCategoryNotFoundException(id));

        category.inactivate();
        repository.save(category);
    }
}

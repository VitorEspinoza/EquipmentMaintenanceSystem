package br.com.backend.backend.Services;

import br.com.backend.backend.DTOs.EquipmentCategoryInputDTO;
import br.com.backend.backend.DTOs.EquipmentCategoryResponseDTO;
import br.com.backend.backend.Entities.EquipmentCategory;
import br.com.backend.backend.Exceptions.Custom.EquipmentCategoryNotFoundException;
import br.com.backend.backend.Mappers.EquipmentCategoryMapper;
import br.com.backend.backend.Repositories.EquipmentCategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EquipmentCategoryService {
    private final EquipmentCategoryRepository repository;
    private final EquipmentCategoryMapper mapper;

    public EquipmentCategoryService(EquipmentCategoryRepository repository, EquipmentCategoryMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<EquipmentCategoryResponseDTO> getAllCategories() {
        var categories = repository.findAll();
        return mapper.toDtoList(categories);
    }
    @Transactional(readOnly = true)
    public EquipmentCategoryResponseDTO getCategoryById(Integer id) {
        var category = repository.findById(id).orElseThrow(() -> new EquipmentCategoryNotFoundException(id));
        return mapper.toDto(category);
    }

    @Transactional
    public EquipmentCategory createCategory(EquipmentCategoryInputDTO equipmentCategoryInputDTO) {
        var category = EquipmentCategory.create(equipmentCategoryInputDTO.name(), equipmentCategoryInputDTO.description());
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

package br.com.backend.backend.Services;

import br.com.backend.backend.DTOs.EquipmentCategoryInputDTO;
import br.com.backend.backend.DTOs.EquipmentCategoryResponseDTO;
import br.com.backend.backend.DTOs.ResultViewModel;
import br.com.backend.backend.Entities.EquipmentCategory;
import br.com.backend.backend.Exceptions.Custom.CategoryAlreadyExists;
import br.com.backend.backend.Exceptions.Custom.EquipmentCategoryNotFoundException;
import br.com.backend.backend.Mappers.EquipmentCategoryMapper;
import br.com.backend.backend.Repositories.EquipmentCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    public ResultViewModel<List<EquipmentCategoryResponseDTO>> getAllCategories() {
        var categories = repository.findAll();

        return ResultViewModel.success(mapper.toDtoList(categories));
    }

    @Transactional(readOnly = true)
    public ResultViewModel<EquipmentCategoryResponseDTO> getCategoryById(Integer id) {
        var category = repository.findById(id).orElseThrow(() -> new EquipmentCategoryNotFoundException(id));

        return ResultViewModel.success(mapper.toDto(category));
    }

    @Transactional
    public ResultViewModel<EquipmentCategoryResponseDTO> createCategory(EquipmentCategoryInputDTO dto) {
        var categoryName = dto.name();

        if (repository.findByNameIgnoreCase(categoryName).isPresent()) {
            throw new CategoryAlreadyExists(categoryName);
        }

        var category = mapper.toEntity(dto);
        var savedCategory = repository.save(category);

        return ResultViewModel.success(mapper.toDto(savedCategory));
    }

    @Transactional
    public ResultViewModel<EquipmentCategoryResponseDTO> updateCategory(Integer id, EquipmentCategoryInputDTO dto) {
        var category = repository.findById(id).orElseThrow(() -> new EquipmentCategoryNotFoundException(id));

        category.update(dto.name(), dto.description());
        var updatedCategory = repository.save(category);

        return ResultViewModel.success(mapper.toDto(updatedCategory));
    }

    @Transactional
    public void deleteCategory(Integer id) {
        var category = repository.findById(id).orElseThrow(() -> new EquipmentCategoryNotFoundException(id));

        category.inactivate();
        repository.save(category);
    }
}

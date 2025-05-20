package br.com.backend.backend.Services;

import br.com.backend.backend.DTOs.EquipmentCategoryRequestDTO;
import br.com.backend.backend.DTOs.EquipmentCategoryResponseDTO;
import br.com.backend.backend.DTOs.ResultViewModel;
import br.com.backend.backend.Exceptions.Custom.CategoryAlreadyExists;
import br.com.backend.backend.Exceptions.Custom.EquipmentCategoryNotFoundException;
import br.com.backend.backend.Repositories.EquipmentCategoryRepository;
import lombok.RequiredArgsConstructor;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EquipmentCategoryService {

    private final EquipmentCategoryRepository repository;

    @Transactional(readOnly = true)
    public ResultViewModel<List<EquipmentCategoryResponseDTO>> getAllCategories() {
        var categories = repository.findAll();

        return ResultViewModel.success(
                categories.stream()
                        .map(EquipmentCategoryResponseDTO::fromEntity)
                        .toList()
        );
    }

    @Transactional(readOnly = true)
    public ResultViewModel<EquipmentCategoryResponseDTO> getCategoryById(Integer id) {
        var category = repository.findById(id).orElseThrow(() -> new EquipmentCategoryNotFoundException(id));


        return ResultViewModel.success(EquipmentCategoryResponseDTO.fromEntity(category));
    }

    @Transactional
    public ResultViewModel<EquipmentCategoryResponseDTO> createCategory(EquipmentCategoryRequestDTO dto) {
        var categoryName = dto.name();

        if (repository.findByNameIgnoreCase(categoryName).isPresent()) {
            throw new CategoryAlreadyExists(categoryName);
        }

        var category = dto.toEntity();
        var savedCategory = repository.save(category);

        return ResultViewModel.success(EquipmentCategoryResponseDTO.fromEntity(savedCategory));
    }

    @Transactional
    public ResultViewModel<EquipmentCategoryResponseDTO> updateCategory(Integer id, EquipmentCategoryRequestDTO dto) {
        var category = repository.findById(id).orElseThrow(() -> new EquipmentCategoryNotFoundException(id));

        category.update(dto.name(), dto.description());
        var updatedCategory = repository.save(category);

        return ResultViewModel.success(EquipmentCategoryResponseDTO.fromEntity(updatedCategory));
    }

    @Transactional
    public void deleteCategory(Integer id) {
        var category = repository.findById(id).orElseThrow(() -> new EquipmentCategoryNotFoundException(id));

        category.inactivate();
        repository.save(category);
    }
}

package br.com.backend.backend.Services;

import br.com.backend.backend.DTOs.EquipmentCategory.EquipmentCategoryRequestDTO;
import br.com.backend.backend.DTOs.EquipmentCategory.EquipmentCategoryResponseDTO;
import br.com.backend.backend.DTOs.ResultViewModel;
import br.com.backend.backend.Entities.Employee;
import br.com.backend.backend.Entities.EquipmentCategory;
import br.com.backend.backend.Exceptions.Custom.CategoryAlreadyExists;
import br.com.backend.backend.Exceptions.Custom.EquipmentCategoryNotFoundException;
import br.com.backend.backend.Filters.EmployeeSpecifications;
import br.com.backend.backend.Filters.EquipmentCategorySpecifications;
import br.com.backend.backend.Repositories.EquipmentCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EquipmentCategoryService {

    private final EquipmentCategoryRepository repository;

    @Transactional(readOnly = true)
    public ResultViewModel<List<EquipmentCategoryResponseDTO>> getAllCategories(Boolean active) {
        Specification<EquipmentCategory> spec = Specification.where((EquipmentCategorySpecifications.isActive(active)));

        var categories = repository.findAll(spec);

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

        if (nameCategoryAlreadyInUse(categoryName, null)) {
            throw new CategoryAlreadyExists(categoryName);
        }

        var category = dto.toEntity();
        var savedCategory = repository.save(category);

        return ResultViewModel.success(EquipmentCategoryResponseDTO.fromEntity(savedCategory));
    }

    @Transactional
    public ResultViewModel<EquipmentCategoryResponseDTO> updateCategory(Integer id, EquipmentCategoryRequestDTO dto) {
        var category = repository.findById(id).orElseThrow(() -> new EquipmentCategoryNotFoundException(id));

        if (nameCategoryAlreadyInUse(dto.name(), id)) {
            throw new CategoryAlreadyExists(dto.name());
        }

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

    private boolean nameCategoryAlreadyInUse(String name, Integer id) {
        return Optional.ofNullable(id)
                .map(existingId -> repository.findByNameIgnoreCaseAndIdNot(name, id))
                .orElseGet(() ->  repository.findByNameIgnoreCase(name))
                .isPresent();
    }
}

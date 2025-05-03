package br.com.backend.backend.Services;

import br.com.backend.backend.DTOs.EquipmentCategoryRequestDTO;
import br.com.backend.backend.DTOs.EquipmentCategoryResponseDTO;
import br.com.backend.backend.DTOs.ResultViewModel;
import br.com.backend.backend.Exceptions.Custom.CategoryAlreadyExists;
import br.com.backend.backend.Exceptions.Custom.EquipmentCategoryNotFoundException;
import br.com.backend.backend.Mappers.EquipmentCategoryMapper;
import br.com.backend.backend.Repositories.EquipmentCategoryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
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

        return ResultViewModel.success(mapper.entitiesToDtos(categories));
    }

    @Transactional(readOnly = true)
    public ResultViewModel<EquipmentCategoryResponseDTO> getCategoryById(Integer id) {
        var category = repository.findById(id).orElseThrow(() -> new EquipmentCategoryNotFoundException(id));


        return ResultViewModel.success(mapper.entityToDto(category));
    }

    @Transactional
    public ResultViewModel<EquipmentCategoryResponseDTO> createCategory(EquipmentCategoryRequestDTO dto) {
        var categoryName = dto.name();

        if (repository.findByNameIgnoreCase(categoryName).isPresent()) {
            throw new CategoryAlreadyExists(categoryName);
        }

        var category = mapper.requestDtoToEntity(dto);
        var savedCategory = repository.save(category);


        ObjectMapper mappesr = new ObjectMapper();

        try {
            var valorMapeado = mapper.entityToDto(savedCategory);
            var id = savedCategory.getId();
            var teste = mappesr.convertValue(valorMapeado, EquipmentCategoryResponseDTO.class);
            var sda = 2;
        }
        catch (Exception e) {
            e.printStackTrace();
        }

        return ResultViewModel.success(mapper.entityToDto(savedCategory));
    }

    @Transactional
    public ResultViewModel<EquipmentCategoryResponseDTO> updateCategory(Integer id, EquipmentCategoryRequestDTO dto) {
        var category = repository.findById(id).orElseThrow(() -> new EquipmentCategoryNotFoundException(id));

        category.update(dto.name(), dto.description());
        var updatedCategory = repository.save(category);

        return ResultViewModel.success(mapper.entityToDto(updatedCategory));
    }

    @Transactional
    public void deleteCategory(Integer id) {
        var category = repository.findById(id).orElseThrow(() -> new EquipmentCategoryNotFoundException(id));

        category.inactivate();
        repository.save(category);
    }
}

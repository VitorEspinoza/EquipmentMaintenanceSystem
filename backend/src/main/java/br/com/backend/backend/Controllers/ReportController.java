package br.com.backend.backend.Controllers;

import br.com.backend.backend.DTOs.ResultViewModel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reports")
public class ReportController {

    @GetMapping("/revenue")
    public ResultViewModel<byte[]> getRevenue() {
        return
    }
}

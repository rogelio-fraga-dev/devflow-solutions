package com.devflow.controller;

import com.devflow.service.RelatorioPdfService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/projetos")
public class RelatorioPdfController {

    private final RelatorioPdfService relatorioPdfService;

    public RelatorioPdfController(RelatorioPdfService relatorioPdfService) {
        this.relatorioPdfService = relatorioPdfService;
    }

    @GetMapping("/{id}/financeiro/closeout/pdf")
    public ResponseEntity<byte[]> baixarProjectCloseout(@PathVariable Long id) {
        byte[] pdfBytes = relatorioPdfService.gerarProjectCloseoutPdf(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "devflow_closeout_projeto_" + id + ".pdf");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}

package com.example.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.io.IOException;

import jakarta.servlet.http.HttpServletResponse;

@Controller
public class HomeController {

    @GetMapping("/")
    public void redirectToFrontend(HttpServletResponse response) throws IOException {
        response.sendRedirect("http://localhost:5173");
    }
}

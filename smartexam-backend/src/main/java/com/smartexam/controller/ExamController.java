package com.smartexam.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/exams")
public class ExamController {

    @GetMapping
    public ResponseEntity<?> getAvailableExams() {
        return ResponseEntity.ok(Map.of(
            "status", "SUCCESS",
            "message", "Active and scheduled examinations retrieved successfully"
        ));
    }

    @PostMapping("/{examId}/start")
    public ResponseEntity<?> startExamAttempt(@PathVariable String examId, @RequestHeader("Authorization") String token) {
        Map<String, Object> response = new HashMap<>();
        response.put("attemptId", "att_" + System.currentTimeMillis());
        response.put("examId", examId);
        response.put("status", "IN_PROGRESS");
        response.put("serverStartTime", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/attempts/{attemptId}/answers")
    public ResponseEntity<?> autoSaveAnswer(@PathVariable String attemptId, @RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(Map.of(
            "status", "SAVED",
            "attemptId", attemptId,
            "savedAt", System.currentTimeMillis()
        ));
    }

    @PostMapping("/attempts/{attemptId}/submit")
    public ResponseEntity<?> submitExamAttempt(@PathVariable String attemptId, @RequestBody Map<String, Object> payload) {
        Map<String, Object> response = new HashMap<>();
        response.put("attemptId", attemptId);
        response.put("status", "SUBMITTED");
        response.put("submittedAt", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
}

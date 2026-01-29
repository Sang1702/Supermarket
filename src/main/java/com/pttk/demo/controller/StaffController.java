package com.pttk.demo.controller;

import com.pttk.demo.model.Staff;
import com.pttk.demo.service.StaffService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/staff")
public class StaffController {
    StaffService staffService;

    @GetMapping
    public List<Staff> getStaffs() {
        return staffService.getStaffs();
    }

    @GetMapping("/{id}")
    public Staff getStaff(@PathVariable String id) {
        return staffService.getStaff(id);
    }

    @GetMapping("/search")
    public List<Staff> searchStaffs(@RequestParam("position") String position) {
        return staffService.searchStaffsByPosition(position);
    }
}

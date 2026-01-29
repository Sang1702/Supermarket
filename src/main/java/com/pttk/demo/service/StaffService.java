package com.pttk.demo.service;

import com.pttk.demo.exception.AppException;
import com.pttk.demo.exception.ErrorCode;
import com.pttk.demo.model.Staff;
import com.pttk.demo.repository.StaffRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StaffService {
    StaffRepository staffRepository;

    public List<Staff> getStaffs() {
        return staffRepository.findAll();
    }

    public Staff getStaff(String id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_EXISTED));
    }

    public List<Staff> searchStaffsByPosition(String position) {
        return staffRepository.findByPositionContainingIgnoreCase(position);
    }
}

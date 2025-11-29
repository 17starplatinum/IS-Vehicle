package ru.ifmo.se.dto.responses;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageResponse<T> {
    private List<T> items;
    @PositiveOrZero
    private int page;
    @Positive
    private int pageSize;
    @PositiveOrZero
    private long total;
}

package ru.ifmo.se.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.Objects;

@Entity
@Table
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Coordinates {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private long x;

    @NotNull(message = "Поле 'y' не может быть null")
    private Double y;

    @Override
    public String toString() {
        return "x = " + x + ", y = " + y;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Coordinates c = (Coordinates) o;
        return x == c.x && Objects.equals(y, c.y);
    }
}

package ru.ifmo.se.entities;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.Objects;

@RequiredArgsConstructor
public enum VehicleType {
    PLANE("plane"),
    DRONE("drone"),
    SHIP("ship"),
    HOVERBOARD("hoverboard");

    @Getter
    private final String value;

    public static VehicleType fromValue(String value){
        return Arrays.stream(VehicleType.values())
                .filter(e -> Objects.equals(e.getValue(), value.toLowerCase()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("VehicleType should be one of the following: PLANE, DRONE, SHIP, HOVERBOARD"));
    }
}

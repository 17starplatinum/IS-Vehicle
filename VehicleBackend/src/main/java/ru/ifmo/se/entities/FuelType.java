package ru.ifmo.se.entities;


import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.Objects;

@RequiredArgsConstructor
public enum FuelType {
    GASOLINE("gasoline"),
    KEROSENE("kerosene"),
    ALCOHOL("alcohol"),
    NUCLEAR("nuclear"),
    ANTIMATTER("antimatter");

    @Getter
    private final String value;

    public static FuelType fromValue(String value){
        return Arrays.stream(FuelType.values())
                .filter(e -> Objects.equals(e.getValue(), value.toLowerCase()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("FuelType should be one of the following: GASOLINE, KEROSENE, ALCOHOL, NUCLEAR, ANTIMATTER"));
    }
}
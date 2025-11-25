package ru.ifmo.se.mappers;

import org.mapstruct.MapperConfig;
import org.mapstruct.ReportingPolicy;

@MapperConfig(
        componentModel = "cdi",
        injectionStrategy = org.mapstruct.InjectionStrategy.CONSTRUCTOR,
        unmappedTargetPolicy = ReportingPolicy.ERROR
)
public interface BaseMapper {
    // Пустой интерфейс для наследования конфигурации
}
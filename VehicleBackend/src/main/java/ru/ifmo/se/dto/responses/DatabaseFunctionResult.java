package ru.ifmo.se.dto.responses;

import java.math.BigDecimal;
import java.math.BigInteger;

public record DatabaseFunctionResult(
        Object[] row
) {
    public <T> T get(int index, Class<T> type) {
        if (row == null || row.length < index) {
            throw new IndexOutOfBoundsException("Column index " + index + " is out of bounds");
        }
        Object value = row[index];
        if (value == null) {
            return null;
        }
        if (type.isInstance(value)) {
            return type.cast(value);
        }

        if (type == Long.class && value instanceof BigInteger) {
            return type.cast(((BigInteger) value).longValue());
        }
        if (type == Double.class && value instanceof BigDecimal) {
            return type.cast(((BigDecimal) value).doubleValue());
        }
        throw new ClassCastException("Cannot cast " + value.getClass() + " to " + type);
    }
}

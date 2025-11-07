package ru.ifmo.se.mappers;

import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import ru.ifmo.se.dto.responses.ErrorResponse;
import ru.ifmo.se.exceptions.HttpStatus;

@Provider
public class VehicleExceptionMapper implements ExceptionMapper<Throwable> {
    @Override
    public Response toResponse(Throwable throwable) {
        Class<?> cls = throwable.getClass();
        HttpStatus a = cls.getAnnotation(HttpStatus.class);
        int status = a != null ? a.value() : 500;
        ErrorResponse response = new ErrorResponse(status, throwable.getMessage());
        return Response.status(status).entity(response).type(MediaType.APPLICATION_JSON).build();
    }
}

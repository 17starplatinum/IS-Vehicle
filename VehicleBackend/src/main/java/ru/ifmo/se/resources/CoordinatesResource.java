package ru.ifmo.se.resources;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import ru.ifmo.se.dto.requests.CoordinatesRequest;
import ru.ifmo.se.dto.responses.CoordinatesResponse;
import ru.ifmo.se.dto.responses.PageResponse;
import ru.ifmo.se.services.api.CoordinatesService;
import ru.ifmo.se.validation.CoordinatesValidator;
import ru.ifmo.se.validation.VehicleValidator;
import ru.ifmo.se.websocket.VehicleWebSocket;


@Path("/coordinates")
@Produces(MediaType.APPLICATION_JSON)
public class CoordinatesResource {
    @Inject
    private CoordinatesService coordinatesService;

    @Inject
    private VehicleWebSocket vehicleWebSocket;

    @Inject
    private CoordinatesValidator coordinatesValidator;

    @GET
    public Response getCoordinates(@QueryParam("page") @DefaultValue("1") int page,
                                @QueryParam("size") @DefaultValue("10") int size,
                                @QueryParam("sortBy") @DefaultValue("id") String sortBy,
                                @QueryParam("ascending") @DefaultValue("true") boolean ascending) {
        if (coordinatesValidator.isValidSortField(sortBy)) {
            String validFieldsString = String.join(", ", VehicleValidator.getValidFields());
            throw new IllegalArgumentException("Sorting field is not valid. Must be one of: " + validFieldsString);
        }
        ascending = coordinatesValidator.validateGetParameters(page, size, ascending);
        PageResponse<CoordinatesResponse> coordinates = coordinatesService.getCoordinates(page, size, sortBy, ascending);
        return Response.ok(coordinates, MediaType.APPLICATION_JSON).build();
    }

    @GET
    @Path("/{id}")
    public Response getCoordinates(@PathParam("id") Long id) {
        coordinatesValidator.validateId(id);
        return Response.ok(coordinatesService.getCoordinatesById(id), MediaType.APPLICATION_JSON).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createCoordinates(@Valid CoordinatesRequest request) {
        CoordinatesResponse response = coordinatesService.saveCoordinates(request);
        vehicleWebSocket.notifyCoordinatesCreated(response.getId());
        return Response.status(Response.Status.CREATED).entity(response).build();
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateCoordinates(@PathParam("id") Long id, @Valid CoordinatesRequest request) {
        coordinatesValidator.validateId(id);
        CoordinatesResponse updated = coordinatesService.updateCoordinates(id, request);
        vehicleWebSocket.notifyCoordinatesUpdated(updated.getId());
        return Response.ok(updated).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteCoordinates(@PathParam("id") Long id) {
        coordinatesValidator.validateId(id);
        coordinatesService.deleteCoordinatesById(id);
        vehicleWebSocket.notifyCoordinatesDeleted(id);
        return Response.noContent().build();
    }
}

package ru.ifmo.se.resources;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import ru.ifmo.se.dto.requests.VehicleRequest;
import ru.ifmo.se.dto.responses.MapResponse;
import ru.ifmo.se.dto.responses.PageResponse;
import ru.ifmo.se.dto.responses.SimpleResponse;
import ru.ifmo.se.dto.responses.VehicleResponse;
import ru.ifmo.se.entities.FuelType;
import ru.ifmo.se.services.api.VehicleService;
import ru.ifmo.se.validation.VehicleValidator;
import ru.ifmo.se.validation.annotations.ValidEnum;
import ru.ifmo.se.websocket.VehicleWebSocket;

@Path("/vehicles")
@Produces(MediaType.APPLICATION_JSON)
public class VehicleResource {

    @Inject
    private VehicleService vehicleService;

    @Inject
    private VehicleValidator vehicleValidator;

    @Inject
    private VehicleWebSocket vehicleWebSocket;

    @GET
    public Response getVehicles(@QueryParam("page") @DefaultValue("1") int page,
                                @QueryParam("size") @DefaultValue("10") int size,
                                @QueryParam("sortBy") @DefaultValue("id") String sortBy,
                                @QueryParam("ascending") @DefaultValue("true") boolean ascending,
                                @QueryParam("fuelType") @ValidEnum(enumClass = FuelType.class) String fuelType,
                                @QueryParam("min") Double min, @QueryParam("max") Double max,
                                @QueryParam("filter") @DefaultValue("") String filter) {
        if (vehicleValidator.isValidSortField(sortBy)) {
            String validFieldsString = String.join(", ", VehicleValidator.getValidFields());
            throw new IllegalArgumentException("Sorting field is not valid. Must be one of: " + validFieldsString);
        }
        if (min != null && max != null) {
            vehicleValidator.validateRange(min, max);
        }
        Boolean enginePowerRangeEnabled = min != null && max != null;
        ascending = vehicleValidator.validateGetParameters(page, size, ascending);
        PageResponse<VehicleResponse> vehicles = vehicleService.getVehicles(page, size, sortBy, ascending, fuelType, enginePowerRangeEnabled, min, max, filter);
        return Response.ok(vehicles, MediaType.APPLICATION_JSON).build();
    }

    @GET
    @Path("/{id}")
    public Response getVehicle(@PathParam("id") Long id) {
        vehicleValidator.validateId(id);
        return Response.ok(vehicleService.getVehicleById(id), MediaType.APPLICATION_JSON).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createVehicle(@Valid VehicleRequest request) {
        VehicleResponse response = vehicleService.saveVehicle(request);
        vehicleWebSocket.notifyVehicleCreated(response.getId());
        return Response.status(Response.Status.CREATED).entity(response).build();
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateVehicle(@PathParam("id") Long id, @Valid VehicleRequest request) {
        vehicleValidator.validateId(id);
        VehicleResponse updated = vehicleService.updateVehicle(id, request);
        vehicleWebSocket.notifyVehicleUpdated(updated.getId());
        return Response.ok(updated).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteVehicle(@PathParam("id") Long id) {
        vehicleService.deleteVehicleById(id);
        vehicleWebSocket.notifyVehicleDeleted(id);
        return Response.noContent().build();
    }

    @GET
    @Path("/special/total-fuel-consumption")
    public Response getTotalFuelConsumption() {
        return Response.ok(new SimpleResponse<>(vehicleService.calculateFuelConsumptionSum())).build();
    }

    @GET
    @Path("/special/group-by-fuel-consumption")
    public Response getGroupByFuelConsumption() {
        return Response.ok(new MapResponse<>(vehicleService.groupVehiclesByFuelConsumption())).build();
    }

    @PATCH
    @Path("/special/reset-distance/{id}")
    public Response resetTravelledDistance(@PathParam("id") Long id) {
        vehicleValidator.validateId(id);
        vehicleService.resetDistanceTravelled(id);
        vehicleWebSocket.notifyVehicleDistanceReset(id);
        return Response.ok().build();
    }
}

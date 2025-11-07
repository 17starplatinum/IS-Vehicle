package ru.ifmo.se.resources;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import ru.ifmo.se.dto.requests.VehicleRequest;
import ru.ifmo.se.dto.responses.VehicleResponse;
import ru.ifmo.se.services.api.VehicleService;
import ru.ifmo.se.websocket.VehicleWebSocket;

import java.util.List;

@Path("/vehicles")
@Produces(MediaType.APPLICATION_JSON)
public class VehicleResource {

    @Inject
    private VehicleService vehicleService;

    @Inject
    private VehicleWebSocket vehicleWebSocket;

    @GET
    public Response getVehicles(@QueryParam("page") @DefaultValue("1") int page,
                                @QueryParam("size") @DefaultValue("10") int size,
                                @QueryParam("sortBy") @DefaultValue("id") String sortBy,
                                @QueryParam("ascending") @DefaultValue("true") boolean ascending) {

        List<VehicleResponse> vehicles = vehicleService.getVehicles(page, size, sortBy, ascending);
        return Response.ok(vehicles, MediaType.APPLICATION_JSON).build();
    }

    @GET
    @Path("/{id}")
    public Response getVehicle(@PathParam("id") Long id) {
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
        return Response.ok(vehicleService.calculateFuelConsumptionSum()).build();
    }

    @GET
    @Path("/special/group-by-fuel")
    public Response getGroupByFuelConsumption() {
        return Response.ok(vehicleService.groupVehiclesByFuelConsumption()).build();
    }

    @GET
    @Path("/special/fuel-type-less")
    public Response getFuelTypeLess(@QueryParam("fuelType") String fuelType) {
        return Response.ok(vehicleService.findByFuelTypeLessThan(fuelType)).build();
    }

    @GET
    @Path("/special/power-range")
    public Response getPowerRange(@QueryParam("min") Double min, @QueryParam("max") Double max) {
        return Response.ok(vehicleService.findByEnginePowerRange(min, max)).build();
    }

    @PATCH
    @Path("/special/reset-distance/{id}")
    public Response resetTravelledDistance(@PathParam("id") Long id) {
        vehicleService.resetDistanceTravelled(id);
        vehicleWebSocket.notifyVehicleDistanceReset(id);
        return Response.ok().build();
    }
}

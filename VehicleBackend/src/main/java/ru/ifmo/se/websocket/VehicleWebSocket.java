package ru.ifmo.se.websocket;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;

import java.io.IOException;
import java.util.concurrent.CopyOnWriteArraySet;

@ServerEndpoint("/vehicles-updates")
@ApplicationScoped
public class VehicleWebSocket {
    private final CopyOnWriteArraySet<Session> sessions = new CopyOnWriteArraySet<>();

    @OnOpen
    public void onOpen(Session session) {
        sessions.add(session);
    }

    @OnClose
    public void onClose(Session session) {
        sessions.remove(session);
    }

    public void notifyVehicleCreated(Long vehicleId) {
        sendMessage("CREATE VEHICLE: " + vehicleId);
    }

    public void notifyVehicleUpdated(Long vehicleId) {
        sendMessage("UPDATE VEHICLE: " + vehicleId);
    }

    public void notifyVehicleDeleted(Long vehicleId) {
        sendMessage("DELETE VEHICLE: " + vehicleId);
    }

    public void notifyVehicleDistanceReset(Long vehicleId) {
        sendMessage("RESET VEHICLE DISTANCE: " + vehicleId);
    }

    public void notifyCoordinatesCreated(Long coordinatesId) {
        sendMessage("CREATE COORDINATES: " + coordinatesId);
    }

    public void notifyCoordinatesUpdated(Long coordinatesId) {
        sendMessage("UPDATE COORDINATES: " + coordinatesId);
    }

    public void notifyCoordinatesDeleted(Long coordinatesId) {
        sendMessage("DELETE COORDINATES: " + coordinatesId);
    }

    private void sendMessage(String message) {
        sessions.forEach(session -> {
            try {
                if (session.isOpen()) {
                    session.getBasicRemote().sendText(message);
                }
            } catch (IOException e) {
                sessions.remove(session);
            }
        });
    }
}

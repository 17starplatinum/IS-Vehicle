import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Vehicle, Coordinates } from "../models/vehicle.model";
import { API_PATH_VEHICLES, API_PATH_COORDS, SPECIAL_API_POSTFIX } from "../../app.config";
import { CreateCoordinatesRequest, CreateVehicleRequest } from "../../features/vehicles/store/models/vehicles.models";
 import { environment } from '../../../environments/environment';

@Injectable({providedIn: "root"})
export class ApiService {
    private baseUrl = environment.apiUrl;
    constructor(private http: HttpClient){

    }

    getVehicles(page?: number, pageSize?: number, sort?: string, ascending?: boolean, fuelType?: String, min?: number, max?: number, filter?: string) {
        let params = new HttpParams();
        params = (page) ? params.set('page', String(page)) : params.set('page', 1);
        params = (pageSize) ? params.set('size', String(pageSize)) : params.set('size', 10);
        params = (sort) ? params.set("sortBy", sort) : params.set("sortBy", "id");
        params = (ascending) ? params.set("ascending", ascending) : params.set("ascending", true);
        if (fuelType && fuelType !== "" && fuelType !== undefined) {
            params = params.set("fuelType", String(fuelType));
        }
        if ((min && max) && (min !== undefined && max !== undefined)) {
            params = params.set("min", String(min));
            params = params.set("max", String(max));
        }
        if (filter && filter !== "" && filter !== undefined) {
            params = params.set("filter", String(filter));
        }
        return this.http.get<{items: Vehicle[], page: number, pageSize: number, total: number}>(`${this.baseUrl}` + API_PATH_VEHICLES, {params});
    }

    getVehicle(id: number) {
        return this.http.get<Vehicle>(`${this.baseUrl}` + API_PATH_VEHICLES + `/${id}`);
    }

    createVehicle(v: CreateVehicleRequest) {
        return this.http.post<Vehicle>(`${this.baseUrl}` + API_PATH_VEHICLES, v);
    }

    updateVehicle(id: number, changes: CreateVehicleRequest) {
        return this.http.put<Vehicle>(`${this.baseUrl}` + API_PATH_VEHICLES + `/${id}`, changes);
    }

    deleteVehicle(id: number) {
        return this.http.delete<void>(`${this.baseUrl}` + API_PATH_VEHICLES + `/${id}`);
    }

    getTotalFuelConsumption() {
        return this.http.get<number>(`${this.baseUrl}` + API_PATH_VEHICLES + SPECIAL_API_POSTFIX + '/total-fuel-consumption');
    }

    getGroupedByFuelConsumption() {
        return this.http.get<Vehicle[]>(`${this.baseUrl}` + API_PATH_VEHICLES + SPECIAL_API_POSTFIX + '/group-by-fuel-consumption');
    }

    getByFuelTypeLess(type: string) {
        let params = new HttpParams().set('fuelType', type);
        return this.http.get<Vehicle[]>(`${this.baseUrl}` + API_PATH_VEHICLES + {params});
    }

    getPowerRange(min: number, max: number) {
        let params = new HttpParams().set('min', String(min)).set('max', String(max));
        return this.http.get<Vehicle[]>(API_PATH_VEHICLES + SPECIAL_API_POSTFIX + '/power-range', {params});
    }

    resetTravelledDistance(id: number) {
        return this.http.patch<void>(`${this.baseUrl}` + API_PATH_VEHICLES + SPECIAL_API_POSTFIX  + "/reset-distance" + `/${id}`, null);
    }

    getCoordinatesList(page?: number, pageSize?: number, sort?: string, ascending?: boolean) {
            let params = new HttpParams();
            params = (page) ? params.set('page', String(page)) : params.set('page', 1);
            params = (pageSize) ? params.set('size', String(pageSize)) : params.set('size', 10);
            params = (sort) ? params.set("sortBy", sort) : params.set("sortBy", "id");
            params = (ascending) ? params.set("ascending", ascending) : params.set("ascending", true); 
        return this.http.get<{items: Coordinates[], page: number, pageSize: number, total: number}>(`${this.baseUrl}` + API_PATH_COORDS, {params});
    }

    getCoordinates(id: number) {
        return this.http.get<Coordinates>(`${this.baseUrl}` + API_PATH_COORDS + `/${id}`);
    }

    createCoordinates(v: CreateCoordinatesRequest) {
        return this.http.post<Coordinates>(`${this.baseUrl}` + API_PATH_COORDS, v);
    }

    updateCoordinates(id: number, changes: CreateCoordinatesRequest) {
        return this.http.put<Coordinates>(`${this.baseUrl}` + API_PATH_COORDS + `/${id}`, changes);
    }

    deleteCoordinates(id: number) {
        return this.http.delete<void>(`${this.baseUrl}` + API_PATH_COORDS + `/${id}`);
    }
}

import { Client } from "@googlemaps/google-maps-services-js";
import config from "config/config";
import { BadRequestError } from "errors/bad-request.error";

import { Coordinates } from "./interfaces";

export class GoogleMapsClient {
  private static client = new Client({});
  private static cache: Record<string, number[]> = {};
  private constructor() {}
  public static async getCoordinates(address: string): Promise<Coordinates> {
    const { data } = await this.client.geocode({
      params: {
        address,
        key: config.GOOGLE_MAPS_API_KEY,
      },
    });
    if (data.status !== "OK" || data.results.length === 0)
      throw new BadRequestError(`"${address}" is not a valid location pleas add a valid one in order to get coordinates`);
    return data.results[0].geometry.location;
  }

  public static async calcDistance(from: Coordinates, to: Coordinates | Coordinates[]) {
    if (!Array.isArray(to) || to.length <= config.GOOGLE_MAPS_DISTANCE_MATRIX_LIMIT) return this.distanceMatrixApi(from, to);
    const results: number[] = [];

    while (results.length < to.length) {
      const subResults = await this.distanceMatrixApi(
        from,
        to.slice(results.length, results.length + config.GOOGLE_MAPS_DISTANCE_MATRIX_LIMIT + 1),
      );
      results.push(...subResults);
    }

    return results;
  }

  private static async distanceMatrixApi(from: Coordinates, to: Coordinates | Coordinates[]) {
    if (Array.isArray(to) && to.length === 0) return [];
    const cacheKey = JSON.stringify({ from, to });
    if (this.cache[cacheKey]) return this.cache[cacheKey];

    const { data } = await this.client.distancematrix({
      params: {
        origins: [from],
        destinations: Array.isArray(to) ? to.slice(0, 20) : [to],
        key: config.GOOGLE_MAPS_API_KEY,
      },
    });

    const results = data.rows[0].elements.map(element => (element.status === "OK" ? element.distance.value : Infinity));
    this.cache[cacheKey] = results;
    return results;
  }
}

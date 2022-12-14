import { NextFunction, Request, Response } from "express";
import { CreateFarmResponseDto } from "modules/farms/dto/create-farm-response.dto";

export interface Coordinates {
  lng: number;
  lat: number;
}

export interface RequestHandlerFunction {
  (req: Request, res: Response, next: NextFunction): Promise<any>;
}

export interface FarmWithDistance extends CreateFarmResponseDto {
  drivingDistance: number;
}

import { Coordinates } from "helpers/interfaces";

const randomNumber = (from: number, to: number) => from + Math.random() * to;

jest.mock("helpers/google-maps.ts", () => {
  return {
    GoogleMapsClient: {
      getCoordinates: () => Promise.resolve({ lng: randomNumber(0, 50), lat: randomNumber(0, 50) }),
      calcDistance: (_from: Coordinates, to: Coordinates | Coordinates[]) =>
        Promise.resolve(Array.isArray(to) ? to.map(() => randomNumber(0, 500)) : randomNumber(0, 500)),
    },
  };
});

# Small code exercises

- Check smallCodeExercise.ts for the implementation.
- Run `npm run test:smallCodeExercises` to run their test file.
- I placed them in the root directory because they are not part of the Farm API.
- I implemented the unit tests with assert core module because jest is useless here.

# Farms Task - API

- Created /api/v1/auth/register endpoint in order to register user with postman and close all external access to user repo
- Coordinates are automatically calculated from Google Maps Api.
- For driving distance: you may found that the driving distance of a farm is null; this is becaus the user location and the farm location are not in the same continent. Maybe in next version we need to find a solution for it.
- Also the Distance Matrix api allowed only 25 distentions for the current subscription plan so i implemented an iterator mechanism to handle it . you can change the limit from env vars
- To seed Data make sure that you have a valid database connection settings in the .env file and .env.test and run `npm run seed`.
- For dev environment Run `npm run dev`.
- You can find a postman collection in the root dir `agreena.postman_collection.json`
- And also can access it from [Agreena collection](https://documenter.getpostman.com/view/14837775/2s8YzWSg5w)

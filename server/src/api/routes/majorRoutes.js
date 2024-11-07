import {
  apiCreateMajor,
  apiDeleteMajor,
  apiGetAllMajors,
  apiGetMajorByName,
  apiUpdateMajor,
} from "../controllers/majorController.js";

export function majorRoutes(server) {
  server.on("GET", "/api/v1/majors", async (ctx) => await apiGetAllMajors(ctx));

  server.on("POST", "/api/v1/majors", async (ctx) => await apiCreateMajor(ctx));

  server.on(
    "GET",
    "/api/v1/majors/:majorName",
    async (ctx) => await apiGetMajorByName(ctx),
  );

  server.on(
    "PATCH",
    "/api/v1/majors/:majorName",
    async (ctx) => await apiUpdateMajor(ctx),
  );

  server.on(
    "DELETE",
    "/api/v1/majors/:majorName",
    async (ctx) => await apiDeleteMajor(ctx),
  );
}

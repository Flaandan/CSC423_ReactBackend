import { Major } from "../models/major.js";
import {
  deleteMajor,
  fetchAllMajors,
  fetchMajorByName,
  insertMajor,
  updateMajor,
} from "../services/majorService.js";
import { createMajorPayload, updateMajorPayload } from "../utils/schemas.js";

export async function apiCreateMajor(ctx) {
  const payload = await ctx.req.json();

  const parsedPayload = createMajorPayload.parse(payload);

  const major = new Major.builder()
    .setName(parsedPayload.name)
    .setDescription(parsedPayload.description)
    .build();

  await insertMajor(major);

  return ctx.json({ success: "major created" }, 201);
}

export async function apiDeleteMajor(ctx) {
  const majorName = ctx.req.param("majorName");

  await deleteMajor(majorName);

  return ctx.json({ success: "major deleted" }, 200);
}

export async function apiGetAllMajors(ctx) {
  const majors = await fetchAllMajors();

  return ctx.json({ majors: majors }, 200);
}

export async function apiGetMajorByName(ctx) {
  const majorName = ctx.req.param("majorName");

  const major = await fetchMajorByName(majorName);

  return ctx.json({ major: major }, 200);
}

export async function apiUpdateMajor(ctx) {
  const majorName = ctx.req.param("majorName");

  const payload = await ctx.req.json();

  const parsedPayload = updateMajorPayload.parse(payload);

  const major = await fetchMajorByName(majorName);

  if (payload.name) {
    major.name = payload.name;
  }

  if (payload.description) {
    major.description = payload.description;
  }

  await updateMajor(major);

  return ctx.json({ success: "major updated" }, 200);
}

import { ServerError } from "../../error.js";
import { Major } from "../models/major.js";
import {
  deleteMajorDB,
  fetchAllMajorsDB,
  fetchMajorByIdDB,
  insertMajorDB,
  updateMajorDB,
} from "../repositories/majorRepository.js";

export async function createMajorService(parsedPayload) {
  const major = new Major.builder()
    .setName(parsedPayload.name)
    .setDescription(parsedPayload.description)
    .build();

  await insertMajorDB(major);
}

export async function updateMajorService(majorDetails, parsedPayload) {
  if (parsedPayload.name) {
    majorDetails.name = parsedPayload.name;
  }

  if (parsedPayload.description) {
    majorDetails.description = parsedPayload.description;
  }

  const result = await updateMajorDB(majorDetails);

  if (!result) {
    throw new ServerError(
      `Major '${majorDetails.name}' not found`,
      404,
      "Major could not be found",
    );
  }
}

export async function removeMajorService(majorId) {
  const result = await deleteMajorDB(majorId);

  if (!result) {
    throw new ServerError(
      `No major found with id '${majorId}'`,
      404,
      "Major could not be found",
    );
  }
}

export async function getMajorByIdService(majorId) {
  const major = await fetchMajorByIdDB(majorId);

  if (!major) {
    throw new ServerError(
      `No major found with id '${majorId}'`,
      404,
      "Major could not be found",
    );
  }

  return major;
}

export async function getAllMajorsService() {
  return await fetchAllMajorsDB();
}

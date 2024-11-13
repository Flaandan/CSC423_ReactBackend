import { ServerError } from "../../error.js";
import {
  deleteCourseFromMajorDB,
  fetchCoursesForMajorDB,
  insertCourseToMajorDB,
} from "../repositories/majorCourseRepository.js";

export async function addCourseToMajorService(majorId, courseId) {
  await insertCourseToMajorDB(majorId, courseId);
}

export async function removeCourseFromMajorService(majorId, courseId) {
  const deletedCourse = await deleteCourseFromMajorDB(majorId, courseId);

  if (!deletedCourse) {
    throw new ServerError(
      `No such course with ID ${courseId} found for major with ID ${majorId}`,
      404,
      "The course is not a part of this major",
    );
  }
}

export async function getCoursesForMajorService(majorId) {
  const courses = await fetchCoursesForMajorDB(majorId);

  if (!courses) {
    throw new ServerError(
      `Major with ID ${majorId} does not exist`,
      404,
      "Major could not be found",
    );
  }

  return courses;
}

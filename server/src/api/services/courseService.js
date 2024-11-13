import { ServerError } from "../../error.js";
import { Course } from "../models/course.js";
import {
  fetchAllCoursesDB,
  fetchCourseByIdDB,
  fetchUsersInCourseByIdDB,
  insertCourseDB,
  softDeleteCourseDB,
  updateCourseDB,
} from "../repositories/courseRepository.js";

export async function createCourseService(coursePayload, majorId) {
  const course = new Course.builder()
    .setTeacherId(coursePayload.id)
    .setCourseDiscipline(coursePayload.course_discipline)
    .setCourseNumber(coursePayload.course_number)
    .setDescription(coursePayload.description)
    .setMaxCapacity(coursePayload.max_capacity)
    .build();

  await insertCourseDB(course, majorId);
}

export async function updateCourseService(course, parsedPayload, teacher_id) {
  if (parsedPayload.teacher_id) {
    course.teacher_id = parsedPayload.teacher_id;
  } else {
    course.teacher_id = teacher_id;
  }

  if (parsedPayload.course_discipline) {
    course.course_discipline = parsedPayload.course_discipline;
  }

  if (parsedPayload.course_number) {
    course.course_number = parsedPayload.course_number;
  }

  if (parsedPayload.description) {
    course.description = parsedPayload.description;
  }

  if (parsedPayload.max_capacity) {
    course.max_capacity = parsedPayload.max_capacity;
  }

  if (parsedPayload.status) {
    course.status = parsedPayload.status;
  }

  const updatedCourse = await updateCourseDB(course);

  if (!updatedCourse) {
    throw new ServerError(
      `Course '${course.courseDiscipline} ${course.courseNumber}' not found for update`,
      404,
      "Course could not be found",
    );
  }

  return updatedCourse;
}

export async function removeCourseService(id) {
  const deletedCourse = await softDeleteCourseDB(id);

  if (!deletedCourse) {
    throw new ServerError(
      `Course with ID '${id}' not found for soft delete`,
      404,
      "Course could not be found",
    );
  }

  return deletedCourse;
}

export async function getCourseService(id) {
  const course = await fetchCourseByIdDB(id);

  if (!course) {
    throw new ServerError(
      `Course with ID '${id}' not found`,
      404,
      "Course could not be found",
    );
  }

  return course;
}

export async function getAllCoursesService() {
  return await fetchAllCoursesDB();
}

export async function getUsersInCourseService(id) {
  const users = await fetchUsersInCourseByIdDB(id);

  return users;
}

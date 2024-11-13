import { ServerError } from "../../error.js";
import { fetchCoursesByTeacherIdDB } from "../repositories/courseRepository.js";
import {
  fetchRegistrationsForUserDB,
  insertRegistrationForUserDB,
  updateRegistrationStatusForUserDB,
} from "../repositories/registrationRepository.js";

export async function registerUserForCourseService(
  studentId,
  courseId,
  semesterTaken,
  yearTaken,
  token,
) {
  if (token.user_role === "STUDENT") {
    if (token.user_id !== studentId) {
      throw new ServerError(
        `Student with ID ${token.user_id} attempted to register student with ID ${studentId} to course ${courseId}`,
        403,
        "INVALID_ROLE",
      );
    }
  }

  const registration = await insertRegistrationForUserDB(
    studentId,
    courseId,
    semesterTaken,
    yearTaken,
  );

  if (registration === null) {
    throw new ServerError(
      `User with ID ${studentId} is already registered for the course or has an invalid registration status`,
      400,
      "User is already registered for this course",
    );
  }
}

export async function changeUserRegistrationStatusService(
  studentId,
  courseId,
  token,
) {
  if (token.user_role === "STUDENT") {
    if (token.user_id !== studentId) {
      throw new ServerError(
        `Student with ID ${token.user_id} attempted to unregister student with ID ${studentId} from course ${courseId}`,
        403,
        "INVALID_ROLE",
      );
    }
  }

  const updatedRegistration = await updateRegistrationStatusForUserDB(
    studentId,
    courseId,
  );

  if (!updatedRegistration) {
    throw new ServerError(
      `Failed to update registration status for student with ID ${studentId}`,
      400,
      "User is not registered for this course",
    );
  }
}

export async function getAllRegistrationsForUserService(studentId, token) {
  if (token.user_role === "STUDENT") {
    if (token.user_id !== studentId) {
      throw new ServerError(
        `Student with ID ${token.user_id} attempted to get registrations of student with ID ${studentId}`,
        403,
        "INVALID_ROLE",
      );
    }
  }

  if (token.user_role === "TEACHER") {
    const courses = await fetchCoursesByTeacherIdDB(token.user_id);

    if (!courses) {
      throw new ServerError(
        `Failed to fetch courses taught by teacher with ID ${token.user_id}`,
        404,
        "Teacher could not be found",
      );
    }

    return courses;
  }

  const registrations = await fetchRegistrationsForUserDB(studentId);

  if (!registrations) {
    throw new ServerError(
      `Failed to fetch registrations for student with ID ${studentId}`,
      404,
      "User could not be found",
    );
  }

  return registrations;
}

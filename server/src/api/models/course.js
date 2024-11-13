import { courseStatus } from "../utils/validationSchemas.js";

export class Course {
  #id;
  #teacher_id;
  #course_discipline;
  #course_number;
  #description;
  #max_capacity;
  #current_enrollment;
  #status;
  #updated_at;

  constructor(builder) {
    this.#id = builder.id;
    this.#teacher_id = builder.teacher_id;
    this.#course_discipline = builder.course_discipline;
    this.#course_number = builder.course_number;
    this.#description = builder.description;
    this.#max_capacity = builder.max_capacity || 35;
    this.#current_enrollment = builder.current_enrollment || 0;
    this.#status = builder.status || "ACTIVE";
    this.#updated_at = builder.updated_at;
  }

  get id() {
    return this.#id;
  }

  get teacher_id() {
    return this.#teacher_id;
  }

  get course_discipline() {
    return this.#course_discipline;
  }

  get course_number() {
    return this.#course_number;
  }

  get description() {
    return this.#description;
  }

  get max_capacity() {
    return this.#max_capacity;
  }

  get current_enrollment() {
    return this.#current_enrollment;
  }

  get status() {
    return this.#status;
  }

  get updated_at() {
    return this.#updated_at;
  }

  set id(value) {
    this.#id = value;
  }

  set teacher_id(value) {
    this.#teacher_id = value;
  }

  set course_discipline(value) {
    this.#course_discipline = value;
  }

  set course_number(value) {
    this.#course_number = value;
  }

  set description(value) {
    this.#description = value;
  }

  set max_capacity(value) {
    this.#max_capacity = value;
  }

  set current_enrollment(value) {
    if (value < 0) {
      throw new Error("Current enrollment cannot be negative");
    }
    if (value > this.#max_capacity) {
      throw new Error("Current enrollment cannot exceed max capacity");
    }
    this.#current_enrollment = value;
  }

  set status(value) {
    if (courseStatus.includes(value)) {
      this.#status = value;
    } else {
      throw new Error("Invalid status. Must be either 'ACTIVE' or 'INACTIVE'");
    }
  }

  set updated_at(value) {
    this.#updated_at = value;
  }

  toCourseDTO() {
    return {
      id: this.#id,
      teacher_id: this.#teacher_id,
      course_discipline: this.#course_discipline,
      course_number: this.#course_number,
      description: this.#description,
      max_capacity: this.#max_capacity,
      current_enrollment: this.#current_enrollment,
      status: this.#status,
    };
  }

  static get builder() {
    class CourseBuilder {
      constructor() {
        this.id = "";
        this.teacher_id = "";
        this.course_discipline = "";
        this.course_number = null;
        this.description = "";
        this.max_capacity = 35;
        this.current_enrollment = 0;
        this.status = "ACTIVE";
        this.updated_at = "";
      }

      setId(id) {
        this.id = id;
        return this;
      }

      setTeacherId(teacher_id) {
        this.teacher_id = teacher_id;
        return this;
      }

      setCourseDiscipline(course_discipline) {
        this.course_discipline = course_discipline;
        return this;
      }

      setCourseNumber(course_number) {
        this.course_number = course_number;
        return this;
      }

      setDescription(description) {
        this.description = description;
        return this;
      }

      setMaxCapacity(max_capacity) {
        this.max_capacity = max_capacity;
        return this;
      }

      setCurrentEnrollment(current_enrollment) {
        this.current_enrollment = current_enrollment;
        return this;
      }

      setStatus(status) {
        if (courseStatus.includes(status)) {
          this.status = status;
        } else {
          throw new Error(
            "Invalid status. Must be either 'ACTIVE' or 'INACTIVE'",
          );
        }
        return this;
      }

      setUpdatedAt(updated_at) {
        this.updated_at = updated_at;
        return this;
      }

      build() {
        if (
          !this.teacher_id ||
          !this.course_discipline ||
          !this.course_number ||
          !this.description ||
          this.max_capacity == null
        ) {
          throw new Error(
            "teacher_id, course_discipline, course_number, description, and max_capacity are required",
          );
        }

        return new Course(this);
      }
    }

    return CourseBuilder;
  }
}

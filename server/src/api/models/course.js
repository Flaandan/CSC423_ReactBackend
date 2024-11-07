export class Course {
  #discipline;

  #courseNumber;

  #description;

  #maxCapacity;

  #lastUpdated;

  constructor(builder) {
    this.#discipline = builder.discipline;
    this.#courseNumber = builder.courseNumber;
    this.#description = builder.description;
    this.#maxCapacity = builder.maxCapacity;
    this.#lastUpdated = builder.lastUpdated;
  }

  get discipline() {
    return this.#discipline;
  }

  get courseNumber() {
    return this.#courseNumber;
  }

  get description() {
    return this.#description;
  }

  get maxCapacity() {
    return this.#maxCapacity;
  }

  get lastUpdated() {
    return this.#lastUpdated;
  }

  set discipline(value) {
    this.#discipline = value;
  }

  set courseNumber(value) {
    this.#courseNumber = value;
  }

  set description(value) {
    this.#description = value;
  }

  set maxCapacity(value) {
    this.#maxCapacity = value;
  }

  set lastUpdated(value) {
    this.#lastUpdated = value;
  }

  static get builder() {
    class CourseBuilder {
      constructor() {
        this.discipline = "";
        this.courseNumber = null;
        this.description = "";
        this.maxCapacity = null;
        this.lastUpdated = null;
      }

      setDiscipline(discipline) {
        this.discipline = discipline;
        return this;
      }

      setCourseNumber(courseNumber) {
        this.courseNumber = courseNumber;
        return this;
      }

      setDescription(description) {
        this.description = description;
        return this;
      }

      setMaxCapacity(maxCapacity) {
        this.maxCapacity = maxCapacity;
        return this;
      }

      setLastUpdated(lastUpdated) {
        this.lastUpdated = lastUpdated;
        return this;
      }

      build() {
        if (
          !this.discipline ||
          !this.courseNumber ||
          !this.description ||
          !this.maxCapacity
        ) {
          throw new Error(
            "discipline, courseNumber, description, and maxCapacity are required",
          );
        }

        return new Course(this);
      }
    }

    return CourseBuilder;
  }
}

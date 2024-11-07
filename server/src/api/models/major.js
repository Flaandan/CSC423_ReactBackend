export class Major {
  #name;

  #description;

  constructor(builder) {
    this.#name = builder.name;
    this.#description = builder.description;
  }

  get name() {
    return this.#name;
  }

  get description() {
    return this.#description;
  }

  set name(value) {
    this.#name = value;
  }

  set description(value) {
    this.#description = value;
  }

  static get builder() {
    class MajorBuilder {
      constructor() {
        this.name = "";
        this.description = "";
      }

      setName(name) {
        this.name = name;
        return this;
      }

      setDescription(description) {
        this.description = description;
        return this;
      }

      build() {
        if (!this.name || !this.description) {
          throw new Error("name and description are required");
        }
        return new Major(this);
      }
    }

    return MajorBuilder;
  }
}

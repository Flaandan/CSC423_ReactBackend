export class Major {
  #id;
  #name;
  #description;

  constructor(builder) {
    this.#id = builder.id;
    this.#name = builder.name;
    this.#description = builder.description;
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  get description() {
    return this.#description;
  }

  set id(value) {
    this.#id = value;
  }

  set name(value) {
    this.#name = value;
  }

  set description(value) {
    this.#description = value;
  }

  toMajorDTO() {
    return {
      id: this.#id,
      name: this.#name,
      description: this.#description,
    };
  }

  static get builder() {
    class MajorBuilder {
      constructor() {
        this.id = "";
        this.name = "";
        this.description = "";
      }

      setId(id) {
        this.id = id;
        return this;
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

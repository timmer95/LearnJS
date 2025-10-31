// Declaration
class Rectangle {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
}

// Expression; the class is anonymous but assigned to a variable
const Rectangle = class {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
};

// Expression; the class has its own name. Rectangle2 cannot be referenced anymore
const Rectangle = class Rectangle2 {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
};


class MyClass {
    constructor(arg) {
        this.myField = arg;
    }
}

class MyClass {
  constructor(arg) {
    const myField = arg;
      return {myField}
  }
} 
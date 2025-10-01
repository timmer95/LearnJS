class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    greet() {
        console.log(`Hello, my name is ${this.name}`);
    }
}

// Creating multiple instances
const person1 = new Person("John", 30);
const person2 = new Person("Jane", 25);

console.log(person1.name); // Output: John
person2.greet(); // Output: Hello, my name is Jane


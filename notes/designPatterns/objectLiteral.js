const person = {
    name: "John",
    age: 30,
    greet: function() {
        console.log(`Hello, my name is ${this.name}`);
    }
};

// Accessing properties and methods
console.log(person.name); // Output: John
person.greet(); // Output: Hello, my name is John


class MyClass {
    property = 'some property'
    constructor() {
        // Binding scopes to both approaches
        this.boundRoutine1 = this.routine1.bind(this)
        this.boundMethod = this.method.bind(this)
    }

    // Class Field, no scope binding
    routine1 = function() {
        console.log(this.property)
    }
    // Class Field, scope binding
    routine2 = () => {
        console.log(this.property)
    }
    // Class method, no scope binding
    method() {
        console.log(this.property)
    }
}

const instance = new MyClass()
setTimeout(instance.routine1, 1000)         // undefined
setTimeout(instance.routine2, 1100)         // some property
setTimeout(instance.method, 1200)           // undefined
setTimeout(instance.boundRoutine1, 1300)    // some property
setTimeout(instance.boundMethod, 1400)      // some property


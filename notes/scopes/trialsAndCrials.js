userObject = { 
    userName: "Eva", 
    age: 25,

    // sayName : () => {
    //     console.log(`Hi, I'm ${userName}`)  // breaks, doesn't know userName
    // }

    sayName : () => {
        console.log(`Hi, I'm ${this.userName}`)  // gives Hi, I'm undefined
    }
}

const userConstant = {
    userName: "some name",
    age: 30,

    // sayName : () => {
    //     console.log(`Hi, I'm ${userName}`)  // breaks, doesn't know userName
    // }

    sayName() { // sayName = () => { also works }
        console.log(`Hi, I'm ${this.userName}`)  // gives Hi, I'm undefined
    }
}

setTimeout(userConstant.sayName, 1000) // Aha. that drifts away from the this

function createUser(userName, age) {      // Factory Function ??
    sayName = () => {
        console.log(`Hi, I'm ${userName} and I'm ${age} years old`);
    }

    return {sayName}
}

const userCreated = createUser("Eva Not This", 26)

function UserThis(userName, age) {  // Kind of class declaration, but then in functions
    this.userName = userName;
    this.age = age;

    this.sayNameThis = function() {          
        console.log(`Hi, I'm ${this.userName}`); // gives Hi, I'm Eva T
    };

    this.sayName = function() {
        console.log(`Hi, I'm ${userName}`); // gives Hi, I'm Eva T
    };
    this.sayNameThisArrow = () => {          
        console.log(`Hi, I'm ${this.userName}`); // gives Hi, I'm Eva T
    };

    this.sayNameArrow = () => {
        console.log(`Hi, I'm ${userName}`); // gives Hi, I'm Eva T
    };
}

const userThisFunction = new UserThis("Eva Ti", 28)
setTimeout(userThisFunction.sayNameThis, 1000)
setTimeout(userThisFunction.sayName, 1100);
setTimeout(userThisFunction.sayNameThisArrow, 1200)
setTimeout(userThisFunction.sayNameArrow, 1300);

class UserClass {                            // Actual class declaration
    constructor(userName, age) {
        this.userName = userName;
        this.age = age;
    }

    sayNameThis() {                         // automatically recognizes methods
        console.log(`Hi, I'm ${this.userName}`); // gives Hi, I'm Fiets
    };

    sayName = () => {                       // also allows the function define way
        console.log(`Hi, I'm ${userName}`); // breaks, doesn't know
    };
    
}

const userClass = new UserClass("Fiets", 45)



/// SOME MORE ///////////////////////////////////////////////////////////////////
function myFunction() {
  console.log(this);
}
// Simple invocation
myFunction(); // logs global object (window)


const myObject1 = {
    name: "it's me!",
    method() {
        console.log(this);
    }
};
// Method invocation
myObject1.method(); // logs myObject with "it's me!"


function myFunction() {
  console.log(this);
}
const myContext = { name: "it's me!" };
myFunction.call(myContext);  // logs { name: "it's me!" }
myFunction.apply(myContext); // logs { name: "it's me!" }

function MyFunction() {
    this.name = "it's me!"
    console.log(this);
}
new MyFunction(); // logs an instance of MyFunction {name: "it's me!"}

const myObject = {
    myMethod(items) {
        console.log(this);          // logs myMethod    
        function callback() {
            console.log(this);      // logs window    
        };
        items.forEach(callback);
    }
};
myObject.myMethod([1, 2, 3]);

const myObject4 = {
    myMethod(items) {
        console.log(this);      // logs myMethod            
        function callback() {
            console.log(this);  // logs window  
        };
        items.forEach(callback);
    }
};
myObject4.myMethod([1, 2, 3]);  // logs myMethod, then 3 times window

const methodized4 = myObject4.myMethod
methodized4([1, 2, 3]); // logs window

const methodized5 = methodized4.bind(myObject4);
methodized5([1, 2, 3]) // logs myMethod and then 3 times window

const methodized6 = methodized4.bind([1, 2, 3]);
methodized6([1, 2, 3]) // logs [1, 2, 3] and then 3 times window


//////////    N O W    W I T H    A R R O W    F U N C T I O N    ////////////

const myObject2 = {
    myMethod(items) {
        console.log(this);             
        const callback = () => {
            console.log(this);       
        };
        items.forEach(callback);
    }
};
myObject2.myMethod([1, 2, 3]) // now logs myMethod in all 4 cases

const methodized = myObject2.myMethod
methodized([1, 2, 3]); // now logs window in all 4 cases

const methodized2 = methodized.bind(myObject2);
methodized2([1, 2, 3]) // now logs myMethod in all 4 cases

const methodized3 = methodized.bind([1, 2, 3]);
methodized3([1, 2, 3]) // now logs [1, 2, 3] in all 4 cases



const myObject3 = {
    myMethod(items) {
        console.log(this);          // logs myMethod    
        const callback = () => {
            console.log(this);      // logs myMethod    
        };
        items.forEach(callback);
    }
};
myObject3.myMethod([1, 2, 3]);


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
//                          ARGUMENTS                                        //
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
function myFunction() {
    console.log(arguments);
}
myFunction('a', 'b'); // logs { 0: 'a', 1: 'b'}

function myRegularFunction() {
    function myInnerRegularFunction() {    
        console.log(arguments); 
    }
    myInnerRegularFunction('c', 'd');
}
myRegularFunction('a', 'b'); // logs { 0: 'c', 1: 'd' }

function myRegularFunction() {
    const myArrowFunction = () => {    
        console.log(arguments); 
    }
    myArrowFunction('c', 'd');
}
myRegularFunction('a', 'b'); // logs { 0: 'a', 1: 'b' }

function myRegularFunction() {
    const myArrowFunction = (...args) => {    // args can be any other word
        console.log(args);  
    }
    myArrowFunction('c', 'd');
}
myRegularFunction('a', 'b'); // logs { 0: 'c', 1: 'd' }



////////////// SOME OTHER TRIALS ///////////////////

class Hero {
    constructor(heroName) {
        this.heroName = heroName;
    }
    logName() {    
        console.log(this.heroName);  
    }
}
const batman = new Hero('Batman');
batman.logName()

class Hero {
    constructor(heroNameP) {
        this.heroName = heroNameP;
    }
    logName() {  
        function innerlogName() {  // ==equals== innerlogName = function() { }
            let heroName = "Secret"
            console.log(heroName);  
        }  
        innerlogName();
    }
}
const batman2 = new Hero('Batman');
batman2.logName()               // Secret

class Hero {
    constructor(heroNameP) {
        this.heroName = heroNameP;
    }
    logName() {  
        let heroName = "Secret"
        function innerlogName() {
            console.log(heroName);  
        }  
        innerlogName();
    }
}
const batman3 = new Hero('Batman');
batman3.logName()               // Secret

class Hero {
    constructor(heroName) {
        this.heroName = heroName;
    }
    logName() {  
        // let heroName = "Secret"
        function innerlogName() {
            console.log(heroName);  
        }  
        innerlogName();
    }
}
const batman4 = new Hero('Batman');
batman4.logName()               // error: heroName not defined 


class Hero {
    constructor(heroName) {
        this.heroName = heroName;
    }
    logName() {  
        innerlogName = () => {
            console.log(this.heroName);  
        }  
        innerlogName();
    }
}
const batman5 = new Hero('Batman');
batman5.logName.innerlogName()               // error: heroName not defined 


class BaseClass {
  field() {
    console.log('BaseClass field');
  }
}

class Subclass extends BaseClass {
  field = () => {
    super.field();
    console.log('Subclass field');
  }
}

const instance = new Subclass();
instance.field();

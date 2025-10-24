function UserThis(userName, age) {                  // Kind of class declaration, but then in functions
    this.userName = userName;     
    this.age = age;

    this.sayNameThis = function() {          
        console.log(`Hi, I'm ${this.userName}`);    // refers to userName in call's scope
    };

    this.sayName = function() {
        console.log(`Hi, I'm ${userName}`);         // refers to userName in closest scope
    };

    this.sayNameThisArrow = () => {          
        console.log(`Hi, I'm ${this.userName}`);    // refers to userName in UserThis' scope
    };

    this.sayNameArrow = () => {
        console.log(`Hi, I'm ${userName}`);         // refers to userName in closest scope
    };
}

window.userName = 'windows name'

const userThisFunction = new UserThis("Eva Ti", 28)
setTimeout(userThisFunction.sayNameThis, 1000)
setTimeout(userThisFunction.sayName, 1100);
setTimeout(userThisFunction.sayNameThisArrow, 1200)
setTimeout(userThisFunction.sayNameArrow, 1300);
// Results:
// Hi, I'm windows name 
// Hi, I'm Eva Ti
// Hi, I'm Eva Ti
// Hi, I'm Eva Ti


// Results of same code, but then with this.userName = userName commented out
// Hi, I'm windows name
// Hi, I'm Eva Ti       // userName is still found in constructor scope (as parameter arg)
// Hi, I'm undefined    // because there is no userName in UserThis' scope!!
// Hi, I'm Eva Ti       // userName is still found in constructor scope (as parameter arg)

// Results of the same code, but then with this.userName = username + parametername change to username
// Hi, I'm windows name 
// Hi, I'm windows name // Actual expected behavior with code above
// Hi, I'm Eva Ti
// Hi, I'm windows name // Actual expected behavior with code above

// Results of same code, but then with this.userName = userName commented out + parametername change to username
// Hi, I'm windows name
// Hi, I'm windows name // because a scope above the constructor scope is global scope
// Hi, I'm undefined
// Hi, I'm windows name // because a scope above the constructor scope is global scope


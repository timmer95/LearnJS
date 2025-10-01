const calculator = (function () {
  const add = (a, b) => a + b;
  const sub = (a, b) => a - b;
  const mul = (a, b) => a * b;
  const div = (a, b) => a / b;
  return { add, sub, mul, div };
})();

calculator.add(3,5); // 8
calculator.sub(6,2); // 4
calculator.mul(14,5534); // 77476

const moduleName = (function(dependency) {          // parameter
    const firstFunction = (arg1, arg2) => arg1 + arg2;
    const secondFunction = (arg1) => {
        console.log(arg1);
        return arg1 * dependency;
    }

    return {firstFunction, secondFunction}
})(existingDependency || dependencyMock);         // actual argument with default argument

const dependencyMock = (() => ({
  querySelector: (selector) => ({
    innerHTML: null,
  }),
}))();
1. What is the difference between var, let, and const?
Ans:var -Function-scoped, can be re-declared & updated, hoisted with value undefined.
let - Block-scoped, can be updated but not re-declared in the same scope.
const - Block-scoped, must be initialized at declaration, cannot be re-assigned (but objects/arrays can still be mutated).
2. What is the difference between map(), forEach(), and filter()?
Ans:map() -Returns a new array with transformed elements.
forEach() -Executes a function on each element but returns undefined (no new array).
filter() - Returns a new array with elements that pass a given condition.
3. What are arrow functions in ES6?
Ans:const add = (c, d) => c + d;
Do not have their own this, arguments, super, or new.target.
Useful for callbacks and functional programming.
4. How does destructuring assignment work in ES6?
Ans:const [a, b] = [3, 5];    // a = 3, b = 5
const { name, age } = { name: "Maisha", age: 24 };
5. Explain template literals in ES6. How are they different from string concatenation?
Ans:Use backticks (`) for strings.
Support string interpolation and multi-line strings.
let name = "Maisha";
console.log(`Hello, ${name}!`);
Different from concatenation ("Hello, " + name) → cleaner & more readable.

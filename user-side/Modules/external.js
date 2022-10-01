export default class User {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}

export function displaySomething() {
    console.log("Hello world.");
}


// You can default export only ONE THING.
// export default User;
// export { displaySomething };
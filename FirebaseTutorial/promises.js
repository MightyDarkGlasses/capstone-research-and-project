let p = new Promise((resolve, reject) => {
    let a = false;

    if (a) {
        resolve("Success.")
    }
    else {
        reject("Failed.")
    }
});

//then -> runs the resolve
p.then((message) => {           //resolve
    console.log(message);
}).catch((message) => {          //reject
    console.log(message);
});


const userOffline = false;
const systemError = true;
const userSlacking = false;

// function userCallback(callback, noneSense, errorCallback) {
//     if(userOffline) {
//         errorCallback({
//             name: "Offline.",
//             message: "The user left the session."
//         });
//     }
//     else if (systemError) {
//         errorCallback({
//             name: "Crashed.",
//             message: "The system crashed during the session."
//         });
//     }
//     else if (userSlacking) {
//         noneSense({
//             context: "This is none sense!"
//         });
//     }
//     else {
//         callback("Working! :)");
//     }
// };

// userCallback(
//     (message) => {
//         console.log("Success: ", message);
//     }, 
//     (randoms) => {
//         console.log(randoms.context);
//     },
//     (error) => {
//         console.log(error.name, error.message);
//     }
// );



function userPromises() {
    return new Promise((resolve, reject) => {
        if(userOffline) {
            resolve({
                name: "Offline.",
                message: "The user left the session."
            });
        }
        else if (systemError) {
            resolve({
                name: "Crashed.",
                message: "The system crashed during the session."
            });
        }
        else {
            reject("Working! :)");
        }
    });
};

userPromises().then((message) => {
    console.log("Success: ", message);
}).catch((error) => {
    console.log(error.name, error.message);
});


const promiseSituation1 = new Promise((resolve, reject) => {
    resolve("Promise #1 done.")
});
const promiseSituation2 = new Promise((resolve, reject) => {
    resolve("Promise #2 done.")
});
const promiseSituation3 = new Promise((resolve, reject) => {
    resolve("Promise #3 done.")
});

Promise.all([ //run all the Promises at the same time.
    promiseSituation1,
    promiseSituation2,
    promiseSituation3
]).then((messages) => {
    console.log(messages);
});

Promise.race([ //return the first one who finished
    promiseSituation1,
    promiseSituation2,
    promiseSituation3
]).then((messages) => {
    console.log(messages);
});
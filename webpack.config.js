const path = require('path')                

module.exports = {              // export the module
  mode: 'development',          // mode, kung ano man
  entry: [
    './src/index.js',
    './src/user.js',
    './user-side/home1.js',
    './user-side/myaccount2.js',
    './user-side/vehicles3.js',
    './user-side/logs4.js',
    './user-side/announcement5.js',
    './security-side/qrscanning.js',
    './security-side/security-officer/scripts/qr.js'],      // path, where we should look
  output: {
    
    //__dirname -> current directory, dist -> relative path (dist)
    path: path.resolve(__dirname, 'dist'),  // directory we want our file to ouptut (in this case, dist)
    filename: 'bundle.js'                   // 
  },
  watch: true                   //run webpack, watch and do change by bundling the changes made in JS file.    
}

// See line 8 of package.json file
// build: webpack

// const path = require('path')                

// module.exports = {              // export the module
//   mode: 'development',          // mode, kung ano man
//   entry: [
//     './src/index.js',
//     './user-side/user.js'],      // path, where we should look
//   // entry: {
//   //   bundle: path.resolve(__dirname, 
//   //     ['./src/index.js', './user-side/user.js'])
//   // },
//   // entry: [
//   //   './src/index.js',         // Firebase import, configuration setup
//   //   './src/login.js'          // Login function
//   // ],      // path, where we should look
//   output: {
//     //__dirname -> current directory, dist -> relative path (dist)
//     path: path.resolve(__dirname, 'dist'),  // directory we want our file to ouptut (in this case, dist)
//     filename: '[name].js'                   // 
//   },
//   watch: true                   //run webpack, watch and do change by bundling the changes made in JS file.    
// }

// See line 8 of package.json file
// build: webpack
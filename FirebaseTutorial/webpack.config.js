const path = require('path')                

module.exports = {              // export the module
  mode: 'development',          // mode, kung ano man
  entry: './src/index.js',      // path, where we should look
  output: {
    
    //__dirname -> current directory, dist -> relative path (dist)
    path: path.resolve(__dirname, 'dist'),  // directory we want our file to ouptut (in this case, dist)
    filename: 'bundle.js'                   // 
  },
  watch: true                   //run webpack, watch and do change by bundling the changes made in JS file.    
}

// See line 8 of package.json file
// build: webpack
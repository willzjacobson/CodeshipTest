This is a node.js program. To run it, you must have Node installed. The program itself uses no code libraries not provided by the Node runtime. The test framework is Chai used with Mocha. Testing also uses the library 'chai-spies'. 

A note: If the instructions had not specified not to use external code libraries, I would have used the bluebird promise library, which would have resulted in much nicer tests for the async functions. I would not have needed timeouts. However, promises are not yet available in Node natively. 


To run:
1. Type in terminal:  npm start

To test:
1. Install Mocha globally. Type in terminal:  npm install -g mocha
2. Type in terminal:  npm test
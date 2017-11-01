#Architecture

##Design

The analytics server is designed to be modular. It should allow us to change things like databases and connection options easily by simply replacing one file with another.

##Structure

```
- src
  - database
    - mongodb // this is where we connect to mongodb and create the handleEvent function for mongo
              // alternative files could go here and replace mongo's implementation
  - server
    - routes  // this is where we handle requests, it takes the handleEvent function from the database and executes it after validating the incoming route and data
    - uws     // where we start the server and get it listening to ports
              // alternative server implementations could replace uws here
  - index     // import everything and combine the pieces to get it started
```

##Other important files

* `.eslintrc`
  * Config for `eslint`
* `app.yaml`
  * Config for google cloud setup 

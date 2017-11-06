## Mongo DB

### Why we need a Database
We implemented a database into the puglift project as a use case of the project was the collection and analysing of data.

### Why we chose to use Mongo
In the early stages of the project we tested both MongoDB and RethinkDB.
Rethink seemed to be more user friendly at this stage of the project, so we decided to stop spending time on the database and focus on the other aspects of the project, this meant that we had stuck with Rethink for a few weeks.
After realising that Rethink was the bottleneck in our project, we decided to re-implement Mongo,
which turned out to be **twice as fast.**

### How to get started using Mongo locally
> This assumes you already have NPM installed, and have pulled the latest commit from the *puglift/master* repository.
> This also assumes you have directed yourself to the *puglift* directory in your terminal/command prompt.

Run the command `npm install`. This will install all packages that the project is dependent on. Once you have installed these packages, you will have the ability to start and query MongoDB.
To start an instance of MongoDB, you should run the `mongod` command from your terminal.

> You **must** be inside of the *puglift* directory when you execute this command, it will also not work if you have not followed the above steps.

This will start the mongo db server instance on your localhost machine.

>If you have an error here and are using a UNIX system, you should kill the ‘mongod’ instance running in the background, or simply close and reopen your terminal and try again

Once the *mongod* instance has been started, you can now open a *new* terminal and run the command `mongo`, this will put you into the mongo shell, where you can insert, delete, and query databases and collections.

--------

Example commands:
+ `show dbs;` - shows all available databases
+ `use x;` - uses database called x (change this to the database you wish to query)
+ `show collections;` - shows all collections(tables) available.
+ `db.y.find();` - shows some documents that have been inserted into the collection y (change y to the collection you wish to query)

## How the database is utilised

```json
Example JSON object
{
  "type": "page_load",
  "value": {
    "event_type": "page_load",
    "user_id": "${user_id}",
    "method": "http"
  }
}
```

Once the application has received a **POST** request, it will check to see if the correct url has been entered and that the JSON object being sent has the correct event type `(‘page_load’, ‘bid_request’, etc)`. The event types applicable are set inside the object *response* which is inside the `puglift/srs/server/routes.js` script.
If the POST request does not match either of these conditions it will return an *404 - unknown request*.

```JavaScript
export const response = {
  'page_load': Buffer.from('page loaded!'),
  'bid_request': Buffer.from('bid requested!'),
  'bid_response': Buffer.from('bid result!'),
  'ad_request': Buffer.from('ad requested!'),
  'ad_response': Buffer.from('ad result!'),
  'ad_view': Buffer.from('ad viewed!'),
  'creative_render': Buffer.from('creative render!'),
}
```

Once the POST has been validated, a function named `handleEvent` is called and is passed three parameters:
>1. The object from the post request
2. A profiling id (if profiling has been enabled, else a `null` is passed)
3. A callback function which responds to the POST request.

>>Please refer to the ‘Example JSON object’, this will help give further meaning to the next paragraph

Once the `handleEvent` function has been called, it takes the *type* of the JSON object that it was passed as an argument and inserts the *value* of that object into the collection named after the *type*.
For example, if we were to POST the example object seen above, the database would insert `  "type": "page_load", "value": { "event_type": "page_load", "user_id": "${user_id}", "method": "http"` into a collection called `page_load`.

The next step in the handleEvent function is to return a callback.
The callback takes two arguments, the first being a value from the *response* array inside of *puglift/src/server/routes.js*, and the second being the user’s unique id. We are returning the user’s id in the **assumption** that there will be client-side script that will insert this value into a cookie to keep track of the user’s id, and when a post request is sent they will send the users id along with that event request.

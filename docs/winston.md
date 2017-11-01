## Winston.js Logging

### Why we implemented a logging tool
Primarily, Winston was implemented for its profiling abilities. However, it's always useful to have the ability to customise logging levels and where certain events get logged (console, file, etc)

### What is profiling and how is it used?
Profiling has given us the ability to track the time it takes from the when an event is received and profiling is started, to the time that the event has begun to get stored in the database.
We implemented it so that there is an option to track internal latency of the code, you can profile the time of anything as long as you start and stop the profiling.

### How to use profiling
Wherever you are in the code, you can start a profiling test by using the following command and syntax `logger.profile('test')`
Where *'test'* is the ID of the profiling event you wish to start. The parameter you use in the profile() function must be unique for every time you wish to start a new profiling event.
To end a profiling event simply call the `logger.profile('test')` again, this will end the profiling and give you a time in milliseconds back.

### How to configure Winston
[Please refer to this github page](https://github.com/winstonjs/winston#usage) for more information regarding the setup of winston logging instances.
The docs are extremely well written and should answer most of your questions.

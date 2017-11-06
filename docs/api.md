API Documentation
===================

As per the current iteration of the project, the only queries the API can handle are queries concerning 'Events'. The way a query is structured is similar to a RESTful web-service, such that there are parameters for each part of the query:

> **Parameters for Events:**

> - The literal URL pointing to the API (www.url.com/**api**/)
> - The area of the query, such as events (www.url.com/api/**events?**)
> - The type of event (.../events?**event=page_load**)
> - The type of query (../events?event=page_load&**type=total**)
> - The optional filters (../..&type=total&**filters:user_id=xyz,date=12/08/2005**

> **IMPORTANT:**
>  - Events are separated by **'&'** and multiple filters by **, (comma)**
>  - A query **MUST** have an event and type.

    Example URL:
    www.url.com/api/events?event=page_load&type=total&filter:user_id=1234,date=12/08/2017

There are multiple types for events, query types and filters:
> **Event Types:**
> - page_load
> - bid_request
> - bid_response
> - ad_request
> - ad_response
> - ad_view
> - creative_render

> **Query Types:**
> - total (Returns a count of results)
> - list (Returns a JSON of results)

> **Filter Types:**
> - user_id
> - event_type
> - date (08/12/2005)
> - date_range (08/12/2005-07/05/2005)
> - session

## How it works ##

When a URL has a /**API**/ segment, it is redirected to the API Controller. This is then checked further to see what kind of query is requested, e.g. **/events?** for Events.

Next, the parameters need to be seperated

    ../events?event=page_load&type=total&filters:user_id=xyz,date=12/05/2017

Gets split into

    [event] = page_load,
    [type] = total,
    [filters] ={ [user_id] = xyz, [date] = 12/05/2017 }

The only parameters required are the **event** and **type** as all filters are optional. All the parameters are validated against possible events, types and filters.

The conversion of event is simple as it corresponds to the database table name.
Type is used by the API internally so it knows which functions to call, e.g. 'total' will call the total function, which queries the database and returns a count of results.

Filters also requires no alterations as the filter types correspond to field names within the table. The only exceptions are date and date_range. While the input of a date is in simple format - 19/05/2017, this does not work for the database queries.

If the filter is a date_range, it first gets split into sections (e.g.):

    date_range = '19/05/2017-22/05/2017'
    INTO (using '-' as the delimiter):
    startDate = 19/05/2017
    endDate = 22/05/2017
A normal date is also separated into start, and end, but the dates are the same for both. 
The date needs to be reversed and split with a different character to match the database

    19/05/2017 = 2017-05-19
The dates are also stored with a timestamp, in form of T00:00:00.000Z
This means, dates and ranges also need to have this timestamp. For example, when giving a single date, the dates would look like this

    startDate = 2017-05-19T00:00:00.000Z
    endDate = 2017-05-19T23:59:59.999Z
This ensures all results within that day are returned

If everything is parsed correctly, and all the required fields are filled, then the API Controller will pass those values along to the MongoDBProxy which runs the queries and results the results. The functions found within are quite self-explanatory, as there's only one for 'total' and 'list'

The results or error are returned in a call-back, which then sends the results to the response object.

> **NOTE:**
> If any parsing fails, or important fields are left out, the error is instead sent to the response object, and the query is **NOT** executed.
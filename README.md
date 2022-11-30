# Timify

Final project for Team time(e) the beaver in MIT 6.1040.

The following backend routes are implemented.

## `POST /api/users` - Create an new user account

**Body**

- `username` *{string}* - The user's username
- `password` *{string}* - The user's password

**Returns**

- A success message
- An object with the created user's details (without password)

**Throws**

- `403` if there is a user already logged in
- `400` if username or password is in the wrong format
- `409` if username is already in use

## `GET /api/users/session` - Get signed in user

**Returns**

- Currently logged in user, or null if not logged in

## `POST /api/users/session` - Sign in user

**Body**

- `username` *{string}* - The user's username
- `password` *{string}* - The user's password

**Returns**

- A success message
- An object with user's details (without password)

**Throws**

- `403` if the user is already logged in
- `400` if username or password is not in correct format format or missing in the req
- `401` if the user login credentials are invalid

## `DELETE /api/users/session` - Sign out user

**Returns**

- A success message

**Throws**

- `403` if user is not logged in

## `PATCH /api/users` - Update a user's password

**Body**

- `password` *{string}* - The user's password

**Returns**

- A success message
- An object with the updated user details (without password)

**Throws**

- `403` if the user is not logged in
- `400` if password is in the wrong format

## `GET /api/goals` - Get logged in user’s goals

**Returns**

- An array of goals created by logged in user.

**Throws**

- `403` if the user is not logged in

## `POST /api/goals` - Create a new goal

**Body**

- `name` *{string}* - The name of the Goal
- `hours` *{number}* - The number of hours
- `category` *{string}* - The name of the category associated with the goal
- `type` *{string}* - The type of the goal (”goal” or “budget”)

**Returns**

- A success message
- An object with the created goal

**Throws**

- `403` if the user is not logged in
- `400` if name is incorrect format
- `409` if logged in user already has a goal with name
- `400` if hours is invalid number
- `404` if category does not exist
- `400` if type is invalid

## `DELETE /api/goals/:goalName?` - Delete an existing goal

**Returns**

- A success message

**Throws**

- `403` if the user is not logged in
- `404` If the logged in user doesn’t have a goal with the given name

## `GET /api/categories` - Get logged in user’s categories

**Returns**

- An array of categories created by logged in user.

**Throws**

- `403` if the user is not logged in

## `POST /api/categories` - Create a new category

**Body**

- `name` *{string}* - The name of the category

**Returns**

- A success message
- An object with the created category

**Throws**

- `403` if the user is not logged in
- `400` if name is incorrect format
- `409` if logged in user already has a category with name

## `DELETE /api/categories/:categoryName?` - Delete an existing category

**Returns**

- A success message

**Throws**

- `403` if the user is not logged in
- `404` If the logged in user doesn’t have a category with the given name

## `PATCH /api/categories/:categoryName?` - Update the name of logged in user’s category

**Body**

- `name` *{string}* - The new name

**Returns**

- A success message
- An object with the updated category

**Throws**

- `403` if the user is not logged in
- `400` if new name is incorrect format
- `404` If the logged in user doesn’t have a category with the given name
- `409` if logged in user already has a category with new name

## `GET /api/friends/list` - Get your friends

**Returns**

- Array of friend objects, sorted by date first one being most recent

**Throws**

- `403` if user not logged in

## `GET /api/friends/requests` - Get your friend requests

**Returns**

- Array of friend request objects, sorted by date first one being most recent

**Throws**

- `403` if user not logged in

## `GET /api/friends/status/:username?` - Get your friendship status with given user

**Returns**

- String representing friend request status: ‘friends’, ‘request sent’, ‘request received’, or ‘no’

**Throws**

- `403` if user not logged in
- `400` if username not included in request
- `404` if `username` is not recognizable username

## `DELETE /api/friends/list/:friend?` - Unfriend someone

**Returns**

- Success message

**Throws**

- `403` if user not logged in
- `400` if username not included in request
- `404` if `friend` is not recognizable username
- `403` if `friend` is not a friend of current user

## `PUT /api/friends/requests/:requestee?` - Send a friend request

**Returns**

- Success message
- Friend request object

**Throws**

- `403` if user not logged in
- `400` is `requestee` is empty
- `404` if `requestee` is not recognizable username
- `409` if already friends with `requestee`, or has incoming or sent friend request to `requestee`

## `DELETE /api/friends/requests/:requestee?` - Withdraw a friend request

**Returns**

- Success message

**Throws**

- `403` if user not logged in
- `400` is `requestee` is empty
- `404` if `requestee` is not recognizable username
- `404` if friend request does not exist

## `PUT /api/friends/requests/respond/:requester?` - Respond to a friend request

**Body**

- `response` *{string}* - 'accept' if accepting, 'reject' if rejecting

**Returns**

- Success message

**Throws**

- `403` if user not logged in
- `400` is `requester` is empty
- `404` if `requester` is not recognizable username
- `404` if friend request does not exist
- `400` is `response` is not 'accept' nor 'reject'

## `GET /api/entries?category=categoryName&start=startTime&end=endTime` - Get logged in user’s time entries over given time period associated with given categories

**Returns**

- An array of time entries (all query attributes are optional)

**Throws**

- `403` if the user is not logged in

## `POST /api/entries` - Create a new time entry

**Body**

- `start` *{string}* - ISO start time
- `end` *{string}* - ISO end time
- `category` *{string} -* The name of the category associated with this time entry
- `tag` *{string}* - The tag for this time entry

**Returns**

- A success message
- An object with the created time entry

**Throws**

- `403` if the user is not logged in
- `400` if start is incorrect format
- `400` if end is incorrect format
- `400` if the time period from start to end is not a valid non zero time period
- `404` if category with given name is not found
- `409` if this time entry would conflict with another

## `DELETE /api/entries/:entryId?` - Delete an existing time entry

**Returns**

- A success message

**Throws**

- `403` if the user is not logged in
- `404` If the logged in user doesn’t have a time entry with the given ID

## `PUT /api/entries/:entryId?` - Update a time entry

**Body**

- `start` *{string}* - ISO start time
- `end` *{string}* - ISO end time
- `category` *{string} -* The name of the category associated with this time entr
- `tag` *{string}* - The tag for this time entry

**Returns**

- A success message
- An object with the updated time entry

**Throws**

- `403` if the user is not logged in
- `400` if name is in the wrong format
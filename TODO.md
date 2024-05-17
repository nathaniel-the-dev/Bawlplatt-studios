# TODO

## Bugfixes

-   [ ] Fix validation showing up when input wasn't even touched
-   [ ] Update Auth Policies for each table (Supabase)
-   [ ] Differentiate login pages for admin and customer

## Admin Portal

### Auth

-   Complete login features
    -   [x] Error handling
-   [x] Route protection / Access management
-   [x] Forgot password / password reset (make sure page is redirect only accessible)

### Dashboard

-   [ ] Design and develop dashboard page with relevant statistics / graphs / tables

-   Implement user management (for admin only)

    -   User list page
        -   [x] List users
        -   [x] Add pagination and filtering
    -   [x] Add new user
    -   [x] Edit user
    -   [x] View details
    -   [x] Disable/delete accounts

-   Implement booking management

    -   [ ] List table with filtering and sorting
    -   [x] Create new booking
        -   Add validation for dates and times
    -   [ ] Update booking
    -   [ ] Change booking status
    -   [ ] Delete booking (soft delete)

-   [ ] Calendar integration

-   [ ] History page

-   [ ] Transactions

-   Reports

    -   [ ] Generate reports
    -   [ ] Export to CSV

-   User profile

    -   [ ] Edit profile
    -   [ ] Change password
    -   [ ] Delete account

-   Audit
    -   [ ] View the audit logs
    -   [ ] View details

## Website

-   [ ] Landing page
-   [ ] About Us
-   [ ] Contact Us

-   Login / Register

    -   [x] Verify email
    -   [ ] Forgot password

-   [ ] My Bookings
-   [ ] Profile

-   [ ] FAQ
-   [ ] Privacy Policy
-   [ ] Terms and Conditions

#### Audit log example

````json
{
  "_id": {
    "$oid": "6513532559cb8bbfcbded5ec"
  },
  "ref_id": {
    "$oid": "6513532559cb8bbfcbded5ea"
  },
  "model_name": "news",
  "action_type": "create",
  "updated_fields": [
    {
      "field": "title",
      "old_value": "",
      "new_value": "Test"
    },
    {
      "field": "content",
      "old_value": "",
      "new_value": "<p>This is a test</p>"
    },
    {
      "field": "author",
      "old_value": "",
      "new_value": "64df82c1a489eafaf4c08146"
    },
    {
      "field": "type",
      "old_value": "",
      "new_value": "draft"
    }
  ],
  "created_by": {
    "$oid": "64a813e0ab507a27b59b94dc"
  },
  "createdAt": {
    "$date": "2023-09-26T21:54:45.391Z"
  },
  "updatedAt": {
    "$date": "2023-09-26T21:54:45.391Z"
  },
  "__v": 0
}```
````

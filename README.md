# GLOBAL KEEBS 
Check it out for yourself: [global-keebs-iandab47.koyeb.app](global-keebs-iandab47.koyeb.app)

The all-in-one app to view the current keyboard listings on the web. This app takes the listings from r/mechmarket and compacts them into an orgainzed and clean browsing experience, separating listings by flair type and displaying all the details in a neat and intuitive way.

![Home Page](https://i.imgur.com/hqwwGBI.png "Home Page")

![Selling Page](https://i.imgur.com/31tuQ3o.png "Selling Page")

Using the Reddit API, you can link your account to reddit and save your favorite listings as well as comment on them through the site. You can even make your own posts without needing to worry about meeting the requirements.

![Login Page](https://i.imgur.com/37NIA6V.png "Login")

## User Stories
- As a user, I want to view all the newest listings for mechanical keyboards
- As a user, I only care about group buys and I want to see the ongoing listings
- As a user, I would like to save a listing that I like for future reference
- As a user, I would like to request to purchase keyboard products I see on the site

## Tech Stack
- HTML5
- Vanilla CSS
- Node.js
- Postgres

## Packages
- axios
- bcrypt
- crypto
- dotenv
- ejs
- express
- express-js-layouts
- morgan
- pg
- sequelize

## Installation Process
- Fork and clone onto your local device
- Create a .env file with the following variables
  - PORT = '8000'
    - This can be any port available
  - ENC_SECRET = ''
    - Inbetween the quotes needs to contain a string of some amount of characters
  - DATABASE_URI = ''
    - 

### RESTful Charts
##### Users
| HTTP   | URL             | CRUD   | Action                            |
| ---    | ---             | :----: | ---                               |
| POST   | /user/login     | C      | Update user details               |
| POST   | /user/signup    | C      | Update user details               |
| GET    | /user           | R      | Display user details              |
| GET    | /user/edit      | R      | Display user details to edit      |
| GET    | /user/comments  | R      | Display all comments made by user |
| GET    | /user/favorites | R      | Display all favorites by user     |
| GET    | /user/login     | R      | Display login details             |
| GET    | /user/signup    | R      | Display new account details       |
| GET    | /user/delete    | R      | Delete account                    |
| PUT    | /user           | U      | Update user details               |
| DELETE | /user           | D      | Logout of user                    |

##### Listings
| HTTP   | URL                  | CRUD   | Action                                  |
| :---   | :---                 | :----: | :---                                    |
| POST   | /listings            | C      | provide search and filters for listings |
| POST   | /listings/favorite   | C      | Add listing to favorites                |
| GET    | /listings            | R      | display all listings                    |
| GET    | /listings/:listingId | R      | display listing details                 |

##### Comments
| HTTP   | URL                                  | CRUD   | Action                      |
| ---    | ---                                  | :----: | ---                         |
| POST   | /listings/:listingId                 | C      | add listing to favorites    |
| GET    | /listings/:listingId/edit/:commentId | R      | view comment to edit        |
| PUT    | /listings/:listingId/edit/:commentId | U      | Update user details         |
| DELETE | /listings/delete                     | D      | remove comment from listing |

### ERD
![Base ERD](https://i.imgur.com/o3humRS.png "Base ERD")

### MVP Goals
- Site collects newest /r/mechmarket listisngs to display
- Create Listing model to store listing data extracted from /r/mechmarket
- Display all listings by flair type
- Search for listings that include search query in title or post text
- Login to site using created account credentials
- Save and comment on posts

### Stretch Goals
- Implement Reddit API to login with reddit account and post comments/messages/listings to Reddit
- Implement Imgur API to generate thumbnails for listings
- Create Product model to store items being sold or sought
- Categorize and (properly) search for items by type (i.e keyboard, keycaps, desk pad, etc.)
- Save items on account
- Display timestamp (or default image) for all listings
- Animate webpages
- Learn and convert to Angular
- Dark mode
- Make mobile Friendly
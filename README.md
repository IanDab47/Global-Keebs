# GLOBAL KEEBS
The all-in-one app to view the current keyboard listings on the web. This app takes the listings from r/mechmarket and compacts them into an orgainzed and clean browsing experience, separating listings by flair type and displaying all the details in a neat and intuitive way.

![Home Page](https://i.imgur.com/hqwwGBI.png "Home Page")

![Selling Page](https://i.imgur.com/31tuQ3o.png "Selling Page")

Using the Reddit API, you can link your account to reddit and save your favorite listings as well as comment on them through the site. You can even make your own posts without needing to worry about meeting the requirements.

![Login Page](https://i.imgur.com/37NIA6V.png "Login")

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

### ERD
![Base ERD](https://i.imgur.com/K9IaAWC.png "Base ERD")

### MVP Goals
- Site collects newest /r/mechmarket listisngs to display
- Create Listing model to store listing data extracted from /r/mechmarket
- Display all listings by flair type
- Search for listings that include search query in title or post text
- Display Timestamp (or default images) on homepage
- Login to site using Reddit account with Reddit API 
- Use Reddit API to save, comment, and make posts

### Stretch Goals
- Create Product model to store items being sold or sought
- Categorize and (properly) search for items by type (i.e keyboard, keycaps, deskpad, etc.)
- Save items on account
- Display timestamp (or default image) for all listings
- Animate webpages
- Learn and convert to Angular
- Dark mode
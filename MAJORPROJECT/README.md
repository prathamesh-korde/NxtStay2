# NxtStay

NxtStay is a full-stack web application for booking and listing vacation rentals, inspired by platforms like Airbnb. Users can browse, list, and review unique stays from around the world.

## Live Demo
[Deployed Project on Render](https://nxtstay.onrender.com/listings)

## Features
- User authentication (signup/login)
- List new properties with images, descriptions, and locations
- Browse and search listings by location and country
- Leave reviews and ratings for listings
- Responsive and modern UI

## Tech Stack
- **Backend:** Node.js, Express.js
- **Frontend:** EJS templates, HTML, CSS, JavaScript
- **Database:** MongoDB (Mongoose ODM)
- **Other:** Cloudinary (for image uploads), Multer, Passport.js (authentication)

## Project Structure
```
MAJORPROJECT/
├── app.js                # Main Express app
├── middleware.js         # Custom middleware
├── package.json          # Project dependencies and scripts
├── schema.js             # Mongoose schemas
├── controllers/          # Route controllers
├── init/                 # Seed data and initialization
├── models/               # Mongoose models
├── public/               # Static assets (CSS, JS)
├── routes/               # Express route definitions
├── utils/                # Utility functions
├── views/                # EJS templates
```

## Getting Started
1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/NxtStay.git
   cd NxtStay/MAJORPROJECT
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up environment variables:**
   - Create a `.env` file for MongoDB URI, Cloudinary keys, and session secrets.
4. **Run the app locally:**
   ```sh
   node app.js
   ```
5. **Visit:**
   - [http://localhost:3000/listings](http://localhost:3000/listings)

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License.

# FreshBay

FreshBay is an AI-powered platform designed to reduce food waste and fight hunger by efficiently connecting food donors with food banks and pantries. By leveraging smart technology, including AI-driven demand forecasting, satellite imagery analysis, and real-time logistics optimization, FreshBay ensures surplus food reaches those in need.

## Inspiration

Food insecurity affects millions, while vast amounts of food go to waste daily. Inspired by inefficiencies in the current food distribution system, we sought to use AI and technology to optimize food redistribution and maximize impact.

## Features

- **AI-Powered Demand Forecasting**: Uses demographic and economic data to predict food demand.
- **Sentinel-2 Satellite Imagery Integration**: Analyzes agricultural data to determine high-need areas.
- **Smart Matching & Routing**: Optimizes food distribution based on perishability, storage capacity, and urgency.
- **Real-Time Inventory Management**: Tracks available food supplies and ensures equitable distribution.
- **Community Feedback System**: Allows food pantries and individuals to report shortages and delays to refine the AI model.

## Tech Stack

### AI & Machine Learning
- TensorFlow.js
- Scikit-learn
- AI-driven demand forecasting and logistics optimization

### Backend
- Supabase (PostgreSQL) for database management
- Supabase Realtime for real-time updates
- Django for API development

### Frontend
- React (TypeScript) for a responsive user interface
- Mapbox for logistics and real-time demand visualization

### Additional Integrations
- Sentinel-2 satellite data for agricultural productivity analysis
- GPS and Google Earth API for location-based services

## Implementation Overview

### 1. Data Collection & Processing
- Gather hunger-related data from open government sources and NGOs.
- Use Sentinel-2 satellite data to analyze agricultural productivity.
- Store data in a PostgreSQL database managed by Supabase.

### 2. AI & Forecasting Model
- Train machine learning models using TensorFlow.js and Scikit-learn.
- Predict food demand using historical data, economic indicators, and satellite imagery.

### 3. Logistics & Optimization
- Develop an AI-driven matching system that pairs donors with food banks based on perishability and demand.
- Optimize delivery routes with Mapbox and GPS data to reduce travel time and cost.

### 4. User Interface & Real-Time Updates
- Build a user-friendly React-based web application.
- Implement Supabase Realtime for instant updates on food availability and logistics.

## Challenges & Solutions

- **Data Collection & Integration**: We faced difficulties in sourcing accurate hunger data. We addressed this by leveraging open-source datasets and government records.
- **Logistics Optimization**: Managing real-time food distribution was complex. We implemented AI-based routing to ensure efficiency.
- **Satellite Data Processing**: Integrating Sentinel-2 imagery required extensive preprocessing, which we handled with automated scripts.

## Future Plans

- **Expand Partnerships**: Collaborate with food banks, government agencies, and nonprofits.
- **Enhance AI Models**: Improve forecasting accuracy using more datasets and deep learning techniques.
- **Deploy Mobile Food Pantries**: Use AI insights to introduce pop-up distribution sites in high-need areas.
- **Develop a Public API**: Enable third-party organizations to integrate FreshBay’s food redistribution model.
- **Refine Satellite Data Utilization**: Improve crop yield predictions and dynamic food distribution strategies.

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/freshbay.git
   ```
2. Install dependencies:
   ```bash
   cd freshbay
   npm install
   ```
3. Set up backend with Supabase and Django:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
4. Run the development server:
   ```bash
   npm start  # for frontend
   python manage.py runserver  # for backend
   ```

## Contributors

- **Varshith Gude**
- **Arjun Ramesh**
- **Sasidhar J**

## License

This project is licensed under the MIT License.


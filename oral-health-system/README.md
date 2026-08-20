# OralVista – AI-Based Smart Oral Health Prediction and Personalized Dental Assistant System

## Project Overview

OralVista is an AI-based smart oral health web application developed to support early oral health risk assessment, oral health education, and personalized dental assistance. The system is particularly designed with Sri Lankan users in mind and combines machine learning, image-based prediction, artificial intelligence, multilingual support, and dental care information within a single platform.

The system provides separate functionality for registered patients and administrators. Patients can perform symptom-based oral health predictions, upload oral images for analysis, communicate with an AI oral health assistant, access educational content through an Quizes, locate dental clinics, receive newsletters, and review their prediction history.

## Main Features

- AI-based symptom prediction
- Oral image analysis using a CNN model
- AI oral health chat assistant
- AI oral health tutor and educational content
- Dental clinic finder
- Personalized newsletter
- Prediction history
- User profile management
- Multilingual support
- Secure patient authentication
- Admin dashboard
- User management
- Clinic management
- Newsletter management
- System analytics

## Symptom-Based Prediction

The symptom prediction component uses machine learning to assess oral health information entered by the user.

The system considers factors such as:

- Tooth pain
- Gum bleeding
- Bad breath
- Mouth ulcers
- Tooth sensitivity
- Swelling
- White spots
- Dry mouth
- High sugar intake
- Smoking
- Betel chewing
- Brushing frequency
- Age
- Water intake

The prediction model supports oral health categories including:

- Dental Caries
- Gingivitis
- Oral Thrush
- Oral Ulcer
- Periodontitis
- Healthy

Random Forest is considered for the structured symptom-based prediction process.

## Image-Based Prediction

OralVista also contains an image-based prediction component. Users can upload an oral image for AI-assisted analysis.

A Convolutional Neural Network (CNN) based model is used for image classification, with the implemented image prediction focused on:

- Calculus
- Gingivitis
- Hypodontia

## Technology Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React

### Backend

- Node.js
- Express.js
- REST API
- JWT Authentication
- bcrypt

### Database

- MongoDB
- Mongoose

### Artificial Intelligence and Machine Learning

- Python
- Scikit-learn
- Random Forest
- TensorFlow/Keras
- CNN
- SHAP

## Project Structure

```text
oral-health-system/
│
├── ai-model/
│   ├── symptom-model/
│   ├── oralvista_image_model.keras
│   └── oralvista_image_model_fixed.keras
│
├── oral-health-system/
│   ├── backend/
│   └── frontend/
│
├── .gitattributes
├── .gitignore
└── README.md
```

## Security

The system incorporates security mechanisms including:

- JWT-based authentication
- Password hashing
- Role-based authorization
- Protected application routes
- Patient and administrator access control
- Environment variables for sensitive configuration
- Account status management
- Input validation

Sensitive `.env` files are excluded from the GitHub repository using `.gitignore`.

## Running the Project

### 1. Clone the Repository

```bash
git clone <repository-url>
```

### 2. Install Backend Dependencies

Navigate to the backend directory:

```bash
cd oral-health-system/backend
npm install
```

Create the required `.env` configuration and start the backend:

```bash
npm run dev
```

### 3. Install Frontend Dependencies

Navigate to the frontend directory:

```bash
cd oral-health-system/frontend
npm install
npm run dev
```

### 4. Run the AI Service

Navigate to the AI model directory, activate the Python virtual environment, install the required Python dependencies, and start the AI API/service according to the project configuration.

## Important Note

OralVista is developed as an academic software engineering project. AI-generated oral health predictions are intended to provide preliminary guidance and educational support and should not be considered a replacement for professional diagnosis or treatment by a qualified dental professional.

## Project

**Project Name:** OralVista  
**Project Type:** AI-Based Smart Oral Health Prediction and Personalized Dental Assistant System  
**Application Type:** Full-Stack Web Application  
**Primary Context:** Sri Lanka
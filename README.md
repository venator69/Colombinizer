# Colombinizer ⚡

Colombinizer is a cross-platform educational application that provides interactive simulations of **Coulomb’s Law** to support physics learning through virtual experimentation.

This application was developed as the **Final Exam** project for:

**II3140 – Web and Mobile Application Development (K02)**  
Institut Teknologi Bandung

🌐 Live Demo: https://colombinizer.vercel.app

---

## Developers
- Dennis Hubert (13222018)
- Nurul Na'im Natifah (18223106)

---

## Features
- User authentication
- Physics learning materials
- Interactive quizzes
- Coulomb’s Law virtual simulation
- Save and view simulation history

---

## Technology Stack
- **Frontend:** React Native (Expo)
- **Routing:** Expo Router
- **Backend:** Supabase (Authentication & PostgreSQL Database)
- **Visualization:** React Native SVG
- **Gesture Handling:** React Native Gesture Handler

---

## Installation
1. Clone the repository
```bash
git clone https://github.com/venator69/colombinizer.git
```
2. Install dependencies
```bash
npm install
```
3. Configure environment variables
Create a .env file in the root directory:
```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
4. Run the application
```bash
npm expo start
```

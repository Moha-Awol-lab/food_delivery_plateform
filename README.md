# food_delivery_plateform

# 🍔 Full-Stack Food Delivery Ecosystem (Free Tier Edition)

## 🛠 Setup Instructions

### 1. Backend Setup
1. `cd backend`
2. `npm install`
3. Create a `.env` file (Use the template provided in Step 2).
4. `npm run dev` (Starts the server on port 5000).

### 2. Database (Free)
- Create a free account at **Supabase.com**.
- Create a new project and copy the **URI Connection String**.
- Paste it into `DATABASE_URL` in your `.env`.

### 3. Mobile Apps (Customer & Driver)
- `cd frontend-apps/customer-app`
- `npx expo install`
- `npx expo start` (Scan the QR code with your phone to test).

### 4. Restaurant & Admin Dashboard
- `cd frontend-apps/restaurant-dashboard`
- `npm install`
- `npm start`

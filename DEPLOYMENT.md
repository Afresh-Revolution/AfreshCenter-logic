# Deployment Guide for Render

This guide outlines the steps to host the AfreshCenter backend on [Render](https://render.com).

## 1. Hosting Requirements on Render

### Service Type
- Select **Web Service**.

### Runtime
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node src/server.js` (or `npm start`)

### Environment Variables
You MUST set the following environment variables in the Render dashboard (**Environment** tab):

| Variable | Description |
|----------|-------------|
| `PORT` | Set to `3001` (or Render will default to 10000, which is also fine). |
| `DATABASE_URL` | Your PostgreSQL connection string (Supabase). |
| `JWT_SECRET` | A secure, random string for authentication. |
| `RESEND_API_KEY` | Your live API key from Resend. |
| `EMAIL_FROM` | A verified email/domain in your Resend account. |
| `NOTIFICATION_EMAIL` | The email address where you want to receive notifications. |
| `MONGODB_URI` | (Optional) If you are using MongoDB features. |

---

## 2. Resend Setup for Production

To ensure emails are sent successfully from Render, follow these steps in your [Resend Dashboard](https://resend.com/overview):

### A. API Key
1. Go to **API Keys**.
2. Create a new API Key (e.g., "Production AfreshCenter").
3. Copy the key and add it to Render's `RESEND_API_KEY` environment variable.

### B. Domain Verification (Crucial)
1. By default, Resend uses `onboarding@resend.dev` which only allows sending to your own email.
2. For production, go to **Domains** in Resend.
3. Click **Add Domain** and follow the DNS verification steps (adding MX/TXT records to your domain provider like GoDaddy, Namecheap, etc.).
4. Once verified, update the `EMAIL_FROM` environment variable on Render to an email using your domain (e.g., `info@yourdomain.com`).

---

## 3. Deployment Steps

1. **GitHub/GitLab**: Push your code to a repository.
2. **Connect to Render**:
   - Create a new **Web Service**.
   - Connect your repository.
3. **Configure**:
   - Name your service.
   - Set the Branch (e.g., `main`).
   - Fill in the **Build Command** and **Start Command** as shown above.
4. **Environment Variables**: Add all variables from the table in section 1.
5. **Deploy**: Click **Create Web Service**.

---

## 4. Verification
Once the service is "Live":
1. Visit `https://your-app-name.onrender.com/health` to check if it's up.
2. Use the provided [API_ENDPOINTS.md](./API_ENDPOINTS.md) to test your production endpoints.

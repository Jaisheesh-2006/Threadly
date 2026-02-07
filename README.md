# Chat App

Full-stack chat app.

## Local dev

- Backend: `cd backend` then `npm install` and `npm run dev`
- Frontend: `cd frontend` then `npm install` and `npm run dev`

## Production env

Backend (Railway):

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLIENT_ORIGIN` (comma-separated, e.g. `https://your-vercel-app.vercel.app`)

Placeholders (Railway):

```
PORT=5001
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.example.mongodb.net/chat?retryWrites=true&w=majority
JWT_SECRET=replace-with-strong-secret
CLOUDINARY_CLOUD_NAME=cloud_name_here
CLOUDINARY_API_KEY=cloud_api_key_here
CLOUDINARY_API_SECRET=cloud_api_secret_here
CLIENT_ORIGIN=https://your-vercel-app.vercel.app
```

Frontend (Vercel):

- `VITE_API_BASE_URL` (e.g. `https://your-railway-app.up.railway.app/api`)
- `VITE_SOCKET_URL` (e.g. `https://your-railway-app.up.railway.app`)

Placeholders (Vercel):

```
VITE_API_BASE_URL=https://your-railway-app.up.railway.app/api
VITE_SOCKET_URL=https://your-railway-app.up.railway.app
```

## Deploy

- Deploy backend to Railway, then set frontend env values to that URL.
- Deploy frontend to Vercel.

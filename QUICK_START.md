# Quick Start Guide - ChatFlow

Get ChatFlow up and running in 5 minutes!

## 📋 Prerequisites

Before you begin, make sure you have:
- ✅ Node.js 18 or higher installed
- ✅ npm or pnpm package manager
- ✅ Git installed
- ✅ A code editor (VS Code recommended)

## 🚀 Frontend Setup (Current Project)

### Step 1: Verify Installation

The frontend is already set up! Just verify everything is working:

```bash
# Check if dependencies are installed
npm list

# If not installed, run:
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`

### Step 3: Explore the App

Open your browser and navigate to `http://localhost:5173`. You should see:
- ✅ Left sidebar with channels
- ✅ Chat area in the center
- ✅ Message input at the bottom
- ✅ User profile in the top right

### Step 4: Test Features

Try these actions:
1. **Switch channels** - Click on different channels in the sidebar
2. **Send messages** - Type in the input and press Enter
3. **Add reactions** - Hover over a message and click the emoji icon
4. **View profile** - Click your avatar in the top right
5. **View members** - Click the users icon on the right side

## 🎨 Customization Quick Tips

### Change the App Name

Edit `/src/app/components/Sidebar.tsx`:
```typescript
<h2 className="font-semibold text-lg">Your App Name</h2>
```

### Add Your User Photo

Edit `/src/app/data/mockData.ts`:
```typescript
{
  id: 'user-1',
  name: 'Your Name',
  email: 'your@email.com',
  avatar: 'YOUR_IMAGE_URL',
  // ...
}
```

### Create New Channels

Add to `/src/app/data/mockData.ts` in the `mockChannels` array:
```typescript
{
  id: 'channel-new',
  name: 'my-channel',
  description: 'My awesome channel',
  type: 'public',
  members: ['user-1', 'user-2'],
  createdAt: new Date(),
}
```

## 🔧 Backend Setup (Optional)

If you want to add a real backend with database:

### Option A: Quick Setup with Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your API keys
4. Install Supabase client:
   ```bash
   npm install @supabase/supabase-js
   ```

### Option B: Node.js Backend

See [BACKEND_GUIDE.md](BACKEND_GUIDE.md) for complete instructions.

Quick setup:
```bash
# In a new terminal/folder
mkdir chatflow-backend
cd chatflow-backend
npm init -y
npm install express socket.io cors dotenv
npm install prisma @prisma/client
```

## 📦 Building for Production

```bash
# Build the app
npm run build

# The build output will be in /dist folder
```

## 🌐 Deploy Your App

### Deploy to Vercel (Easiest)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Click "Deploy"

### Deploy to Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Connect your repository
4. Set build command: `npm run build`
5. Set publish directory: `dist`
6. Click "Deploy"

## 📝 Common Issues & Solutions

### Issue: Port already in use
```bash
# Kill the process using port 5173
# On Mac/Linux:
lsof -ti:5173 | xargs kill -9

# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Issue: Dependencies not installed
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Build fails
```bash
# Clear cache and rebuild
rm -rf dist
npm run build
```

## 🎯 Next Steps

1. ✅ **Explore the code** - Check out the components in `/src/app/components/`
2. ✅ **Read the docs** - See [README.md](README.md) for full documentation
3. ✅ **Add backend** - Follow [BACKEND_GUIDE.md](BACKEND_GUIDE.md)
4. ✅ **Customize design** - Modify styles in `/src/styles/`
5. ✅ **Deploy** - Share your app with the world!

## 📚 Useful Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)

## 💡 Pro Tips

### Hot Reload
The app automatically refreshes when you save changes!

### DevTools
Open browser DevTools (F12) to see console logs and debug

### Component Library
All UI components are in `/src/app/components/ui/`

### State Management
Global state is managed in `/src/app/context/ChatContext.tsx`

## 🆘 Need Help?

- 📖 Check the [README.md](README.md)
- 🐛 Found a bug? Open an issue on GitHub
- 💬 Have questions? See [CONTRIBUTING.md](CONTRIBUTING.md)

## 🎉 You're All Set!

Your ChatFlow app is ready to use. Happy coding! 🚀

---

Made with ❤️ by the ChatFlow team

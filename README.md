# ChatFlow - Professional Real-time Chat Application

A modern, feature-rich real-time chat application built with React.js, TypeScript, and Tailwind CSS. This application demonstrates professional-grade UI/UX design and includes all essential features for team communication.

![ChatFlow](https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=1200&h=400&fit=crop)

## 🚀 Features

### Core Features
- **Real-time Messaging**: Send and receive messages instantly
- **Multiple Channels**: Support for public channels, private channels, and direct messages
- **User Presence**: Real-time online/offline/away/busy status indicators
- **Typing Indicators**: See when other users are typing
- **Message Reactions**: React to messages with emojis (👍 ❤️ 😂 🎉 🚀 👀)
- **Message Threading**: Reply to specific messages
- **Message Editing**: Edit your sent messages
- **Message Deletion**: Delete your own messages
- **Rich Text Support**: Multi-line messages with proper formatting

### Advanced Features
- **User Profiles**: Detailed user information with avatars and bio
- **Channel Management**: Organized channels with descriptions and member lists
- **Unread Message Counters**: Track unread messages per channel
- **Search Functionality**: Search through message history
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Mode Ready**: Built with theme support
- **Professional UI**: Modern, clean interface using shadcn/ui components

### User Experience
- **Smooth Animations**: Polished transitions and micro-interactions
- **Keyboard Shortcuts**: Enter to send, Shift+Enter for new line
- **Message Grouping**: Reactions grouped by emoji type
- **Hover Actions**: Quick access to message actions
- **Copy to Clipboard**: Easy message copying
- **Status Management**: Set your availability status

## 📁 Project Structure

```
chatflow/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── ui/              # Reusable UI components
│   │   │   ├── ChannelItem.tsx  # Channel list item
│   │   │   ├── ChatArea.tsx     # Main chat display area
│   │   │   ├── Header.tsx       # Top navigation bar
│   │   │   ├── Message.tsx      # Individual message component
│   │   │   ├── MessageInput.tsx # Message composition area
│   │   │   ├── RightSidebar.tsx # Channel details sidebar
│   │   │   └── Sidebar.tsx      # Left navigation sidebar
│   │   ├── context/
│   │   │   └── ChatContext.tsx  # Global state management
│   │   ├── data/
│   │   │   └── mockData.ts      # Sample data for demo
│   │   ├── types/
│   │   │   └── chat.ts          # TypeScript type definitions
│   │   ├── App.tsx              # Main application component
│   │   └── routes.ts            # React Router configuration
│   ├── styles/                  # Global styles
│   └── ...
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 🛠️ Technologies Used

- **React 18.3** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first CSS framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Radix UI** - Accessible UI primitives
- **Lucide React** - Icon library
- **date-fns** - Date formatting
- **shadcn/ui** - Pre-built component library

## 📦 Installation

### Prerequisites
- Node.js 18.x or higher
- npm or pnpm package manager

### Setup Instructions

1. **Clone the repository** (see Git Setup section below)

2. **Install dependencies**:
```bash
npm install
# or
pnpm install
```

3. **Start the development server**:
```bash
npm run dev
# or
pnpm dev
```

4. **Build for production**:
```bash
npm run build
# or
pnpm build
```

## 🔧 Git Repository Setup

### Initialize a New Git Repository

```bash
# Navigate to your project directory
cd chatflow

# Initialize Git repository
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: ChatFlow real-time chat application"

# Create main branch (if not already created)
git branch -M main
```

### Connect to GitHub

1. **Create a new repository on GitHub**:
   - Go to https://github.com/new
   - Name your repository (e.g., "chatflow")
   - Don't initialize with README, .gitignore, or license
   - Click "Create repository"

2. **Link your local repository to GitHub**:
```bash
# Add remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/chatflow.git

# Push to GitHub
git push -u origin main
```

### Recommended .gitignore

Create a `.gitignore` file in your project root:

```gitignore
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build
/dist

# Misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Editor
.vscode/
.idea/
*.swp
*.swo
*~

# OS
Thumbs.db
```

### Git Workflow

```bash
# Check status
git status

# Add specific files
git add src/app/components/NewComponent.tsx

# Or add all changes
git add .

# Commit with message
git commit -m "Add new feature: message threading"

# Push to GitHub
git push origin main

# Create a new branch for features
git checkout -b feature/new-feature

# Push new branch to GitHub
git push -u origin feature/new-feature
```

## 🎨 Customization

### Adding New Channels

Edit `/src/app/data/mockData.ts` and add new channel objects to the `mockChannels` array:

```typescript
{
  id: 'channel-new',
  name: 'new-channel',
  description: 'Description of new channel',
  type: 'public',
  members: ['user-1', 'user-2'],
  createdAt: new Date(),
  unreadCount: 0,
}
```

### Adding New Users

Add user objects to the `mockUsers` array in `/src/app/data/mockData.ts`:

```typescript
{
  id: 'user-new',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://...',
  status: 'online',
  bio: 'Software Developer',
}
```

### Theming

Modify color tokens in `/src/styles/theme.css` to customize the appearance.

## 🔌 Backend Integration

This is currently a frontend-only application using mock data. To integrate with a real backend:

### Option 1: REST API
1. Replace mock data with API calls
2. Use `fetch` or `axios` for HTTP requests
3. Implement authentication (JWT tokens)
4. Add error handling and loading states

### Option 2: WebSocket (Recommended for Real-time)
1. Use Socket.io for bidirectional communication
2. Connect to your Node.js WebSocket server
3. Listen for events: `message`, `typing`, `user-joined`, etc.
4. Emit events for user actions

### Option 3: Firebase/Supabase
1. Set up Firebase Realtime Database or Firestore
2. Or use Supabase for PostgreSQL with real-time subscriptions
3. Replace ChatContext with Firebase/Supabase hooks
4. Implement authentication

## 📱 Responsive Design

The application is fully responsive:
- **Desktop** (1024px+): Full three-column layout with sidebars
- **Tablet** (768px - 1023px): Collapsible sidebars
- **Mobile** (< 768px): Single column with drawer navigation

## 🧪 Testing

To add testing to your project:

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Run tests
npm run test
```

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Deploy to GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Ann Mariya Brighto

## 🙏 Acknowledgments

- shadcn/ui for beautiful component library
- Radix UI for accessible primitives
- Lucide for icons
- Tailwind CSS team for the framework

## 📞 Support

For support, annmariya907227@gmail.com or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] File upload and sharing
- [ ] Voice/Video calling
- [ ] Message search with filters
- [ ] Custom emoji reactions
- [ ] Thread view for conversations
- [ ] Notification system
- [ ] Mobile app (React Native)
- [ ] End-to-end encryption
- [ ] Message pinning
- [ ] User @mentions
- [ ] Channel bookmarks
- [ ] Rich media previews
- [ ] Code syntax highlighting
- [ ] Message scheduling

## 💡 Tips

- Use Ctrl/Cmd + K to search
- Press Enter to send, Shift+Enter for new line
- Hover over messages to see quick actions
- Click emoji reactions to add/remove
- Right-click messages for more options

---

Made with ❤️ using React and Tailwind CSS

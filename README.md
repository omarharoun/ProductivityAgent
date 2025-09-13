# Life Productivity Planner Agent - Production Scale

A production-ready Notion-like interface built with Next.js 14, featuring a comprehensive sidebar, advanced content rendering, and flexible embedding options.

## 🚀 Features

### Production-Scale UI
- **Notion-inspired Design**: Clean, modern interface that mirrors Notion's aesthetics
- **Responsive Sidebar**: Collapsible sidebar with user info, pages, and databases
- **Advanced Content Rendering**: Full support for Notion blocks including headings, lists, todos, code, images, and more
- **Database Viewer**: Table-based view for Notion databases with proper property rendering
- **Embedding System**: Flexible content embedding with both API-based and iframe options

### Core Functionality
- **Notion API Integration**: Full integration with Notion's official API
- **Page Management**: Browse and view all your Notion pages
- **Database Support**: View and interact with Notion databases
- **User Authentication**: Secure connection to Notion workspaces
- **Real-time Content**: Dynamic loading and rendering of Notion content

## 🏗️ Architecture

### Key Components
- `NotionLayout`: Main layout wrapper with sidebar and content area
- `Sidebar`: Navigation component with user info and page/database listings
- `PageViewer`: Advanced renderer for Notion page content
- `NotionEmbed`: Flexible embedding component for content integration
- `DatabasePage`: Table view for database content

### API Routes
- `/api/notion/connect` - User authentication and connection testing
- `/api/notion/pages` - Fetch all user pages
- `/api/notion/page/[id]` - Get specific page content and blocks
- `/api/notion/databases` - List available databases
- `/api/notion/query` - Query database entries

## 🎨 Design System

### Color Palette
- **Background**: Clean whites and subtle grays
- **Text**: Professional dark grays with proper contrast
- **Accents**: Notion-inspired blues for interactive elements
- **Borders**: Subtle borders for clean separation

### Typography
- **Font**: System fonts for optimal performance and readability
- **Hierarchy**: Clear heading structure (H1-H3) with proper sizing
- **Code**: Monospace fonts for code blocks and inline code

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Notion integration token
- (Optional) Supabase account for data persistence

### Environment Variables
Create a `.env.local` file with:

```env
NOTION_INTERNAL_TOKEN=your_notion_integration_token
SUPABASE_URL=your_supabase_url (optional)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_key (optional)
```

### Installation & Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Configuration

### Notion Integration
1. Create a Notion integration at https://www.notion.so/my-integrations
2. Copy your integration token to the environment variables
3. Share your Notion pages/databases with your integration

### Embedding Options
The app supports two embedding modes:
- **API Mode**: Full control with custom rendering (recommended)
- **iframe Mode**: Direct embedding of public Notion pages

## 📱 Responsive Design

The interface is fully responsive with:
- Mobile-optimized sidebar (240px on mobile, 280px on desktop)
- Adaptive content padding
- Touch-friendly interactions
- Collapsible navigation

## 🔮 Advanced Features

### Content Rendering
- **Rich Text**: Bold, italic, strikethrough, underline, code formatting
- **Links**: External and internal link support
- **Lists**: Bulleted and numbered lists with nesting
- **Code Blocks**: Syntax highlighting support
- **Images**: Optimized image rendering with captions
- **Todos**: Interactive checkboxes (read-only)

### Database Features
- **Property Types**: Support for all Notion property types
- **Table View**: Clean, sortable table interface
- **Responsive Tables**: Horizontal scrolling on mobile

## 🚀 Deployment

The app is production-ready and can be deployed to:
- Vercel (recommended for Next.js apps)
- Netlify
- Railway
- Any Node.js hosting platform

## 🤝 Contributing

This is a production-scale implementation focused on:
- Performance optimization
- Type safety
- Clean architecture
- Extensible design patterns

## 📄 License

MIT License - feel free to use this as a foundation for your own Notion-like applications.

---

Built with ❤️ using Next.js, TypeScript, and the Notion API.
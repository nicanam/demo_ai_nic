# AI Sales Agent

A Next.js application that provides AI-powered sales training through realistic conversations with Anam AI persona avatars. Practice your sales skills, handle objections, and improve your techniques in a safe, realistic environment.

## Features

- 🤖 **AI-Powered Conversations**: Practice with realistic AI personas that respond like real prospects
- 🎯 **Sales Training**: Improve your pitch, handle objections, and refine your sales approach
- 📱 **Mobile Friendly**: Fully responsive design that works on all devices
- ⚡ **Real-time Video/Audio**: Live streaming with Anam AI personas
- 📊 **Session Tracking**: Monitor your training sessions with built-in timers
- 🎨 **Modern UI**: Clean, elegant interface built with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Anam AI API key

### Local Development

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd ai-sales-agent
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```bash
   ANAM_API_KEY=your_anam_api_key_here
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## Vercel Deployment

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ai-sales-agent)

### Manual Deployment

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables:**
   In your Vercel dashboard, go to your project settings and add:
   - `ANAM_API_KEY`: Your Anam AI API key

### Environment Variables Setup for Vercel

Add the following environment variable in your Vercel project settings:

| Variable | Description | Example |
|----------|-------------|---------|
| `ANAM_API_KEY` | Your Anam AI API key for persona authentication | `YWU0NDVjYTYtNmJk...` |

## Configuration

### Persona Configuration

The application is configured to use a specific Anam AI persona. To change the persona:

1. Update the `personaId` in `app/components/ChatInterface.tsx`:
   ```typescript
   const personaId = "your-persona-id-here";
   ```

### Call-to-Action Timing

The call-to-action button appears after 5 minutes by default. To modify this:

1. Edit `app/components/CallToActionButton.tsx`:
   ```typescript
   setTimeout(() => {
     setIsVisible(true);
   }, 300000); // Change this value (in milliseconds)
   ```

## Project Structure

```
ai-sales-agent/
├── app/
│   ├── components/
│   │   ├── CallToActionButton.tsx    # Delayed CTA component
│   │   └── ChatInterface.tsx         # Main AI chat interface
│   │   
│   ├── api/
│   │   └── anam-auth/
│   │       └── [id]/
│   │           └── route.ts          # Anam session token API
│   │   
│   ├── globals.css                   # Global styles
│   │   
│   ├── layout.tsx                    # App layout
│   │   
│   └── page.tsx                      # Landing page
├── public/                           # Static assets
├── vercel.json                       # Vercel configuration
└── package.json                      # Dependencies
```

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4
- **AI Integration**: Anam AI JavaScript SDK
- **Language**: TypeScript
- **Deployment**: Vercel (optimized)

## Key Features Implementation

### AI Integration
- Single session token per chat session
- Proper cleanup of Anam client instances
- Error handling and loading states
- Real-time video/audio streaming

### User Experience
- Mobile-responsive design
- Smooth animations and transitions
- Loading states and error handling
- Session timing and controls

### Call-to-Action System
- 5-minute delayed appearance
- Gentle animations
- Mobile-responsive positioning
- Direct calendar booking integration

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Support

For support with the application, contact the development team.
For Anam AI specific issues, visit [Anam AI Documentation](https://docs.anam.ai).

## License

This project is licensed under the MIT License.

---

**Powered with ANAM.AI**

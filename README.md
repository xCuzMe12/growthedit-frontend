# GrowthEdit - Video Creation App

A stunning full-width desktop video creation application with a modern dark theme and vibrant color scheme.

## Features

- **6 Page Flow**: Seamless navigation through the video creation process
- **Desktop-First Design**: Full-width layout optimized for desktop screens
- **Modern Color Scheme**: Turquoise Green (#1BDBDB) and Violet (#9968FF) with dark background
- **Responsive Layout**: Adapts beautifully to all screen sizes
- **AI-Powered**: Template-based video generation with AI prompts
- **Customizable**: Regenerate frames, add music, and generate subtitles

## Design System

### Colors
- **Primary**: Turquoise Green (#1BDBDB) - Used for main CTAs and highlights
- **Secondary**: Violet (#9968FF) - Used for accents and borders
- **Background**: Dark Gray (#1a1a1a) - Creates contrast and makes elements pop
- **Gradients**: Beautiful transitions between primary and secondary colors

## Pages

1. **Welcome Page**: Start your video creation journey
2. **Template Page**: Select template and input AI prompts
3. **Image Slots**: Review and regenerate 6 generated frames
4. **Video Previews**: Choose from 3 AI-generated video options
5. **Full Video**: Customize with music and subtitles
6. **Final Video**: Download your completed video

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- CSS3 with modern animations

## Development

The app is built with a desktop-first approach, featuring full-width layouts that make optimal use of screen space. All pages are responsive and feature smooth transitions between states, with careful attention to maintaining usability on smaller screens.

## Project Structure

```
src/
├── pages/           # All page components
├── App.tsx          # Main app component with routing
├── App.css          # Global app styles
├── index.css        # Base styles
└── main.tsx         # Entry point
```

## Usage

1. Open http://localhost:5174/ (or the port shown in your terminal)
2. Click "Generate Video" on the stunning welcome page
3. Select a template and enter your AI prompt in the side-by-side layout
4. Upload a reference image (optional) with the beautiful drag-and-drop area
5. Review 6 generated image frames in a grid layout and regenerate if needed
6. Choose from 3 video previews displayed in a clean grid
7. Customize with background music and enable subtitles
8. Download your final video from the completion page

Enjoy creating amazing videos with GrowthEdit! 🎬✨

## Screenshots

The app features:
- Full-width layouts that utilize desktop screen space effectively
- Dark theme (#1a1a1a) with vibrant turquoise and violet accents
- Smooth gradients and hover effects throughout
- Grid-based layouts for images and videos (3 columns on desktop, responsive on mobile)
- Large, accessible buttons and form fields
- Professional typography and spacing

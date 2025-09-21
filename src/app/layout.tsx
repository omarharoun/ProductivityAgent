import type { Metadata } from 'next';
import './globals.css';
import VoiceAssistant from './components/VoiceAssistant';

export const metadata: Metadata = {
  title: 'Life Productivity Planner Agent',
  description: 'AI-assisted planning and journaling with Notion integration'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <VoiceAssistant />
      </body>
    </html>
  );
}


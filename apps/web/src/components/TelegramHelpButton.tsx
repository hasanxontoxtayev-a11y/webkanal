import Link from 'next/link';
import { Send, HelpCircle } from 'lucide-react';

interface TelegramHelpButtonProps {
  featureKey: 'thumbnails' | 'comment_copilot' | 'posting_time' | 'overview';
  label?: string;
  className?: string;
}

export function TelegramHelpButton({
  featureKey,
  label = "Ask Bot",
  className = "",
}: TelegramHelpButtonProps) {
  const rawUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "tubepilotai_bot";
  const botUsername = rawUsername.replace(/^@/, '');
  const telegramUrl = `https://t.me/${botUsername}?start=help_${featureKey}`;

  return (
    <Link
      href={telegramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 border border-sky-500/20 transition-all ${className}`}
      title="Open instant contextual help in Telegram"
    >
      <Send className="w-3 h-3" />
      <span>{label}</span>
    </Link>
  );
}

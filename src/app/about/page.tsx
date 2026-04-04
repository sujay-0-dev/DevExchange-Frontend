"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { useTranslation } from 'react-i18next';

export default function AboutPage() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully!');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background text-foreground overflow-y-auto">
      {/* NAVBAR */}
      <nav className="sticky top-0 w-full z-[101] border-b bg-background/95 backdrop-blur">
        <div className="container max-w-6xl mx-auto flex h-14 items-center justify-between px-4">
          <Link href="/" className="font-bold text-blue-500 text-xl tracking-tight">
            DevExchange
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm hover:text-blue-400">Home</Link>
            <Link href="#features" className="text-sm hover:text-blue-400">Features</Link>
            <Link href="#contact" className="text-sm hover:text-blue-400">Contact</Link>
            <Link href="#contact" className="text-sm hover:text-blue-400">Contact</Link>
            <div className="flex items-center gap-2">
              {user ? (
                <Button size="sm" onClick={() => logout()}>Logout</Button>
              ) : (
                <>
                  <Link href="/login"><Button variant="ghost" size="sm">Log In</Button></Link>
                  <Link href="/register"><Button size="sm">Sign Up</Button></Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="w-full py-24 md:py-32 bg-gradient-to-br from-slate-900 via-background to-blue-900/20 text-center flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-white">{t('about.welcome', 'Welcome to DevExchange')}</h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-[600px] mb-8">
          {t('about.subtitle', 'The Gamified Developer Q&A Platform where knowledge meets community.')}
        </p>
        <p className="text-slate-400 max-w-2xl mb-8">
          {t('about.description', "A place to ask questions, help others, and earn reputation. Let's build the best developer ecosystem together.")}
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">{t('about.getStarted', 'Get Started →')}</Button>
          </Link>
          <Link href="/questions">
            <Button size="lg" variant="outline" className="text-white border-slate-600 hover:bg-slate-800">{t('about.viewQuestions', 'View Questions')}</Button>
          </Link>
        </div>
        
        {/* Decorative Visual */}
        <div className="mt-16 max-w-3xl mx-auto w-full border border-slate-800 rounded-xl bg-slate-950 p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-2 left-3 flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <pre className="text-sm text-left mt-4 text-green-400 font-mono overflow-x-auto">
            <code>
{`async function getAnswer() {
  const query = "How to center a div?";
  const answer = await DevExchange.ask(query);
  return { status: "success", points: +10, reputation: "Expert" };
}`}
            </code>
          </pre>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 bg-background px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{t('about.features', 'Available Features')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🔐', title: 'Secure Authentication', desc: 'Secure login with Email and OTP.' },
              { icon: '🎮', title: 'Gamified Reputation', desc: 'Earn reputation points for your interactions.' },
              { icon: '💬', title: 'Real-time Answers', desc: 'Get fast responses from community experts.' },
              { icon: '🌐', title: 'Multi-language Support', desc: 'Switch languages to learn in your native tongue.' },
              { icon: '🏆', title: 'Points & Leaderboard', desc: 'Compete for the top spot among contributors.' },
              { icon: '💳', title: 'Subscription Plans', desc: 'Upgrade limits for enhanced productivity.' },
            ].map(f => (
              <div key={f.title} className="p-6 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-800 transition-colors">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-white">{f.title}</h3>
                <p className="text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT US SECTION */}
      <section id="contact" className="py-20 bg-slate-950 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-6">{t('about.contact', 'Contact Us')}</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-slate-300">
                <span className="text-xl">📧</span>
                <span>Email: support@devexchange.com</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <span className="text-xl">🌐</span>
                <span>Platform: DevExchange</span>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 p-6">
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300">{t('about.name', 'Name')}</label>
                <Input required className="mt-1 bg-slate-800 border-slate-700" placeholder="John Doe" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">{t('about.email', 'Email')}</label>
                <Input type="email" required className="mt-1 bg-slate-800 border-slate-700" placeholder="john@example.com" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">{t('about.message', 'Message')}</label>
                <Textarea required className="mt-1 bg-slate-800 border-slate-700 min-h-[120px]" placeholder="How can we help?" />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">{t('about.sendMessage', 'Send Message')}</Button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-background py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-slate-400">
            DevExchange © 2025
          </div>
          <div className="flex gap-6 text-sm text-slate-400">
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/questions" className="hover:text-white">Questions</Link>
            <Link href="/pricing" className="hover:text-white">Pricing</Link>
            <Link href="/leaderboard" className="hover:text-white">Leaderboard</Link>
          </div>
          <div className="text-slate-400 text-sm">
            Built for developers, by developers
          </div>
        </div>
      </footer>
    </div>
  );
}

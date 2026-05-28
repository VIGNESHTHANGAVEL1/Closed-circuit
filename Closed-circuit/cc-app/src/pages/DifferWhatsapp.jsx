import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, CheckCircle } from 'lucide-react';
import Hero from '../components/Hero';
import Card from '../components/Card';
import { visuals } from '../data/visuals';

export default function DifferWhatsapp() {
  const rows = [
    ['Purpose', 'Designed for quick messaging', 'Designed for family community and memory sharing'],
    ['Message Flow', 'Messages appear in a continuous chat and quickly get buried', 'Posts appear in a structured social feed'],
    ['Photo & Video Storage', 'Media gets mixed in chats and is hard to find later', 'Photos and videos are organized in albums and categories'],
    ['Content Organization', 'No structured organization for events or family groups', 'Organized by events, albums, and family groups'],
    ['Notifications', 'Too many notifications from messages and forwards', 'Controlled and meaningful notifications'],
    ['Large Family Management', 'Difficult to manage when families grow', 'Easy to manage large family communities'],
    ['Privacy Control', 'Anyone added to the group can see everything', 'Admin approval required for members'],
    ['Content Moderation', 'No proper moderation tools', 'Admins can approve members and manage content'],
    ['Long-Term Memories', 'Old memories get lost in chat history', 'Memories remain organized and searchable forever'],
    ['Community Experience', 'Conversation-based communication', 'Private family social network experience'],
    ['Data Storage', 'Stored within messaging platform ecosystem', 'Stored securely on your dedicated VPS server'],
    ['Family Identity', 'Just a chat group', "Your family's private digital home"],
  ];

  const advantages = [
    'Structured posts and media',
    'Organized family memories',
    'Controlled membership',
    'Dedicated VPS hosting for security',
    'A private social space only for your loved ones',
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#030712] text-slate-300">
      <Hero
        eyebrow="How We Differ"
        title="WhatsApp vs Private Family Platform"
        subtitle="Messaging apps are excellent for quick conversations, but they are not designed to preserve family memories."
      />

      {/* Section 1: Comparison Cards instead of Table */}
      <section className="relative py-32 border-b border-white/5 bg-[#030712] overflow-hidden">
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-purple-500/10 blur-[200px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-pink-500/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="mb-16 text-center max-w-3xl mx-auto">
             <h2 className="font-display text-4xl font-bold text-white tracking-tight mb-6">Messaging vs Memories</h2>
             <p className="text-lg text-slate-400 leading-relaxed">
               Chats move fast, but memories deserve structure, visibility control, and long-term organization. See the difference in how we handle your legacy.
             </p>
          </div>

          <div className="grid gap-6">
            {rows.map((row, idx) => (
              <motion.div 
                key={row[0]}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="grid lg:grid-cols-[1.2fr_1.5fr_1.5fr] gap-0 bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden group hover:border-purple-500/30 transition-all duration-300 shadow-xl"
              >
                {/* Feature Name */}
                <div className="p-6 bg-white/[0.01] flex items-center border-b lg:border-b-0 lg:border-r border-white/10">
                  <h3 className="font-display font-bold text-xl text-white tracking-tight">
                    {row[0]}
                  </h3>
                </div>
                
                {/* WhatsApp */}
                <div className="p-6 lg:p-8 flex flex-col gap-3 relative border-b lg:border-b-0 lg:border-r border-white/10 bg-orange-500/[0.02] group-hover:bg-orange-500/[0.04] transition-colors">
                  <div className="flex items-center gap-2">
                     <XCircle className="w-4 h-4 text-orange-500" />
                     <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">WhatsApp Groups</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">
                    {row[1]}
                  </p>
                </div>

                {/* Private Platform */}
                <div className="p-6 lg:p-8 flex flex-col gap-3 relative bg-purple-500/[0.05] group-hover:bg-purple-500/[0.1] transition-colors">
                   <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-purple-500/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center gap-2 relative z-10">
                     <CheckCircle className="w-4 h-4 text-purple-400" />
                     <span className="text-xs font-bold text-purple-300 uppercase tracking-widest">Private Platform</span>
                  </div>
                  <p className="text-white font-semibold text-base leading-relaxed relative z-10">
                    {row[2]}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Why Private left | Image right */}
      <section className="relative py-32 bg-[#0f172a]/40">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
          <Card className="p-10 border border-white/10 bg-gradient-to-br from-purple-500/10 to-transparent">
            <h3 className="font-display text-3xl font-bold text-white tracking-tight leading-tight">
              Why a Private Family Platform Is Better
            </h3>
            <p className="mt-5 text-lg text-slate-400 leading-relaxed">
              A private family platform provides the structure and control required to preserve meaningful memories
              and manage large communities securely.
            </p>
            <ul className="mt-8 space-y-4 text-base text-slate-300 font-medium">
              {advantages.map((item) => (
                <li key={item} className="flex items-start gap-4">
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="overflow-hidden p-0 border border-white/10 group h-full">
            <img
              src={visuals.celebration}
              alt="Shared family moments"
              className="h-full min-h-[400px] w-full object-cover transition-transform duration-1000 group-hover:scale-105"
              loading="lazy"
            />
          </Card>
        </div>
      </section>
    </motion.div>
  );
}

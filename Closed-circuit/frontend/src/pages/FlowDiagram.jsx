import { motion } from 'framer-motion';
import { Map, ArrowDown } from 'lucide-react';
import Hero from '../components/Hero';
import Card from '../components/Card';
import { visuals } from '../data/visuals';

const flowNodes = [
  {
    title: 'Share Community Link',
    subtitle: '(Digital Home Page)',
  },
  {
    title: 'User Signup',
    subtitle: 'Mobile + OTP Only\n(No Email / Password)',
  },
  {
    title: 'Admin Approval',
    subtitle: 'Verify & Approve User',
  },
  {
    title: 'Secure Login',
    subtitle: 'Mobile + OTP',
  },
  {
    title: 'Community Setup by Admin',
    subtitle: '• Create Group Types\n• Create Groups\n• Assign Members to Groups',
  },
  {
    title: 'Content Management',
    subtitle: 'Admin Posts: Text, Images, Videos\nSelect Groups for Visibility\n→ Members receive SMS Notification',
  },
  {
    title: 'Member Post Request',
    subtitle: 'Member creates Post\nPost sent to Admin for Approval',
  },
  {
    title: 'Admin Moderation',
    subtitle: 'Approve or Reject Post\nAssign Post to Groups',
  },
  {
    title: 'Members Receive Alert',
    subtitle: '"New Post Available"\nView in Dashboard',
  },
  {
    title: 'Community Interaction',
    subtitle: '• Like Posts\n• Comment Posts\n• See Who Liked & Commented',
  },
  {
    title: 'Events Management',
    subtitle: 'Admin Creates Events\nAssign Events to Specific Groups',
  },
  {
    title: 'Album Management',
    subtitle: 'Create Albums for Events\nUpload Photos & Videos\nAssign Albums to Groups',
  },
  {
    title: 'Private Community Rules',
    subtitle: '• No external sharing\n• No outside content imports\n• Fully private network',
  },
  {
    title: 'Admin Platform Controls',
    subtitle: '• Manage Brand Identity\n• Update Homepage Images\n• Block Members',
  },
];

const highlights = [
  'Share the community link and verify users with OTP.',
  'Admins approve members and manage group visibility.',
  'Members submit posts that require admin moderation.',
  'Events and albums stay private within assigned groups.',
  'Platform remains closed with no external sharing.',
];

const steps = [
  'Invite members with a private link.',
  'Verify signup with OTP and admin approval.',
  'Create groups, events, and albums.',
  'Publish posts with visibility control.',
  'Engage through likes, comments, and updates.',
];

export default function FlowDiagram() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#030712] text-slate-300">
      <Hero
        eyebrow="App Flow"
        title="Flow Visualizer"
        subtitle="A vibrant, visual sequence of how the Closed Circuit platform operates from signup to community engagement."
      />

      <section className="relative py-32 border-b border-white/5 bg-[#030712]">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[200px] rounded-full pointer-events-none" />
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1.2fr_0.8fr] relative z-10">
          
          <Card className="p-10 border border-white/10 bg-[#0f172a]/80 backdrop-blur-xl relative overflow-hidden">
             {/* Gradient glow behind the timeline */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-indigo-500/10 to-transparent pointer-events-none" />
            
            <div className="flex items-center gap-4 mb-12 relative z-10">
              <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400 border border-indigo-500/30">
                <Map className="h-6 w-6" />
              </div>
              <h2 className="font-display text-3xl font-bold text-white tracking-tight">Interactive Flow Diagram</h2>
            </div>
            
            {/* Visually stunning timeline */}
            <div className="relative border-l-2 border-indigo-500/20 ml-6 pl-10 space-y-12 pb-10">
              {flowNodes.map((node, i) => (
                <motion.div 
                  key={node.title} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="relative group"
                >
                  {/* Glowing Node Dot */}
                  <div className="absolute -left-[49px] top-6 w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,1)] group-hover:scale-150 group-hover:bg-purple-400 transition-all duration-300" />
                  
                  {/* Content Card */}
                  <div className="bg-white/[0.02] border border-white/5 group-hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-300 group-hover:bg-white/[0.04] shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-indigo-500/5 group-hover:to-indigo-500/10 transition-colors pointer-events-none" />
                    <h3 className="font-bold text-white text-xl tracking-tight mb-3 flex items-center justify-between relative z-10">
                      {node.title}
                    </h3>
                    <div className="text-slate-400 text-sm leading-relaxed font-medium relative z-10 space-y-1">
                      {node.subtitle.split('\n').map((line, idx) => (
                        <p key={idx}>{line}</p>
                      ))}
                    </div>
                  </div>
                  
                  {/* Down arrow marker for connectivity except last */}
                  {i !== flowNodes.length - 1 && (
                    <div className="absolute -left-[45px] top-20 text-indigo-500/40 group-hover:text-indigo-400 transition-colors">
                       <ArrowDown className="w-4 h-4" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </Card>
          
          <div className="grid gap-8 lg:sticky lg:top-32 h-fit">
            <Card className="overflow-hidden p-0 border border-white/10 group">
               <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent z-10 pointer-events-none opacity-60" />
              <img src={visuals.message} alt="Flow overview" className="h-[350px] w-full object-cover transition-transform duration-1000 group-hover:scale-110" loading="lazy" />
            </Card>
            <Card className="p-8 border border-white/10 bg-white/[0.02] hover:border-indigo-500/30 transition-colors duration-500">
              <h3 className="text-2xl font-display font-bold text-white tracking-tight mb-6">Key Highlights</h3>
              <ul className="space-y-4 text-base font-medium text-slate-300">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-4">
                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <section className="relative py-32 bg-[#0f172a]/40 bg-gradient-to-b from-transparent to-[#030712]">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="overflow-hidden p-0 border border-white/10 group h-full">
            <img src={visuals.secure} alt="Secure community workflow" className="h-full min-h-[400px] w-full object-cover transition-transform duration-1000 group-hover:scale-105" loading="lazy" />
          </Card>
          <Card className="p-10 border border-white/10 bg-gradient-to-br from-indigo-500/10 to-transparent h-full flex flex-col justify-center">
            <h3 className="font-display text-4xl font-bold text-white tracking-tight">The Journey in Five Steps</h3>
            <ol className="mt-10 space-y-6 text-base font-medium text-slate-300">
              {steps.map((item, index) => (
                <motion.li 
                  key={item} 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-6 p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all duration-300"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 text-lg font-bold border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    {index + 1}
                  </span>
                  <span className="text-lg leading-relaxed">{item}</span>
                </motion.li>
              ))}
            </ol>
          </Card>
        </div>
      </section>
    </motion.div>
  );
}

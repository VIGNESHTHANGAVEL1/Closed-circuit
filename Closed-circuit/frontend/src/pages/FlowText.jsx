import { motion } from 'framer-motion';
import { CheckCircle, ShieldCheck } from 'lucide-react';
import Hero from '../components/Hero';
import Card from '../components/Card';
import shieldVisual from '../assets/cc-shield.svg';
import { visuals } from '../data/visuals';

export default function FlowText() {
  const steps = [
    {
      title: 'Share Your Digital Community Address',
      description:
        'Every community receives a unique digital homepage. Share this link with family members, friends, or community members so they can request access.',
    },
    {
      title: 'Simple OTP-Based Signup',
      description:
        'New users sign up using a mobile number and OTP verification. No passwords, email IDs, or complex forms.',
    },
    {
      title: 'Admin Approval for Membership',
      description:
        'After signup, the administrator reviews and approves the request to keep the community trusted.',
    },
    {
      title: 'Secure OTP-Based Login',
      description:
        'Members log in using their mobile number and a one-time password, ensuring secure access.',
    },
    {
      title: 'Create Group Types',
      description:
        "Organize the community with Group Types such as Wife's Family, Husband's Family, School Friends, or Work Friends.",
    },
    {
      title: 'Create Multiple Groups',
      description:
        'Under each Group Type, create any number of groups like 2008 Batch, Cricket Team, or Hostel Friends.',
    },
    {
      title: 'Assign Members to Groups',
      description:
        'Members can be assigned to one or multiple groups based on relationship or association.',
    },
    {
      title: 'Share Posts with Selected Groups',
      description:
        'Administrators create posts with text, rich text, images, or videos and share them only with selected groups. Members receive SMS notifications when new posts are published.',
    },
    {
      title: 'Create Private Events',
      description:
        'Administrators can create events such as family celebrations, reunions, or gatherings and assign them to specific groups.',
    },
    {
      title: 'Create Event-Based Albums',
      description:
        'Albums can be created within a group or event to store photos and videos. They can be assigned to groups and updated later.',
    },
    {
      title: 'Upload Photos and Videos',
      description:
        'Administrators can upload any number of images and videos to preserve memories and community media.',
    },
    {
      title: 'Member Post Submission with Admin Approval',
      description:
        'Members can submit posts, but they remain invisible until an administrator approves and assigns them to the right groups.',
    },
    {
      title: 'Community Engagement',
      description:
        'Members interact by liking posts, commenting on posts, liking albums, and commenting on events.',
    },
    {
      title: 'Transparent Activity',
      description:
        'Members can view who liked and commented on posts, albums, and events for complete transparency.',
    },
    {
      title: 'No External Sharing',
      description:
        'Content shared within the platform cannot be shared outside, and external social media content cannot be imported.',
    },
    {
      title: 'Custom App Logo',
      description: 'Administrators can update the platform logo anytime from the admin dashboard.',
    },
    {
      title: 'Custom Homepage Hero Image',
      description: 'The homepage hero image can be updated anytime through the admin dashboard.',
    },
    {
      title: 'Custom Signup Page Image',
      description: 'The signup page visuals can be personalized by the administrator.',
    },
    {
      title: 'Custom Login Page Image',
      description: 'Login page visuals can be updated to match the community identity.',
    },
    {
      title: 'Member Control',
      description:
        'Administrators maintain full control and can block any member to ensure community safety.',
    },
    {
      title: 'Dedicated Private Infrastructure',
      description:
        'Each deployment runs on its own dedicated VPS server, keeping data isolated, private, and fully controlled.',
    },
  ];

  const resultPoints = [
    'Communicate securely',
    'Share memories safely',
    'Organize events efficiently',
    'Maintain trusted relationships',
    'All within a closed-circuit digital network built exclusively for approved members.',
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#030712] text-slate-300">
      <Hero
        eyebrow="App Flow"
        title="Flow in Detail"
        subtitle="A step-by-step interactive journey through the Closed Circuit system and how members seamlessly interact."
      />

      <section className="relative py-32 border-b border-white/5 bg-[#030712] overflow-hidden">
        <div className="absolute top-1/4 left-0 w-[800px] h-[800px] bg-indigo-500/5 blur-[200px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-purple-500/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          
          <div className="mb-20 text-center max-w-3xl mx-auto">
             <h2 className="font-display text-4xl font-bold text-white tracking-tight mb-6">The Complete Experience</h2>
             <p className="text-lg text-slate-400 leading-relaxed">
               Trace the lifecycle of a community member from their very first invitation to sharing a lifetime of memories.
             </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* The central glowing line */}
            <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/0 via-indigo-500/50 to-indigo-500/0" />
            
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={step.title} className={`relative flex items-center md:justify-between mb-16 flex-col md:flex-row ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Glowing Node Dot on the timeline */}
                  <div className="absolute left-[16px] md:left-1/2 -translate-x-[50%] md:-translate-x-1/2 w-4 h-4 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,1)] z-10">
                     <div className="absolute inset-0 bg-indigo-400 rounded-full animate-ping opacity-75" />
                  </div>
                  
                  {/* Space for the opposite side */}
                  <div className="hidden md:block w-[45%]" />

                  {/* Content Card */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="w-full pl-16 md:pl-0 md:w-[45%] relative group"
                  >
                    <Card className="p-8 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all hover:border-indigo-500/30 overflow-hidden shadow-xl">
                      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-start gap-5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-purple-400 border border-indigo-500/20 shadow-inner">
                          {idx + 1}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white tracking-tight leading-snug">{step.title}</h3>
                          <p className="mt-3 text-sm text-slate-400 font-medium leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      <section className="relative py-32 bg-[#0f172a]/40">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <Card className="p-10 border border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400 border border-indigo-500/30">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="font-display text-3xl font-bold text-white tracking-tight">
                Result: A Secure Digital Community
              </h2>
            </div>
            <p className="mt-4 text-lg text-slate-400 leading-relaxed">
              The platform provides a fully private and controlled environment where communities can build trust,
              preserve memories, and remain connected.
            </p>
            <ul className="mt-8 space-y-4 text-base font-medium text-slate-300">
              {resultPoints.map((item) => (
                <li key={item} className="flex items-start gap-4">
                  <CheckCircle className="mt-0.5 h-6 w-6 shrink-0 text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
          <div className="grid gap-8">
            <Card className="p-8 border border-white/10 bg-white/[0.02] flex items-center justify-center">
              <img src={shieldVisual} alt="Dedicated private infrastructure" className="w-48 h-auto opacity-80 drop-shadow-[0_0_30px_rgba(99,102,241,0.5)]" />
            </Card>
            <Card className="p-8 border border-white/10 bg-gradient-to-br from-indigo-500/10 to-transparent">
              <h3 className="text-xl font-bold text-white tracking-tight">In Simple Terms</h3>
              <p className="mt-4 text-base text-slate-400 leading-relaxed">
                Your community runs in its own protected digital space - with isolated infrastructure, private media
                storage, and complete control over who can access and share.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="relative py-32 border-b border-white/5 bg-[#030712]">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="overflow-hidden p-0 border border-white/10 group h-full">
            <img src={visuals.familyHero} alt="Family members sharing memories" className="h-full min-h-[400px] w-full object-cover transition-transform duration-1000 group-hover:scale-105" loading="lazy" />
          </Card>
          <Card className="p-10 border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent h-full flex flex-col justify-center">
            <h3 className="font-display text-4xl font-bold text-white tracking-tight">Every Step Supports Trust</h3>
            <p className="mt-6 text-lg text-slate-400 leading-relaxed">
              From signup to sharing, the flow ensures members see only what they should - preserving privacy and
              peace of mind.
            </p>
          </Card>
        </div>
      </section>

      <section className="relative py-32 bg-[#0f172a]/40">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 lg:grid-cols-3">
            <Card className="overflow-hidden p-0 border border-white/10 group">
              <img src={visuals.community} alt="Community collaboration" className="h-64 w-full object-cover transition-transform duration-1000 group-hover:scale-110" loading="lazy" />
            </Card>
            <Card className="overflow-hidden p-0 border border-white/10 group">
              <img src={visuals.celebration} alt="Family celebrations" className="h-64 w-full object-cover transition-transform duration-1000 group-hover:scale-110" loading="lazy" />
            </Card>
            <Card className="overflow-hidden p-0 border border-white/10 group">
              <img src={visuals.secure} alt="Secure platform" className="h-64 w-full object-cover transition-transform duration-1000 group-hover:scale-110" loading="lazy" />
            </Card>
          </div>
          <Card className="mt-12 p-10 border border-white/10 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-center">
            <h3 className="font-display text-3xl font-bold text-white tracking-tight">A Visual Memory Timeline</h3>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              The Closed Circuit flow keeps every update, event, and memory visually organized - so nothing gets lost.
            </p>
          </Card>
        </div>
      </section>
    </motion.div>
  );
}

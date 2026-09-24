import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Headphones,
  Home,
  PlayCircle,
  Target,
  Users,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import Card from '../Card';
import VideoPopupModal from '../VideoPopupModal';
import CareerApplicationForm from '../CareerApplicationForm';
import {
  getFlowVoiceVideoUrl,
  getFlowVoiceMobileVideoUrl,
  getCareerVideoUrl,
  getCareerVideoMobileUrl,
} from '../../lib/spaces';

const bodyText = 'text-base sm:text-lg md:text-xl text-slate-400 font-normal leading-snug sm:leading-normal';

const roleTasks = [
  'Telecalling prospective customers',
  'Explaining Closed Circuit',
  'Understanding customer requirements',
  'Answering basic product-related questions',
  'Following up with interested customers',
  'Converting prospects into customers',
  'Achieving daily performance targets',
  'Providing regular updates on calls and results',
];

const expectations = [
  'Good communication skills in any language',
  'A laptop',
  'A mobile phone',
  'A separate SIM card for work',
  'A proper workstation at home',
  'Reliable internet connectivity',
  'A positive attitude',
  'Willingness to learn',
  'Responsibility and ownership',
  'Commitment towards daily targets',
  'Ability to work independently and follow instructions',
  'Follow-up skills and consistency in completing assigned tasks',
];

function VideoLinkButton({ children, onClick, variant = 'primary' }) {
  const styles =
    variant === 'career'
      ? 'text-purple-300 hover:text-purple-200 border-purple-500/30 bg-purple-500/10'
      : 'text-indigo-300 hover:text-indigo-200 border-indigo-500/30 bg-indigo-500/10';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm sm:text-base font-semibold transition hover:bg-white/10 ${styles}`}
    >
      <PlayCircle size={18} />
      {children}
    </button>
  );
}

function WfhBadge({ className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-300 ${className}`}
    >
      <Home size={16} className="shrink-0" /> Work From Home
    </span>
  );
}

export default function SalesCareerSection() {
  const [productVideoOpen, setProductVideoOpen] = useState(false);
  const [careerVideoOpen, setCareerVideoOpen] = useState(false);

  return (
    <>
      <div className="page-container space-y-5">
        <Card className="p-5 sm:p-6 md:p-8 border border-white/10 bg-gradient-to-br from-indigo-500/10 to-transparent">
          <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white">Join Closed Circuit</h2>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-stretch md:justify-between">
            <div className={`space-y-2.5 text-left flex-1 ${bodyText}`}>
              <p>Currently, we have an opening only for the Inside Sales Executive position.</p>
              <p>Closed Circuit is looking for motivated and responsible people to join our Inside Sales Team.</p>
              <p>This is a Work From Home opportunity, and candidates from any location can apply.</p>
            </div>
            <div className="flex flex-row md:flex-col justify-center md:justify-between gap-3 md:gap-4 md:min-w-[14rem] shrink-0">
  <WfhBadge className="justify-center h-20 px-10 text-2xl" />
</div>
          </div>
        </Card>

        <Card className="p-5 sm:p-6 md:p-8 border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
          <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white">Before You Apply — Please Read This</h2>
          <div className={`mt-4 space-y-4 ${bodyText}`}>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">1. First, understand Closed Circuit</h3>
              <p>
                Please go through the features and working of Closed Circuit before applying. It is important that you
                understand what Closed Circuit is, how it works, and what makes it different from other communication
                platforms.
              </p>
              <p className="mt-3">
                You can find a short video about Closed Circuit here:{' '}
                <VideoLinkButton onClick={() => setProductVideoOpen(true)}>Watch here</VideoLinkButton>
              </p>
              <p className="mt-3">
                Please watch this video carefully before applying. If you understand Closed Circuit and are genuinely
                interested in explaining and selling the product to customers, then only please apply.
              </p>
            </div>

            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 sm:p-5">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">2. Understand this Career Opportunity</h3>
              <p>
                To know more about this opportunity, please watch the career information video. In this video, we have
                clearly explained what we are looking for, what we expect from you, the nature of the work, the working
                hours, the responsibilities, and the requirements for this position.
              </p>
              <p className="mt-3 flex flex-wrap items-center gap-2">
                <span>
                  Please watch the career video completely and understand the opportunity before submitting the application.
                </span>
                <VideoLinkButton variant="career" onClick={() => setCareerVideoOpen(true)}>
                  Click here to watch
                </VideoLinkButton>
              </p>
              <p className="mt-3">
                If you are comfortable with the role, responsibilities, working conditions and expectations explained in
                the video, then please apply.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid gap-5 lg:grid-cols-2 lg:items-stretch">
          <Card className="p-5 sm:p-6 border border-white/10 bg-white/[0.02] flex flex-col h-full">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white">Position</h2>
            <p className="mt-2 text-indigo-300 font-semibold text-base sm:text-lg">Inside Sales Executive — Work From Home</p>
            <div className={`mt-4 space-y-2 ${bodyText}`}>
              <p className="flex items-center gap-2">
                <Clock size={16} className="text-indigo-400 shrink-0" /> Work Schedule: Monday to Saturday
              </p>
              <p className="flex items-center gap-2">
                <Clock size={16} className="text-indigo-400 shrink-0" /> Working Hours: 10:00 AM to 7:00 PM
              </p>
            </div>
            <h3 className="mt-5 font-semibold text-white text-base sm:text-lg">The role primarily involves:</h3>
            <ul className={`mt-3 space-y-2 flex-1 ${bodyText}`}>
              {roleTasks.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="mt-1 shrink-0 text-indigo-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5 sm:p-6 border border-white/10 bg-white/[0.02] flex flex-col h-full">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Target size={22} className="text-purple-400" /> What We Expect
            </h2>
            <ul className={`mt-4 space-y-2 flex-1 ${bodyText}`}>
              {expectations.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Users size={16} className="mt-1 shrink-0 text-purple-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card className="p-5 sm:p-6 border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent">
          <div className="flex items-start gap-3">
            <AlertCircle className="shrink-0 text-amber-400" size={22} />
            <div className={bodyText}>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white mb-2">Important Note for Applicants</h2>
              <p>Please do not call Closed Circuit regarding your application.</p>
              <p className="mt-2">
                After receiving your application, our team will review the details and resume. If your profile is
                shortlisted, we will contact you. We may receive a large number of applications, and therefore it may
                take some time for our team to get back to you.
              </p>
              <p className="mt-2">Please do not call us to check the status of your application.</p>
              <p className="mt-2">Thank you for your interest in joining Closed Circuit.</p>
            </div>
          </div>
        </Card>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <CareerApplicationForm submitPath="/api/careers/sales" />
        </motion.div>
      </div>

      <VideoPopupModal
        isOpen={productVideoOpen}
        onClose={() => setProductVideoOpen(false)}
        title="Closed Circuit Product Video"
        desktopUrl={getFlowVoiceVideoUrl()}
        mobileUrl={getFlowVoiceMobileVideoUrl()}
      />

      <VideoPopupModal
        isOpen={careerVideoOpen}
        onClose={() => setCareerVideoOpen(false)}
        title="Career Opportunity Video"
        desktopUrl={getCareerVideoUrl()}
        mobileUrl={getCareerVideoMobileUrl()}
      />
    </>
  );
}

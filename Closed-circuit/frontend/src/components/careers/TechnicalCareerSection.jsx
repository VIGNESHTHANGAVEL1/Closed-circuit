import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Code2, Layers, Server } from 'lucide-react';
import Card from '../Card';
import TechnicalCareerApplicationForm from '../TechnicalCareerApplicationForm';

const bodyText = 'text-base sm:text-lg md:text-xl text-slate-400 font-normal leading-snug sm:leading-normal';

const TECH_SKILLS = [
  'HTML',
  'CSS',
  'Bootstrap',
  'JavaScript',
  'TypeScript',
  'Node.js',
  'Express.js',
  'React.js',
  'MySQL',
  'SMS API Integration',
  'WhatsApp API Integration',
  'Email / Mail API Integration',
  'Payment Gateway Integration',
  'Basic Cloud Knowledge',
  'Basic Linux Commands',
  'REST API Design & Integration',
  'Version Control (Git)',
];

const LOOKING_FOR_POINTS = [
  'Practical development experience across frontend, backend, and database layers',
  'Comfort integrating third-party APIs (SMS, WhatsApp, email, payments)',
  'Hands-on experience building and maintaining React and Node.js applications',
  'Basic familiarity with cloud hosting and Linux-based deployment tasks',
  'Confidence working independently and delivering assigned modules on schedule',
  'Willingness to learn, take ownership, and contribute to production projects',
];

export default function TechnicalCareerSection() {
  const skillColumns = [
    TECH_SKILLS.slice(0, Math.ceil(TECH_SKILLS.length / 2)),
    TECH_SKILLS.slice(Math.ceil(TECH_SKILLS.length / 2)),
  ];

  return (
    <div className="page-container space-y-5">
      <Card className="p-5 sm:p-6 md:p-8 border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-transparent">
        <div className="flex items-start gap-3">
          <Code2 className="shrink-0 text-cyan-400" size={28} />
          <div>
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white">MERN Stack Developer</h2>
            <p className={`mt-3 ${bodyText}`}>
              We are looking for MERN Stack Developers who are well-versed in the following technologies and
              integrations. Please apply only if you have knowledge of all the listed skills and are confident working
              with them in real projects.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2 lg:items-stretch">
        <Card className="p-5 sm:p-6 border border-white/10 bg-white/[0.02] flex flex-col h-full">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Layers size={22} className="text-indigo-400" /> Required Technical Skills
          </h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-2 sm:gap-x-3 gap-y-1 flex-1 max-w-full">
            {skillColumns.map((column, colIndex) => (
              <ul key={colIndex} className={`space-y-1.5 ${bodyText}`}>
                {column.map((skill) => (
                  <li key={skill} className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="mt-1 shrink-0 text-indigo-400" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </Card>

        <Card className="p-5 sm:p-6 border border-white/10 bg-white/[0.02] flex flex-col h-full">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Server size={22} className="text-purple-400" /> What We Are Looking For
          </h2>
          <ul className={`mt-4 space-y-2 flex-1 ${bodyText}`}>
            {LOOKING_FOR_POINTS.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2 size={16} className="mt-1 shrink-0 text-purple-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-5 sm:p-6 border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
        <div className="flex items-start gap-3">
          <AlertCircle className="shrink-0 text-amber-400" size={22} />
          <div className={bodyText}>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white mb-2">Important</h2>
            <p>Only candidates who have all the above-mentioned skills should fill out this form.</p>
            <p className="mt-2">
              We are looking for strong, responsible, and hands-on developers who are willing to learn, take ownership,
              and contribute to real-world projects.
            </p>
          </div>
        </div>
      </Card>

      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <TechnicalCareerApplicationForm submitPath="/api/careers/technical" />
      </motion.div>
    </div>
  );
}

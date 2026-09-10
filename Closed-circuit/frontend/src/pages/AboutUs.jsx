import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import Card from '../components/Card';

const principles = [
  'Privacy First — Your personal information and communications should remain private.',
  'Security Second — Strong security measures should protect your digital interactions.',
  'User-Controlled Third — You should have greater control over your digital space, content, and connections.',
  'End-to-End Encryption Fourth — Communications should be protected through encryption, so only the intended participants can access the original content.',
  'Domain-Centric Fifth — Your digital identity should be built around your own domain, creating a more personal and private digital space.',
];

function Section({ title, children, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
    >
      <Card className="p-5 sm:p-6 md:p-8 border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01]">
        <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
          {title}
        </h2>
        <div className="mt-4 space-y-4 text-base sm:text-lg md:text-xl lg:text-2xl text-slate-400 font-normal leading-relaxed">
          {children}
        </div>
      </Card>
    </motion.div>
  );
}

export default function AboutUs() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#030712] text-slate-300"
    >
      <Hero title="About Us" contentClassName="page-container py-4 md:py-6 text-center" compact />

      <section className="relative py-8 md:py-12 border-b border-white/5 bg-[#030712] overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none" />
        <div className="relative z-10 w-full px-3 sm:px-4 lg:px-5">
          <div className="w-full space-y-6 md:space-y-8">
            <Section title="Founded by Ramesh" index={0}>
              <p>
                Closed Circuit AI Pvt. Ltd. was founded by Ramesh, a technology professional and entrepreneur with 28+
                years of IT experience across leading organizations including IBM, JF Welch, and Wipro.
              </p>
              <p>
                He has worked extensively as a Product Manager and Product Owner, gaining experience in taking
                technology products from an initial idea through design, architecture, development, strategy, and final
                delivery.
              </p>
              <p>
                Alongside his corporate IT experience, Ramesh successfully founded and ran Lara Technologies, a training
                and placement venture, for almost 20 years. This long-standing entrepreneurial experience gave him
                extensive exposure to technology training, talent development, business operations, and the evolving
                needs of the IT industry.
              </p>
              <p>
                His experience spans technology development, product management, training, placements, and
                entrepreneurship. This combination of technical and business experience has given him a practical
                understanding of how to transform an idea into a well-designed, scalable, secure, and practical
                technology product.
              </p>
            </Section>

            <Section title="Why We Built Closed Circuit" index={1}>
              <p>
                With his 28+ years of experience, Ramesh started this new venture with a clear vision: to build a digital
                platform that puts privacy first.
              </p>
              <p>Closed Circuit has been developed with a strong focus on the following principles:</p>
              <ol className="list-decimal list-inside space-y-2 pl-1">
                {principles.map((principle) => (
                  <li key={principle}>{principle}</li>
                ))}
              </ol>
              <p>
                These principles are not just features of our platform. They are the foundation on which Closed Circuit
                has been developed.
              </p>
              <p>
                Our vision is to create technology that is not just another social platform, but a secure, private, and
                user-controlled digital space for individuals, families, communities, and organizations.
              </p>
            </Section>

            <Section title="Our Company" index={2}>
              <p>Closed Circuit AI Private Limited was incorporated on 12 September 2022.</p>
              <p>CIN: U72900KA2022PTC165991</p>
              <p>
                The company was established with a clear objective: to develop practical technology that gives people
                greater control over their digital interactions and personal information.
              </p>
              <p>
                Closed Circuit is built around the belief that digital communication should be private, secure, and
                controlled by the people who use it.
              </p>
            </Section>

            <Section title="Focused Development. Experienced Team." index={3}>
              <p>
                We have developed Closed Circuit with a clear and focused objective: to create a secure, practical, and
                user-friendly digital communication platform.
              </p>
              <p>
                Our team brings experience across product development, software engineering, system administration,
                testing, and technology implementation. Every stage of development has been approached with careful
                planning, implementation, and verification.
              </p>
              <p>
                Our development process focuses on understanding user needs, designing practical solutions, implementing
                them carefully, and testing them thoroughly.
              </p>
              <p>
                We have tested the platform using more than 1,000 test cases. Our testing team has carefully executed and
                verified each test case to ensure that the implemented features work as intended and that the platform
                delivers a reliable user experience.
              </p>
              <p>Our approach is simple: develop with focus, test with care, and deliver with confidence.</p>
            </Section>

            <Section title="Your Privacy. Your Data. Your Control." index={4}>
              <p>
                Your data is protected through encryption. Our objective is to ensure that your personal information and
                communications remain accessible only to you and the people you choose to share them with.
              </p>
              <p>
                Even when our developers or system administrators access the database or cloud infrastructure for
                maintenance or troubleshooting, they cannot view your original data in readable form where encryption is
                applied. They can see only the encrypted representation of the data.
              </p>
              <p>
                We believe that privacy should not depend only on trust. It should be supported by careful development,
                encryption, testing, and responsible system implementation.
              </p>
            </Section>

            <Section title="Try Before You Subscribe" index={5}>
              <p>
                We are confident in our development and implementation, which is why we offer a 1-week free trial and a
                30-day money-back guarantee.
              </p>
              <p>You do not need to pay anything before starting your trial.</p>
              <p>
                We will invest in setting up your private digital space, including approximately ₹650 worth of domain
                registration and setup costs, so that you can experience the platform before making a subscription
                decision.
              </p>
              <p>After your 1-week free trial, you can decide whether to subscribe for one year.</p>
              <p>
                Only if you are fully satisfied with the platform and its implementation, you can proceed with the
                annual subscription.
              </p>
              <p>
                Our goal is simple: Give you the opportunity to experience Closed Circuit first, understand its value,
                and then make your decision with confidence.
              </p>
            </Section>

            <Section title="Office Address" index={6}>
              <p>Closed Circuit AI Private Limited</p>
              <p>3rd Floor, Under Collab Cubicles Section</p>
              <p>Brigade IRV Center</p>
              <p>Nallurhalli, Whitefield</p>
              <p>Bengaluru – 560066</p>
              <p>Karnataka, India</p>
              <p>Email: cc@closedcircuit.in</p>
              <p>Mobile: +91 82175 43446</p>
              <p>
                Google Maps:{' '}
                <a
                  href="https://maps.app.goo.gl/cZ67tsC2ryFeegSg6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 break-all"
                >
                  https://maps.app.goo.gl/cZ67tsC2ryFeegSg6
                </a>
              </p>
            </Section>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

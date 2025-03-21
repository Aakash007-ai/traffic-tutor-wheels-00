import { motion } from 'framer-motion';
import {
  HelpCircle,
  Gamepad,
  Award,
  GraduationCap,
  Users,
  Smartphone
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  borderColor: string;
  bgColor: string;
  delay: number;
}

const FeatureCard = ({
  icon,
  title,
  description,
  borderColor,
  bgColor,
  delay
}: FeatureCardProps) => (
  <motion.div
    className={`bg-white rounded-xl p-6 shadow-lg border-t-4 ${borderColor} hover:shadow-xl transition-all`}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <div
      className={`w-14 h-14 ${bgColor} rounded-full flex items-center justify-center mb-4`}
    >
      {icon}
    </div>
    <h3 className='font-bold text-xl mb-2 text-gray-700'>{title}</h3>
    <p className='text-gray-600'>{description}</p>
  </motion.div>
);

const FeatureSection = () => {
  const features = [
    {
      icon: <HelpCircle className='text-[#ef4444] text-2xl' />,
      title: 'Interactive Quizzes',
      description:
        'Engaging multiple-choice questions about road signs, signals, and safety rules for users of all ages.',
      borderColor: 'border-[#ef4444]',
      bgColor: 'bg-red-100',
      delay: 0
    },
    {
      icon: <Gamepad className='text-[#eab308] text-2xl' />,
      title: 'Realistic Scenarios',
      description:
        'Navigate through virtual traffic situations while learning to identify and properly respond to common road signs.',
      borderColor: 'border-[#eab308]',
      bgColor: 'bg-yellow-100',
      delay: 0.1
    },
    {
      icon: <Award className='text-[#22c55e] text-2xl' />,
      title: 'Achievement System',
      description:
        'Track your progress with badges and points for correct responses, encouraging continued improvement and learning.',
      borderColor: 'border-[#22c55e]',
      bgColor: 'bg-green-100',
      delay: 0.2
    },
    {
      icon: <GraduationCap className='text-[#22c55e] text-2xl' />,
      title: 'Comprehensive Learning',
      description:
        'Content developed with traffic safety experts covering everything from basic signs to complex road scenarios.',
      borderColor: 'border-[#22c55e]',
      bgColor: 'bg-green-100',
      delay: 0.3
    },
    {
      icon: <Users className='text-[#eab308] text-2xl' />,
      title: 'Community Features',
      description:
        'Learn alongside friends, family or colleagues to make road safety education a social and collaborative experience.',
      borderColor: 'border-[#eab308]',
      bgColor: 'bg-yellow-100',
      delay: 0.4
    },
    {
      icon: <Smartphone className='text-[#ef4444] text-2xl' />,
      title: 'Multi-Device Access',
      description:
        'Available on computers, tablets, and phones - perfect for learning at home, at work, or on the go.',
      borderColor: 'border-[#ef4444]',
      bgColor: 'bg-red-100',
      delay: 0.5
    }
  ];

  return (
    <section
      id='features'
      className='py-16 bg-gradient-to-b from-[#0f172a] to-[#1e293b]'
    >
      <div className='container mx-auto px-4'>
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className='font-fredoka text-3xl md:text-5xl mb-4 text-white'>
            Key Features
          </h2>
          <p className='text-gray-300 max-w-2xl mx-auto text-xl'>
            Our interactive platform makes learning road safety engaging and
            effective for everyone, from new drivers to experienced road users.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              borderColor={feature.borderColor}
              bgColor={feature.bgColor}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;

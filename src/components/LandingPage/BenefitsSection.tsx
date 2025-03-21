import { motion } from 'framer-motion';
import { Shield, Brain, Book, SmilePlus, Users, Medal } from 'lucide-react';

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  borderColor: string;
  delay: number;
}

const BenefitCard = ({
  icon,
  title,
  description,
  borderColor,
  delay
}: BenefitCardProps) => (
  <motion.div
    className={`bg-white p-5 rounded-lg shadow border-l-4 ${borderColor}`}
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <h3 className='font-bold text-lg mb-2 flex items-center'>
      {icon}
      {title}
    </h3>
    <p className='text-gray-600'>{description}</p>
  </motion.div>
);

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <Shield className='text-[#22c55e] mr-2 h-6 w-6' />,
      title: 'Enhanced Safety',
      description:
        'Children learn to identify potential dangers on the road and how to avoid them.',
      borderColor: 'border-[#22c55e]',
      delay: 0
    },
    {
      icon: <Brain className='text-[#eab308] mr-2 h-6 w-6' />,
      title: 'Improved Decision Making',
      description:
        'Develops quick thinking and good judgment in traffic situations.',
      borderColor: 'border-[#eab308]',
      delay: 0.1
    },
    {
      icon: <Book className='text-[#ef4444] mr-2 h-6 w-6' />,
      title: 'Knowledge Retention',
      description:
        'Game-based learning increases information retention compared to traditional methods.',
      borderColor: 'border-[#ef4444]',
      delay: 0.2
    },
    {
      icon: <SmilePlus className='text-[#22c55e] mr-2 h-6 w-6' />,
      title: 'Enjoyable Learning',
      description:
        'Makes an important subject fun and engaging rather than boring and forgettable.',
      borderColor: 'border-[#22c55e]',
      delay: 0.3
    },
    {
      icon: <Users className='text-[#eab308] mr-2 h-6 w-6' />,
      title: 'Family Engagement',
      description:
        'Creates opportunities for parents to discuss road safety with their children.',
      borderColor: 'border-[#eab308]',
      delay: 0.4
    },
    {
      icon: <Medal className='text-[#ef4444] mr-2 h-6 w-6' />,
      title: 'Lifelong Habits',
      description:
        'Early education leads to better traffic behavior throughout life.',
      borderColor: 'border-[#ef4444]',
      delay: 0.5
    }
  ];

  return (
    <section id='benefits' className='py-16 bg-[#0f172a]'>
      <div className='container mx-auto px-4'>
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className='font-fredoka text-3xl md:text-5xl mb-4'>
            Benefits of Learning Road Safety
          </h2>
          <p className='text-gray-300 max-w-2xl mx-auto text-xl'>
            Our game doesn't just entertain - it helps build essential life
            skills.
          </p>
        </motion.div>

        <div className='flex flex-col lg:flex-row items-center'>
          <motion.div
            className='lg:w-1/2 mb-10 lg:mb-0'
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <svg
              className='rounded-xl shadow-xl max-w-full mx-auto'
              width='500'
              height='300'
              viewBox='0 0 500 300'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <rect width='500' height='300' fill='#f8fafc' rx='8' ry='8' />

              {/* Sky */}
              <rect width='500' height='150' fill='#bae6fd' rx='8' ry='8' />

              {/* Ground */}
              <rect y='150' width='500' height='150' fill='#84cc16' />

              {/* Road */}
              <rect y='200' width='500' height='60' fill='#4b5563' />
              <rect x='20' y='228' width='40' height='5' fill='#fff' />
              <rect x='90' y='228' width='40' height='5' fill='#fff' />
              <rect x='160' y='228' width='40' height='5' fill='#fff' />
              <rect x='230' y='228' width='40' height='5' fill='#fff' />
              <rect x='300' y='228' width='40' height='5' fill='#fff' />
              <rect x='370' y='228' width='40' height='5' fill='#fff' />
              <rect x='440' y='228' width='40' height='5' fill='#fff' />

              {/* Crossing */}
              <rect x='200' y='150' width='100' height='50' fill='#e5e7eb' />
              <rect x='210' y='160' width='10' height='30' fill='#4b5563' />
              <rect x='230' y='160' width='10' height='30' fill='#4b5563' />
              <rect x='250' y='160' width='10' height='30' fill='#4b5563' />
              <rect x='270' y='160' width='10' height='30' fill='#4b5563' />

              {/* Traffic light */}
              <rect
                x='170'
                y='90'
                width='20'
                height='60'
                fill='#1e293b'
                rx='3'
                ry='3'
              />
              <rect
                x='165'
                y='90'
                width='30'
                height='10'
                fill='#1e293b'
                rx='3'
                ry='3'
              />
              <circle cx='180' cy='110' r='6' fill='#ef4444' />
              <circle cx='180' cy='125' r='6' fill='#fde047' />
              <circle cx='180' cy='140' r='6' fill='#22c55e' />

              {/* Children */}
              {/* Child 1 */}
              <circle cx='130' cy='170' r='15' fill='#fdba74' />
              <rect x='125' y='185' width='10' height='20' fill='#f97316' />
              <line
                x1='130'
                y1='195'
                x2='120'
                y2='210'
                stroke='#fdba74'
                strokeWidth='3'
              />
              <line
                x1='130'
                y1='195'
                x2='140'
                y2='210'
                stroke='#fdba74'
                strokeWidth='3'
              />
              <line
                x1='127'
                y1='205'
                x2='125'
                y2='220'
                stroke='#f97316'
                strokeWidth='3'
              />
              <line
                x1='133'
                y1='205'
                x2='135'
                y2='220'
                stroke='#f97316'
                strokeWidth='3'
              />
              <circle cx='130' cy='160' r='3' fill='#1e293b' />
              <path
                d='M122 167 Q130 173 138 167'
                stroke='#1e293b'
                strokeWidth='1.5'
                fill='none'
              />

              {/* Child 2 */}
              <circle cx='220' cy='130' r='15' fill='#a3e635' />
              <rect x='215' y='145' width='10' height='20' fill='#16a34a' />
              <line
                x1='220'
                y1='155'
                x2='210'
                y2='170'
                stroke='#a3e635'
                strokeWidth='3'
              />
              <line
                x1='220'
                y1='155'
                x2='230'
                y2='170'
                stroke='#a3e635'
                strokeWidth='3'
              />
              <line
                x1='217'
                y1='165'
                x2='215'
                y2='180'
                stroke='#16a34a'
                strokeWidth='3'
              />
              <line
                x1='223'
                y1='165'
                x2='225'
                y2='180'
                stroke='#16a34a'
                strokeWidth='3'
              />
              <circle cx='220' cy='120' r='3' fill='#1e293b' />
              <path
                d='M212 127 Q220 133 228 127'
                stroke='#1e293b'
                strokeWidth='1.5'
                fill='none'
              />

              {/* Child 3 */}
              <circle cx='270' cy='130' r='15' fill='#fdba74' />
              <rect x='265' y='145' width='10' height='20' fill='#0ea5e9' />
              <line
                x1='270'
                y1='155'
                x2='260'
                y2='170'
                stroke='#fdba74'
                strokeWidth='3'
              />
              <line
                x1='270'
                y1='155'
                x2='280'
                y2='170'
                stroke='#fdba74'
                strokeWidth='3'
              />
              <line
                x1='267'
                y1='165'
                x2='265'
                y2='180'
                stroke='#0ea5e9'
                strokeWidth='3'
              />
              <line
                x1='273'
                y1='165'
                x2='275'
                y2='180'
                stroke='#0ea5e9'
                strokeWidth='3'
              />
              <circle cx='270' cy='120' r='3' fill='#1e293b' />
              <path
                d='M262 127 Q270 133 278 127'
                stroke='#1e293b'
                strokeWidth='1.5'
                fill='none'
              />

              {/* Buildings */}
              <rect x='350' y='80' width='120' height='70' fill='#e11d48' />
              <rect x='360' y='90' width='20' height='20' fill='#f9fafb' />
              <rect x='390' y='90' width='20' height='20' fill='#f9fafb' />
              <rect x='420' y='90' width='20' height='20' fill='#f9fafb' />
              <rect x='360' y='120' width='20' height='30' fill='#f9fafb' />
              <rect x='420' y='120' width='30' height='30' fill='#f9fafb' />
              <path d='M350 80 L410 40 L470 80' fill='#f43f5e' />

              {/* School Sign */}
              <rect
                x='40'
                y='110'
                width='40'
                height='40'
                fill='#f9fafb'
                rx='5'
                ry='5'
              />
              <rect x='35' y='150' width='50' height='20' fill='#f9fafb' />
              <text
                x='60'
                y='130'
                textAnchor='middle'
                fill='#1e293b'
                fontSize='12'
                fontWeight='bold'
              >
                SCHOOL
              </text>
              <text
                x='60'
                y='145'
                textAnchor='middle'
                fill='#1e293b'
                fontSize='12'
                fontWeight='bold'
              >
                ZONE
              </text>
            </svg>
          </motion.div>

          <div className='lg:w-1/2 lg:pl-12'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {benefits.map((benefit, index) => (
                <BenefitCard
                  key={index}
                  icon={benefit.icon}
                  title={benefit.title}
                  description={benefit.description}
                  borderColor={benefit.borderColor}
                  delay={benefit.delay}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;

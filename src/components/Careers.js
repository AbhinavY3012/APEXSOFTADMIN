import React, { useState } from 'react';

const Careers = () => {
  const [selectedJob, setSelectedJob] = useState(null);

  const jobOpenings = [
    {
      id: 1,
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      location: 'Remote / Hybrid',
      type: 'Full-time',
      experience: '5+ years',
      description: 'We are looking for an experienced Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies.',
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '5+ years of experience in full-stack development',
        'Proficiency in React, Node.js, and databases',
        'Experience with cloud platforms (AWS/Azure)',
        'Strong problem-solving skills'
      ],
      responsibilities: [
        'Develop and maintain web applications',
        'Collaborate with cross-functional teams',
        'Write clean, maintainable code',
        'Participate in code reviews',
        'Mentor junior developers'
      ]
    },
    {
      id: 2,
      title: 'UI/UX Designer',
      department: 'Design',
      location: 'On-site',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Join our creative team as a UI/UX Designer and help create intuitive and beautiful user experiences for our clients\' digital products.',
      requirements: [
        'Bachelor\'s degree in Design or related field',
        '3+ years of UI/UX design experience',
        'Proficiency in Figma, Adobe Creative Suite',
        'Strong portfolio demonstrating design skills',
        'Understanding of user-centered design principles'
      ],
      responsibilities: [
        'Create wireframes and prototypes',
        'Design user interfaces for web and mobile',
        'Conduct user research and testing',
        'Collaborate with development teams',
        'Maintain design systems'
      ]
    },
    {
      id: 3,
      title: 'DevOps Engineer',
      department: 'Infrastructure',
      location: 'Remote',
      type: 'Full-time',
      experience: '4+ years',
      description: 'We need a skilled DevOps Engineer to help streamline our development and deployment processes while ensuring system reliability and scalability.',
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '4+ years of DevOps/Infrastructure experience',
        'Experience with Docker, Kubernetes, CI/CD',
        'Knowledge of cloud platforms and automation tools',
        'Strong scripting skills (Python, Bash)'
      ],
      responsibilities: [
        'Manage cloud infrastructure',
        'Implement CI/CD pipelines',
        'Monitor system performance',
        'Ensure security best practices',
        'Automate deployment processes'
      ]
    },
    {
      id: 4,
      title: 'Mobile App Developer',
      department: 'Engineering',
      location: 'Hybrid',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Join our mobile development team to create innovative iOS and Android applications that deliver exceptional user experiences.',
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '3+ years of mobile app development experience',
        'Proficiency in React Native or Flutter',
        'Experience with native iOS/Android development',
        'Knowledge of mobile app deployment processes'
      ],
      responsibilities: [
        'Develop cross-platform mobile applications',
        'Optimize app performance',
        'Integrate with APIs and backend services',
        'Collaborate with designers and product managers',
        'Maintain and update existing applications'
      ]
    },
    {
      id: 5,
      title: 'Project Manager',
      department: 'Management',
      location: 'On-site',
      type: 'Full-time',
      experience: '5+ years',
      description: 'Lead and coordinate technology projects from inception to completion while ensuring timely delivery and client satisfaction.',
      requirements: [
        'Bachelor\'s degree in Project Management or related field',
        '5+ years of project management experience',
        'PMP or Agile certification preferred',
        'Experience with project management tools',
        'Excellent communication and leadership skills'
      ],
      responsibilities: [
        'Plan and execute project timelines',
        'Coordinate with development teams',
        'Manage client relationships',
        'Monitor project budgets and resources',
        'Ensure quality deliverables'
      ]
    }
  ];

  const benefits = [
    {
      title: 'Competitive Salary',
      description: 'Market-competitive compensation packages',
      icon: '💰'
    },
    {
      title: 'Health Insurance',
      description: 'Comprehensive health and dental coverage',
      icon: '🏥'
    },
    {
      title: 'Flexible Hours',
      description: 'Work-life balance with flexible scheduling',
      icon: '⏰'
    },
    {
      title: 'Remote Work',
      description: 'Option to work remotely or hybrid',
      icon: '🏠'
    },
    {
      title: 'Learning Budget',
      description: 'Annual budget for courses and conferences',
      icon: '📚'
    },
    {
      title: 'Team Events',
      description: 'Regular team building and social events',
      icon: '🎉'
    }
  ];

  const getTypeColor = (type) => {
    return type === 'Full-time' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200';
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Join Our Team</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Build your career with us and help shape the future of technology
        </p>
      </div>

      {/* Company Culture */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Why Work With Us?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            At Apexsoft Technology, we believe that great people create great products. We foster 
            an environment of innovation, collaboration, and continuous learning where every team 
            member can thrive and make a meaningful impact.
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Innovative and challenging projects
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Collaborative and supportive team environment
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Opportunities for professional growth
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Access to latest technologies and tools
            </li>
          </ul>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Benefits</h2>
          <div className="grid grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl mb-2">{benefit.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Job Openings */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Current Openings</h2>
        <div className="space-y-4">
          {jobOpenings.map((job) => (
            <div key={job.id} className="rounded-lg bg-white shadow-sm dark:bg-gray-800 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-sm text-primary font-medium">{job.department}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{job.location}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{job.experience}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 md:mt-0">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(job.type)}`}>
                      {job.type}
                    </span>
                    <button
                      onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors text-sm"
                    >
                      {selectedJob === job.id ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm">{job.description}</p>
                
                {selectedJob === job.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Requirements</h4>
                        <ul className="space-y-2">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Responsibilities</h4>
                        <ul className="space-y-2">
                          {job.responsibilities.map((resp, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              {resp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-6 flex gap-4">
                      <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors">
                        Apply Now
                      </button>
                      <button className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors">
                        Save Job
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Application Process */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Application Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">1</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Apply Online</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Submit your application and resume through our portal</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">2</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Initial Review</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Our HR team reviews your application and qualifications</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">3</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Interview Process</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Technical and cultural fit interviews with our team</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">4</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Welcome Aboard</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Join our team and start your exciting journey with us</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-lg bg-primary/10 p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Don't See a Perfect Match?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future opportunities.
        </p>
        <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors">
          Send Your Resume
        </button>
      </div>
    </div>
  );
};

export default Careers;

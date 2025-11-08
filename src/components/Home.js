import React, { useState, useEffect } from 'react';
import PageHeader from './ui/PageHeader';
import Button from './ui/Button';

const Home = () => {
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0]);
  
  const statsCards = [
    {
      title: 'Total Projects',
      value: '150+',
      change: '+25% this year',
      changeType: 'positive',
      icon: '🚀',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Happy Clients',
      value: '500+',
      change: '+15% growth',
      changeType: 'positive',
      icon: '😊',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Team Members',
      value: '25',
      change: 'Expert professionals',
      changeType: 'neutral',
      icon: '👥',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  useEffect(() => {
    const animateNumbers = () => {
      const targets = [150, 500, 25];
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        setAnimatedStats([
          Math.round(targets[0] * easeOut),
          Math.round(targets[1] * easeOut),
          Math.round(targets[2] * easeOut)
        ]);
        
        if (currentStep >= steps) {
          clearInterval(interval);
        }
      }, stepDuration);
    };

    const timer = setTimeout(animateNumbers, 500);
    return () => clearTimeout(timer);
  }, []);

  const recentProjects = [
    {
      id: '#PRJ001',
      name: 'E-commerce Platform',
      client: 'TechCorp Ltd',
      status: 'Completed',
      progress: '100%',
      statusColor: 'green'
    },
    {
      id: '#PRJ002',
      name: 'Mobile Banking App',
      client: 'FinanceBank',
      status: 'In Progress',
      progress: '75%',
      statusColor: 'blue'
    },
    {
      id: '#PRJ003',
      name: 'Healthcare Portal',
      client: 'MediCare Inc',
      status: 'In Progress',
      progress: '60%',
      statusColor: 'blue'
    },
    {
      id: '#PRJ004',
      name: 'Learning Management',
      client: 'EduTech Solutions',
      status: 'Planning',
      progress: '20%',
      statusColor: 'yellow'
    }
  ];

  const getStatusClasses = (color) => {
    const classes = {
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
      yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200',
      green: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
    };
    return classes[color] || classes.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-light via-primary-50/20 to-background-light dark:from-background-dark dark:via-primary-900/10 dark:to-background-dark">
      <div className="p-6 md:p-8">
        <PageHeader
          title="Welcome to Apexsoft Technology"
          subtitle="Your trusted partner for innovative technology solutions"
          icon={(
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 256 256">
              <path d="M158.9,89.16l-32-18-32,18L26.3,121.84,128,183.33l101.7-61.49ZM128,34,32.23,92.4,128,150.8,223.77,92.4ZM232,104.75v50.5a8,8,0,0,1-4.37,7.26l-96,54.86a7.9,7.9,0,0,1-7.26,0l-96-54.86A8,8,0,0,1,24,155.25v-50.5a8,8,0,0,1,4.37-7.26L52,83.17V144a8,8,0,0,0,16,0V100.8l52.37,29.93a8,8,0,0,0,7.26,0L180,100.8V144a8,8,0,0,0,16,0V83.17l23.63,14.32A8,8,0,0,1,232,104.75Z"></path>
            </svg>
          )}
          actions={(
            <Button variant="secondary" className="btn-animated">
              Explore Services
              <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          )}
        />
        
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {statsCards.map((stat, index) => (
            <div 
              key={index} 
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 hover:shadow-xl hover:shadow-gray-300/50 dark:hover:shadow-gray-800/50 transition-all duration-300 card-hover animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
                    {stat.icon}
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"></path>
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  {stat.title}
                </h3>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {index === 0 && animatedStats[0]}+
                    {index === 1 && animatedStats[1]}+
                    {index === 2 && animatedStats[2]}
                  </span>
                </div>
                
                <div className="mt-3 flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    stat.changeType === 'positive' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
                  }`}>
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Company Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 hover:shadow-xl transition-all duration-300 card-hover animate-fade-in-left">
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About Apexsoft</h2>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                We are a leading technology company specializing in web development, mobile applications, 
                and digital transformation solutions. Our team of expert developers and designers work 
                tirelessly to deliver cutting-edge solutions that drive business growth.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="group/item p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl hover:from-primary-50 hover:to-primary-100 dark:hover:from-primary-900/20 dark:hover:to-primary-800/20 transition-all duration-300">
                  <div className="text-2xl font-bold text-primary group-hover/item:scale-110 transition-transform duration-300">8+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Years Experience</div>
                </div>
                <div className="group/item p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl hover:from-primary-50 hover:to-primary-100 dark:hover:from-primary-900/20 dark:hover:to-primary-800/20 transition-all duration-300">
                  <div className="text-2xl font-bold text-primary group-hover/item:scale-110 transition-transform duration-300">50+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Technologies</div>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 hover:shadow-xl transition-all duration-300 card-hover animate-fade-in-right">
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Services</h2>
              </div>
              
              <div className="space-y-4">
                {[
                  { icon: '🌐', title: 'Web Development', desc: 'Custom web applications and websites', color: 'from-blue-500 to-blue-600' },
                  { icon: '📱', title: 'Mobile Apps', desc: 'iOS and Android applications', color: 'from-green-500 to-green-600' },
                  { icon: '🚀', title: 'Digital Solutions', desc: 'Complete digital transformation', color: 'from-purple-500 to-purple-600' }
                ].map((service, index) => (
                  <div key={index} className="group/service flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300">
                    <div className={`w-10 h-10 bg-gradient-to-r ${service.color} rounded-lg flex items-center justify-center shadow-md group-hover/service:scale-110 transition-transform duration-300`}>
                      <span className="text-lg">{service.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover/service:text-primary transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{service.desc}</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover/service:text-primary group-hover/service:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Recent Projects */}
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 256 256">
                <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm120,24V88H40V72Zm0,128H40V104H216v96Z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Projects</h2>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                      Project
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                      Client
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                      Progress
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentProjects.map((project, index) => (
                    <tr 
                      key={project.id} 
                      className="group hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                            <span className="text-white font-bold text-sm">{project.id.slice(-3)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                              {project.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {project.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white font-medium">
                          {project.client}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(project.statusColor)}`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            project.statusColor === 'green' ? 'bg-green-400' :
                            project.statusColor === 'blue' ? 'bg-blue-400' :
                            'bg-yellow-400'
                          } animate-pulse`}></div>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-1000 ${
                                project.statusColor === 'green' ? 'bg-green-500' :
                                project.statusColor === 'blue' ? 'bg-blue-500' :
                                'bg-yellow-500'
                              }`}
                              style={{ width: project.progress }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[3rem]">
                            {project.progress}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

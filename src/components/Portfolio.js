import React, { useState, useEffect } from 'react';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'web', name: 'Web Development' },
    { id: 'mobile', name: 'Mobile Apps' },
    { id: 'ecommerce', name: 'E-commerce' },
    { id: 'design', name: 'UI/UX Design' }
  ];

  const projects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      category: 'ecommerce',
      client: 'TechMart Solutions',
      description: 'Complete online shopping platform with payment integration and inventory management',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      image: '🛒',
      status: 'Completed',
      year: '2024'
    },
    {
      id: 2,
      title: 'Banking Mobile App',
      category: 'mobile',
      client: 'SecureBank Ltd',
      description: 'Secure mobile banking application with biometric authentication',
      technologies: ['React Native', 'Firebase', 'Biometric API'],
      image: '🏦',
      status: 'Completed',
      year: '2023'
    },
    {
      id: 3,
      title: 'Healthcare Portal',
      category: 'web',
      client: 'MediCare Inc',
      description: 'Patient management system with appointment scheduling and telemedicine',
      technologies: ['Vue.js', 'Laravel', 'MySQL', 'WebRTC'],
      image: '🏥',
      status: 'In Progress',
      year: '2024'
    },
    {
      id: 4,
      title: 'Restaurant Management',
      category: 'web',
      client: 'FoodChain Corp',
      description: 'Complete restaurant management system with POS and delivery tracking',
      technologies: ['Angular', 'Express.js', 'PostgreSQL'],
      image: '🍽️',
      status: 'Completed',
      year: '2023'
    },
    {
      id: 5,
      title: 'Fitness Tracking App',
      category: 'mobile',
      client: 'FitLife Studios',
      description: 'Personal fitness tracking app with workout plans and nutrition guides',
      technologies: ['Flutter', 'Dart', 'Firebase'],
      image: '💪',
      status: 'Completed',
      year: '2024'
    },
    {
      id: 6,
      title: 'Learning Management System',
      category: 'web',
      client: 'EduTech Solutions',
      description: 'Online learning platform with video streaming and progress tracking',
      technologies: ['React', 'Django', 'AWS', 'Redis'],
      image: '📚',
      status: 'Completed',
      year: '2023'
    },
    {
      id: 7,
      title: 'Travel Booking Platform',
      category: 'ecommerce',
      client: 'WanderLust Travel',
      description: 'Comprehensive travel booking system with real-time availability',
      technologies: ['Next.js', 'Prisma', 'PostgreSQL'],
      image: '✈️',
      status: 'In Progress',
      year: '2024'
    },
    {
      id: 8,
      title: 'Corporate Dashboard',
      category: 'design',
      client: 'Enterprise Corp',
      description: 'Executive dashboard design with data visualization and analytics',
      technologies: ['Figma', 'Adobe XD', 'Principle'],
      image: '📊',
      status: 'Completed',
      year: '2024'
    }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  const getStatusColor = (status) => {
    return status === 'Completed' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-light via-primary-50/20 to-background-light dark:from-background-dark dark:via-primary-900/10 dark:to-background-dark">
      <div className="p-6 md:p-8">
        {/* Header Section */}
        <div className="mb-12 animate-fade-in-down">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500/20 rounded-full animate-ping"></div>
              <div className="relative w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
                <svg className="w-6 h-6 text-white animate-float" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm120,24V88H40V72Zm0,128H40V104H216v96Z"></path>
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Our Portfolio
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-lg">
                Showcasing our successful projects and innovative solutions
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 animate-fade-in-up ${
                activeFilter === category.id
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 shadow-md hover:shadow-lg'
              }`}
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              {category.name}
              {activeFilter === category.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              )}
            </button>
          ))}
        </div>

        {/* Enhanced Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredProjects.map((project, index) => (
            <div 
              key={project.id} 
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 hover:shadow-xl hover:shadow-gray-300/50 dark:hover:shadow-gray-800/50 transition-all duration-500 card-hover animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Project Image/Icon Header */}
              <div className="relative h-32 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-primary-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative text-6xl animate-float group-hover:scale-110 transition-transform duration-500">
                  {project.image}
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      project.status === 'Completed' ? 'bg-green-400' : 'bg-blue-400'
                    } animate-pulse`}></div>
                    {project.status}
                  </span>
                </div>
              </div>
              
              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors duration-300">
                  {project.title}
                </h3>
                
                <p className="text-sm text-primary font-semibold mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
                  </svg>
                  {project.client}
                </p>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                  {project.description}
                </p>
                
                {/* Technologies */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-full font-medium hover:from-primary-100 hover:to-primary-200 dark:hover:from-primary-900/30 dark:hover:to-primary-800/30 transition-all duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {project.year}
                  </span>
                  <button className="group/btn flex items-center gap-2 text-primary hover:text-primary-600 dark:hover:text-primary-400 text-sm font-semibold transition-all duration-300">
                    <span>View Details</span>
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { value: '150+', label: 'Projects Delivered', icon: '🚀', color: 'from-blue-500 to-blue-600' },
            { value: '98%', label: 'Client Satisfaction', icon: '😊', color: 'from-green-500 to-green-600' },
            { value: '50+', label: 'Technologies Used', icon: '⚡', color: 'from-purple-500 to-purple-600' },
            { value: '24/7', label: 'Support Available', icon: '🛠️', color: 'from-orange-500 to-orange-600' }
          ].map((stat, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 hover:shadow-xl transition-all duration-300 card-hover animate-fade-in-up"
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors duration-300">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Testimonials */}
        <div className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Clients Say
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Don't just take our word for it - hear from our satisfied clients
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'John Mitchell',
                role: 'CEO, TechMart',
                avatar: '👨‍💼',
                testimonial: 'Apexsoft delivered an exceptional e-commerce platform that exceeded our expectations. Their attention to detail and technical expertise is outstanding.',
                color: 'from-blue-500 to-blue-600'
              },
              {
                name: 'Sarah Chen',
                role: 'CTO, SecureBank',
                avatar: '👩‍💼',
                testimonial: 'The mobile banking app they developed is secure, user-friendly, and has significantly improved our customer engagement.',
                color: 'from-green-500 to-green-600'
              },
              {
                name: 'Mike Rodriguez',
                role: 'Founder, EduTech',
                avatar: '👨‍💻',
                testimonial: 'Their learning management system transformed our online education platform. Professional team with excellent communication throughout the project.',
                color: 'from-purple-500 to-purple-600'
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 hover:shadow-xl transition-all duration-300 card-hover animate-fade-in-up"
                style={{ animationDelay: `${0.9 + index * 0.1}s` }}
              >
                <div className="relative">
                  {/* Quote Icon */}
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"></path>
                    </svg>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 pt-4">
                    "{testimonial.testimonial}"
                  </p>
                  
                  <div className="flex items-center">
                    <div className={`w-12 h-12 bg-gradient-to-r ${testimonial.color} rounded-full flex items-center justify-center shadow-md mr-4 group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-xl">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-500 to-primary-600 p-8 md:p-12 text-center animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/90 to-primary-600/90"></div>
          <div className="relative">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4 animate-float">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
                </svg>
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
              Let's create something amazing together. Contact us to discuss your project requirements and bring your vision to life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl btn-animated">
                <span className="flex items-center gap-2">
                  Start a Project
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              <button className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300">
                Download Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;

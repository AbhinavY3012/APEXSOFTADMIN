import React from 'react';

const About = () => {
  const teamMembers = [
    {
      name: 'John Smith',
      position: 'CEO & Founder',
      image: '👨‍💼',
      description: 'Visionary leader with 15+ years in technology innovation'
    },
    {
      name: 'Sarah Johnson',
      position: 'CTO',
      image: '👩‍💻',
      description: 'Technical expert specializing in scalable architecture'
    },
    {
      name: 'Mike Chen',
      position: 'Lead Developer',
      image: '👨‍💻',
      description: 'Full-stack developer with expertise in modern frameworks'
    },
    {
      name: 'Emily Davis',
      position: 'UI/UX Designer',
      image: '👩‍🎨',
      description: 'Creative designer focused on user-centered design'
    }
  ];

  const values = [
    {
      title: 'Innovation',
      description: 'We constantly explore new technologies and methodologies to deliver cutting-edge solutions.',
      icon: '💡'
    },
    {
      title: 'Quality',
      description: 'We maintain the highest standards in every project, ensuring excellence in delivery.',
      icon: '⭐'
    },
    {
      title: 'Collaboration',
      description: 'We work closely with our clients as partners to achieve shared success.',
      icon: '🤝'
    },
    {
      title: 'Integrity',
      description: 'We conduct business with honesty, transparency, and ethical practices.',
      icon: '🛡️'
    }
  ];

  const milestones = [
    {
      year: '2016',
      title: 'Company Founded',
      description: 'Started as a small team with big dreams'
    },
    {
      year: '2018',
      title: 'First Major Client',
      description: 'Secured our first enterprise-level project'
    },
    {
      year: '2020',
      title: 'Team Expansion',
      description: 'Grew to 15+ talented professionals'
    },
    {
      year: '2022',
      title: 'Global Reach',
      description: 'Expanded services to international markets'
    },
    {
      year: '2024',
      title: 'Innovation Hub',
      description: 'Established R&D center for emerging technologies'
    }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">About Apexsoft Technology</h1>
        <p className="mt-2 text-gray-600">
          Empowering businesses through innovative technology solutions since 2016
        </p>
      </div>

      {/* Company Story */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="rounded-xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Founded in 2016, Apexsoft Technology began as a vision to bridge the gap between 
            innovative technology and practical business solutions. What started as a small team 
            of passionate developers has grown into a comprehensive technology partner for 
            businesses worldwide.
          </p>
          <p className="text-gray-600 mb-4">
            We specialize in creating custom software solutions, mobile applications, and 
            digital platforms that drive business growth and enhance user experiences. Our 
            commitment to excellence and innovation has earned us the trust of over 500 clients 
            across various industries.
          </p>
          <p className="text-gray-600">
            Today, we continue to push the boundaries of what's possible, leveraging emerging 
            technologies like AI, blockchain, and cloud computing to deliver solutions that 
            prepare our clients for the future.
          </p>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-gray-800 mb-2">Vision</h3>
              <p className="text-gray-600 text-sm">
                To be the leading technology partner that transforms businesses through 
                innovative digital solutions and exceptional service delivery.
              </p>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-gray-800 mb-2">Mission</h3>
              <p className="text-gray-600 text-sm">
                We empower businesses to achieve their full potential by providing 
                cutting-edge technology solutions, expert consultation, and unwavering 
                support throughout their digital transformation journey.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Company Values */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div key={index} className="text-center p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{value.title}</h3>
              <p className="text-gray-600 text-sm">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-4">{member.image}</div>
              <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
              <p className="text-blue-600 font-medium mb-2">{member.position}</p>
              <p className="text-gray-600 text-sm">{member.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Our Journey</h2>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-blue-400 to-indigo-500"></div>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                  <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl shadow-lg border border-gray-100">
                    <div className="text-blue-600 font-bold text-lg">{milestone.year}</div>
                    <h3 className="font-semibold text-gray-800">{milestone.title}</h3>
                    <p className="text-gray-600 text-sm">{milestone.description}</p>
                  </div>
                </div>
                <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full border-4 border-white relative z-10 shadow-lg"></div>
                <div className="w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
          <div className="text-gray-600">Happy Clients</div>
        </div>
        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="text-3xl font-bold text-green-600 mb-2">150+</div>
          <div className="text-gray-600">Projects Completed</div>
        </div>
        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="text-3xl font-bold text-purple-600 mb-2">25</div>
          <div className="text-gray-600">Team Members</div>
        </div>
        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="text-3xl font-bold text-orange-600 mb-2">8+</div>
          <div className="text-gray-600">Years Experience</div>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-8 text-center border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Ready to Work With Us?
        </h2>
        <p className="text-gray-600 mb-6">
          Join hundreds of satisfied clients who have transformed their businesses with our solutions.
        </p>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          Get In Touch
        </button>
      </div>
    </div>
  );
};

export default About;

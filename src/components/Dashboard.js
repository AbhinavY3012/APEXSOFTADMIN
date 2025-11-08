import React from 'react';

const Dashboard = () => {
  const statsCards = [
    {
      title: 'Total Revenue',
      value: '$250,000',
      change: '+15% from last month',
      changeType: 'positive'
    },
    {
      title: 'Active Users',
      value: '1,500',
      change: '+5% from last month',
      changeType: 'positive'
    },
    {
      title: 'Orders Today',
      value: '75',
      change: '+10% from yesterday',
      changeType: 'positive'
    }
  ];

  const recentOrders = [
    {
      id: '#12345',
      customer: 'Sophia Clark',
      date: '2024-01-15',
      status: 'Shipped',
      amount: '$150.00',
      statusColor: 'blue'
    },
    {
      id: '#12346',
      customer: 'Ethan Carter',
      date: '2024-01-16',
      status: 'Processing',
      amount: '$200.00',
      statusColor: 'yellow'
    },
    {
      id: '#12347',
      customer: 'Olivia Bennett',
      date: '2024-01-17',
      status: 'Delivered',
      amount: '$100.00',
      statusColor: 'green'
    },
    {
      id: '#12348',
      customer: 'Liam Harper',
      date: '2024-01-18',
      status: 'Shipped',
      amount: '$180.00',
      statusColor: 'blue'
    },
    {
      id: '#12349',
      customer: 'Ava Foster',
      date: '2024-01-19',
      status: 'Processing',
      amount: '$120.00',
      statusColor: 'yellow'
    }
  ];

  const getStatusClasses = (color) => {
    const classes = {
      blue: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300',
      yellow: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300',
      green: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300'
    };
    return classes[color] || classes.blue;
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statsCards.map((stat, index) => (
          <div key={index} className="rounded-xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:scale-105">
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{stat.title}</p>
            <p className="mt-2 text-3xl font-bold text-gray-800">{stat.value}</p>
            <p className="mt-1 text-sm font-medium text-green-500">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800">Recent Orders</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-primary/20">
            <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-gray-800">
                    {order.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {order.customer}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {order.date}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusClasses(order.statusColor)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {order.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sales Overview Chart */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800">Sales Overview</h2>
        <div className="mt-4 rounded-xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg border border-gray-100">
          <div className="h-80">
            <svg fill="none" height="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 400 200" width="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="paint0_linear_chart" x1="0" x2="0" y1="0" y2="200">
                  <stop stopColor="#1173d4" stopOpacity="0.3"></stop>
                  <stop offset="1" stopColor="#1173d4" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <g transform="translate(30, 10)">
                <path d="M0 180 L350 180" stroke="#4A5568" strokeWidth="1"></path>
                <path d="M0 0 L0 180" stroke="#4A5568" strokeWidth="1"></path>
                <path d="M0 150 C 50 120, 100 80, 150 100 S 250 150, 300 120 L 350 140" fill="url(#paint0_linear_chart)"></path>
                <path className="text-primary animated-path" d="M0 150 C 50 120, 100 80, 150 100 S 250 150, 300 120 L 350 140" fill="none" stroke="currentColor" strokeWidth="2"></path>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

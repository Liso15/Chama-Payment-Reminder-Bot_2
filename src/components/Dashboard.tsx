import React from 'react';
import { Card } from './Card';
import { BarChart, AlertTriangleIcon, TrendingUpIcon, UsersIcon } from 'lucide-react';
export function Dashboard() {
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          <button className="border border-gray-300 rounded-md px-4 py-2 flex items-center space-x-2">
            <span>This Month</span>
          </button>
          <button className="border border-gray-300 bg-gray-100 rounded-md px-4 py-2">
            Refresh
          </button>
        </div>
      </div>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<CurrencyIcon />} title="Total Collected" value="KES 84,500" change="+12,500 this month" positive={true} />
        <StatCard icon={<UsersIcon />} title="Active Members" value="15/20" change="2 pending registration" positive={true} />
        <StatCard icon={<AlertTriangleIcon />} title="Late Payments" value="3" change="-2 from last month" positive={true} />
        <StatCard icon={<TrendingUpIcon />} title="On-time Rate" value="85%" change="+15% from target" positive={true} />
      </div>
      {/* Next Contributions */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Next Contributions Due</h2>
          <p className="text-sm text-gray-500">
            Upcoming payments in the next 7 days
          </p>
        </div>
        <div className="p-4">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr className="text-left">
                <th className="pb-2">Member</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Due Date</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[{
              name: 'James Mwangi',
              amount: 'KES 1,000',
              date: 'Today, 5 PM',
              status: 'Pending'
            }, {
              name: 'Aisha Omar',
              amount: 'KES 1,000',
              date: 'Tomorrow, 5 PM',
              status: 'Pending'
            }, {
              name: 'John Kamau',
              amount: 'KES 1,000',
              date: 'May 15, 5 PM',
              status: 'Pending'
            }].map((member, i) => <tr key={i} className="h-12">
                  <td>{member.name}</td>
                  <td>{member.amount}</td>
                  <td>{member.date}</td>
                  <td>
                    <span className="px-2 py-1 bg-gray-200 rounded-full text-xs">
                      {member.status}
                    </span>
                  </td>
                  <td>
                    <button className="text-sm border border-gray-300 rounded px-2 py-1">
                      Send Reminder
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </Card>
      {/* Recent Activity */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Recent Activity</h2>
          <p className="text-sm text-gray-500">
            Latest transactions and system events
          </p>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {[{
            type: 'payment',
            user: 'Grace Njeri',
            action: 'made a payment of KES 1,000',
            time: '2 hours ago'
          }, {
            type: 'reminder',
            user: 'System',
            action: 'sent reminders to 5 members',
            time: '5 hours ago'
          }, {
            type: 'payment',
            user: 'Daniel Ochieng',
            action: 'made a payment of KES 1,000',
            time: '1 day ago'
          }, {
            type: 'report',
            user: 'System',
            action: 'generated monthly report',
            time: '2 days ago'
          }].map((activity, i) => <div key={i} className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  {activity.type === 'payment' && <CurrencyIcon size={16} />}
                  {activity.type === 'reminder' && <AlertTriangleIcon size={16} />}
                  {activity.type === 'report' && <BarChart size={16} />}
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{' '}
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>)}
          </div>
        </div>
      </Card>
    </div>;
}
function StatCard({
  icon,
  title,
  value,
  change,
  positive
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  positive: boolean;
}) {
  return <Card>
      <div className="p-4">
        <div className="flex justify-between">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            {icon}
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${positive ? 'bg-gray-200' : 'bg-gray-300'}`}>
            {change}
          </span>
        </div>
        <div className="mt-3">
          <h3 className="text-sm text-gray-500">{title}</h3>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </Card>;
}
function CurrencyIcon({
  size = 24
}: {
  size?: number;
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM9.97 9.47C9.97 10.2 10.54 10.69 12.31 11.14C14.07 11.6 15.96 12.36 15.97 14.56C15.96 16.17 14.76 17.04 13.24 17.33V19H10.9V17.3C9.4 16.99 8.14 16.03 8.04 14.33H9.76C9.85 15.25 10.48 15.97 12.08 15.97C13.79 15.97 14.18 15.11 14.18 14.58C14.18 13.86 13.79 13.17 11.84 12.71C9.67 12.19 8.18 11.29 8.18 9.5C8.18 7.99 9.39 7.01 10.9 6.69V5H13.24V6.71C14.85 7.11 15.67 8.34 15.72 9.68H14.01C13.97 8.7 13.45 8.04 12.08 8.04C10.78 8.04 9.97 8.67 9.97 9.47Z" fill="currentColor" />
    </svg>;
}
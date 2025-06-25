import React from 'react';
import { Card } from './Card';
import { DownloadIcon, BarChart2Icon, LineChartIcon, PieChartIcon } from 'lucide-react';
export function Reports() {
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <div className="flex space-x-2">
          <select className="border border-gray-300 rounded-md px-4 py-2">
            <option>This Month</option>
            <option>Last Month</option>
            <option>Last 3 Months</option>
            <option>Custom Range</option>
          </select>
          <button className="border border-gray-300 rounded-md px-4 py-2 flex items-center space-x-2">
            <DownloadIcon size={16} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>
      {/* Group Performance */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Group Performance</h2>
          <p className="text-sm text-gray-500">
            Key metrics and health indicators
          </p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-3 border border-gray-200 rounded-md">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Group Health Score</h3>
                <div className="w-6 h-6 rounded-full bg-gray-200"></div>
              </div>
              <p className="text-xl font-bold mt-2">85/100</p>
              <div className="w-full bg-gray-200 h-2 mt-2 rounded-full overflow-hidden">
                <div className="bg-gray-600 h-full rounded-full" style={{
                width: '85%'
              }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                15% better than average
              </p>
            </div>
            <div className="p-3 border border-gray-200 rounded-md">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">On-time Rate</h3>
                <div className="w-6 h-6 rounded-full bg-gray-200"></div>
              </div>
              <p className="text-xl font-bold mt-2">90%</p>
              <div className="w-full bg-gray-200 h-2 mt-2 rounded-full overflow-hidden">
                <div className="bg-gray-600 h-full rounded-full" style={{
                width: '90%'
              }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">32% above target</p>
            </div>
            <div className="p-3 border border-gray-200 rounded-md">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Goal Progress</h3>
                <div className="w-6 h-6 rounded-full bg-gray-200"></div>
              </div>
              <p className="text-xl font-bold mt-2">72%</p>
              <div className="w-full bg-gray-200 h-2 mt-2 rounded-full overflow-hidden">
                <div className="bg-gray-600 h-full rounded-full" style={{
                width: '72%'
              }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Land purchase target</p>
            </div>
          </div>
          <div className="border border-gray-200 rounded-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium">Monthly Contributions</h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gray-400"></div>
                  <span className="text-xs">Target</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gray-600"></div>
                  <span className="text-xs">Actual</span>
                </div>
              </div>
            </div>
            <div className="h-48 flex items-end justify-between">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May'].map((month, i) => <div key={i} className="flex flex-col items-center space-y-1">
                  <div className="w-12 flex flex-col items-center">
                    <div className="bg-gray-600 w-6" style={{
                  height: `${[70, 85, 65, 90, 85][i]}px`
                }}></div>
                    <div className="bg-gray-400 w-6 h-px mt-1"></div>
                  </div>
                  <span className="text-xs">{month}</span>
                </div>)}
            </div>
          </div>
        </div>
      </Card>
      {/* Member Performance */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Member Performance</h2>
          <p className="text-sm text-gray-500">
            Individual contribution statistics
          </p>
        </div>
        <div className="p-4">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr className="text-left">
                <th className="pb-2">Member</th>
                <th className="pb-2">On-time Rate</th>
                <th className="pb-2">Avg. Delay</th>
                <th className="pb-2">Total Contributed</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[{
              name: 'James Mwangi',
              onTimeRate: '100%',
              avgDelay: '0 days',
              total: 'KES 5,000',
              status: 'Excellent'
            }, {
              name: 'Aisha Omar',
              onTimeRate: '100%',
              avgDelay: '0 days',
              total: 'KES 5,000',
              status: 'Excellent'
            }, {
              name: 'John Kamau',
              onTimeRate: '60%',
              avgDelay: '2.5 days',
              total: 'KES 4,000',
              status: 'At Risk'
            }, {
              name: 'Grace Njeri',
              onTimeRate: '100%',
              avgDelay: '0 days',
              total: 'KES 5,000',
              status: 'Excellent'
            }, {
              name: 'Daniel Ochieng',
              onTimeRate: '80%',
              avgDelay: '1 day',
              total: 'KES 4,500',
              status: 'Good'
            }].map((member, i) => <tr key={i} className="h-12">
                  <td>{member.name}</td>
                  <td>{member.onTimeRate}</td>
                  <td>{member.avgDelay}</td>
                  <td>{member.total}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs ${member.status === 'Excellent' ? 'bg-gray-200' : member.status === 'Good' ? 'bg-gray-300' : 'bg-gray-400'}`}>
                      {member.status}
                    </span>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </Card>
      {/* Available Reports */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Available Reports</h2>
          <p className="text-sm text-gray-500">
            Download or schedule automated reports
          </p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ReportCard icon={<BarChart2Icon size={18} />} title="Monthly Summary" description="Overview of contributions, late payments, and group balance" />
            <ReportCard icon={<LineChartIcon size={18} />} title="Member Performance" description="Individual contribution history and payment patterns" isPremium={true} />
            <ReportCard icon={<PieChartIcon size={18} />} title="Financial Projection" description="Savings forecast and goal achievement timeline" isPremium={true} />
          </div>
        </div>
      </Card>
    </div>;
}
function ReportCard({
  icon,
  title,
  description,
  isPremium = false
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  isPremium?: boolean;
}) {
  return <div className="border border-gray-200 rounded-md p-4">
      <div className="flex justify-between items-start">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          {icon}
        </div>
        {isPremium && <span className="px-2 py-1 bg-gray-200 rounded-full text-xs">
            Premium
          </span>}
      </div>
      <h3 className="text-sm font-medium mt-3">{title}</h3>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
      <div className="mt-4 flex space-x-2">
        <button className="px-3 py-1 border border-gray-300 rounded-md text-xs flex-1">
          Download
        </button>
        <button className="px-3 py-1 border border-gray-300 rounded-md text-xs flex-1">
          Schedule
        </button>
      </div>
    </div>;
}
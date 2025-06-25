import React from 'react';
import { Card } from './Card';
import { PlusIcon, MoreHorizontalIcon, SearchIcon } from 'lucide-react';
export function MemberManagement() {
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Member Management</h1>
        <button className="border border-gray-300 rounded-md px-4 py-2 flex items-center space-x-2">
          <PlusIcon size={16} />
          <span>Add Member</span>
        </button>
      </div>
      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Members (15)</h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <input type="text" placeholder="Search members..." className="pl-8 pr-4 py-1 border border-gray-300 rounded-md" />
                <SearchIcon size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <select className="border border-gray-300 rounded-md px-2 py-1">
                <option>All Status</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <div className="p-4">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr className="text-left">
                <th className="pb-2">Name</th>
                <th className="pb-2">Phone</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Contribution</th>
                <th className="pb-2">Last Payment</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[{
              name: 'James Mwangi',
              phone: '+254 712 345 678',
              status: 'Active',
              contribution: 'KES 1,000',
              lastPayment: 'May 1, 2023'
            }, {
              name: 'Aisha Omar',
              phone: '+254 723 456 789',
              status: 'Active',
              contribution: 'KES 1,000',
              lastPayment: 'May 2, 2023'
            }, {
              name: 'John Kamau',
              phone: '+254 734 567 890',
              status: 'Late',
              contribution: 'KES 1,000',
              lastPayment: 'Apr 1, 2023'
            }, {
              name: 'Grace Njeri',
              phone: '+254 745 678 901',
              status: 'Active',
              contribution: 'KES 1,000',
              lastPayment: 'May 3, 2023'
            }, {
              name: 'Daniel Ochieng',
              phone: '+254 756 789 012',
              status: 'Active',
              contribution: 'KES 1,000',
              lastPayment: 'May 2, 2023'
            }].map((member, i) => <tr key={i} className="h-12">
                  <td>{member.name}</td>
                  <td>{member.phone}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs ${member.status === 'Active' ? 'bg-gray-200' : 'bg-gray-300'}`}>
                      {member.status}
                    </span>
                  </td>
                  <td>{member.contribution}</td>
                  <td>{member.lastPayment}</td>
                  <td>
                    <button className="text-gray-500">
                      <MoreHorizontalIcon size={16} />
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">Showing 5 of 15 members</p>
            <div className="flex space-x-1">
              <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md bg-gray-200">
                2
              </button>
              <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md">
                3
              </button>
            </div>
          </div>
        </div>
      </Card>
      <Card>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Member Onboarding</h2>
          <p className="text-sm text-gray-500">
            Invite new members to join the Chama
          </p>
        </div>
        <div className="p-4">
          <div className="flex items-center space-x-4">
            <input type="text" placeholder="Enter phone number" className="flex-1 px-4 py-2 border border-gray-300 rounded-md" />
            <button className="px-4 py-2 bg-gray-200 border border-gray-300 rounded-md">
              Send Invite
            </button>
          </div>
          <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-md">
            <p className="text-sm">Bulk Import</p>
            <p className="text-xs text-gray-500">
              Upload a CSV file with member details
            </p>
            <div className="mt-2 flex justify-between items-center">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                Choose File
              </button>
              <button className="px-3 py-1 bg-gray-200 border border-gray-300 rounded-md text-sm">
                Upload
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>;
}
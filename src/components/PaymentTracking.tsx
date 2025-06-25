import React from 'react';
import { Card } from './Card';
import { DownloadIcon, FilterIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from 'lucide-react';
export function PaymentTracking() {
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Payment Tracking</h1>
        <div className="flex space-x-2">
          <button className="border border-gray-300 rounded-md px-4 py-2 flex items-center space-x-2">
            <FilterIcon size={16} />
            <span>Filter</span>
          </button>
          <button className="border border-gray-300 rounded-md px-4 py-2 flex items-center space-x-2">
            <DownloadIcon size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>
      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm text-gray-500">Total Collected</h3>
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <CheckCircleIcon size={16} />
              </div>
            </div>
            <p className="text-xl font-bold mt-2">KES 84,500</p>
            <p className="text-xs text-gray-500 mt-1">From 45 contributions</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm text-gray-500">Pending Payments</h3>
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <ClockIcon size={16} />
              </div>
            </div>
            <p className="text-xl font-bold mt-2">KES 5,000</p>
            <p className="text-xs text-gray-500 mt-1">From 5 members</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm text-gray-500">Late Payments</h3>
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <XCircleIcon size={16} />
              </div>
            </div>
            <p className="text-xl font-bold mt-2">KES 3,000</p>
            <p className="text-xs text-gray-500 mt-1">From 3 members</p>
          </div>
        </Card>
      </div>
      {/* Transaction History */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Transaction History</h2>
            <div className="flex items-center space-x-2">
              <select className="border border-gray-300 rounded-md px-2 py-1 text-sm">
                <option>This Month</option>
                <option>Last Month</option>
                <option>Last 3 Months</option>
              </select>
              <select className="border border-gray-300 rounded-md px-2 py-1 text-sm">
                <option>All Members</option>
                <option>James Mwangi</option>
                <option>Aisha Omar</option>
              </select>
            </div>
          </div>
        </div>
        <div className="p-4">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr className="text-left">
                <th className="pb-2">Date</th>
                <th className="pb-2">Member</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Transaction ID</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[{
              date: 'May 5, 2023',
              member: 'Grace Njeri',
              amount: 'KES 1,000',
              transactionId: 'QWE123456',
              status: 'Verified'
            }, {
              date: 'May 4, 2023',
              member: 'Daniel Ochieng',
              amount: 'KES 1,000',
              transactionId: 'QWE123455',
              status: 'Verified'
            }, {
              date: 'May 3, 2023',
              member: 'John Kamau',
              amount: 'KES 1,000',
              transactionId: 'QWE123454',
              status: 'Pending Verification'
            }, {
              date: 'May 2, 2023',
              member: 'Aisha Omar',
              amount: 'KES 1,000',
              transactionId: 'QWE123453',
              status: 'Verified'
            }, {
              date: 'May 1, 2023',
              member: 'James Mwangi',
              amount: 'KES 1,000',
              transactionId: 'QWE123452',
              status: 'Verified'
            }].map((transaction, i) => <tr key={i} className="h-12">
                  <td>{transaction.date}</td>
                  <td>{transaction.member}</td>
                  <td>{transaction.amount}</td>
                  <td>
                    <span className="font-mono text-sm">
                      {transaction.transactionId}
                    </span>
                  </td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs ${transaction.status === 'Verified' ? 'bg-gray-200' : 'bg-gray-300'}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td>
                    <button className="text-sm border border-gray-300 rounded px-2 py-1">
                      View
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">
              Showing 5 of 45 transactions
            </p>
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
      {/* Manual Entry */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Manual Payment Entry</h2>
          <p className="text-sm text-gray-500">
            Record payments that couldn't be automatically detected
          </p>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Member</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option>Select Member</option>
                <option>James Mwangi</option>
                <option>Aisha Omar</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input type="text" placeholder="KES 1,000" className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input type="date" className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Transaction ID
              </label>
              <input type="text" placeholder="e.g. QWE123456" className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Payment Method
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option>M-Pesa</option>
                <option>Airtel Money</option>
                <option>Equitel</option>
                <option>Cash</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <input type="text" placeholder="Optional notes" className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
          </div>
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-gray-200 border border-gray-300 rounded-md">
              Record Payment
            </button>
          </div>
        </div>
      </Card>
    </div>;
}
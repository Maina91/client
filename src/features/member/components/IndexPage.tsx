export function IndexPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Member Dashboard</h1>
        <p className="text-gray-600">
          Hello Member! Here's your pension overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Balance</h3>
          <p className="text-3xl font-bold text-green-600">$0.00</p>
          <p className="text-sm text-gray-500 mt-1">Current balance</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Contributions</h3>
          <p className="text-3xl font-bold text-blue-600">$0.00</p>
          <p className="text-sm text-gray-500 mt-1">This month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Retirement Goal</h3>
          <p className="text-3xl font-bold text-purple-600">75%</p>
          <p className="text-sm text-gray-500 mt-1">Progress</p>
        </div>
      </div>
    </div>
  )
}

import React from 'react';
import { XCircle } from 'lucide-react';

const StudentCancellation = () => {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <XCircle className="text-red-500" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Student Cancellation</h2>
            <p className="text-sm text-gray-500">Process student admission cancellations</p>
          </div>
        </div>

        {/* Add your cancellation form here */}
        <p className="text-gray-600">Student cancellation coming soon...</p>
      </div>
    </div>
  );
};

export default StudentCancellation;

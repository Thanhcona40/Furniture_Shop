import React from 'react';

const StatCard = ({ label, value }) => (
    <div className="bg-white rounded shadow p-4 flex flex-col items-center">
      <div className="text-lg font-semibold mb-2">{label}</div>
      <div className="text-2xl font-bold text-primary">{value}</div>
    </div>
  );
  

export default StatCard;

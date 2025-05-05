const AppointmentCard = ({ appointment }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg">{appointment.patientName}</h3>
          <p className="text-gray-600">{appointment.specialty}</p>
        </div>
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
          {appointment.time}
        </span>
      </div>
      <div className="mt-4 flex items-center text-sm text-gray-500">
        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {appointment.date}
      </div>
    </div>
  );
};

export default AppointmentCard;
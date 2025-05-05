const AppointmentService = {
  getAppointments: () => {
    return JSON.parse(localStorage.getItem('medibook_appointments')) || [];
  },

  createAppointment: (appointment) => {
    const appointments = JSON.parse(localStorage.getItem('medibook_appointments')) || [];
    appointments.push(appointment);
    localStorage.setItem('medibook_appointments', JSON.stringify(appointments));
  },

  getDoctorAppointments: (doctorEmail) => {
    const appointments = JSON.parse(localStorage.getItem('medibook_appointments')) || [];
    return appointments.filter(app => app.doctorEmail === doctorEmail);
  },

  getPatientAppointments: (patientEmail) => {
    const appointments = JSON.parse(localStorage.getItem('medibook_appointments')) || [];
    return appointments.filter(app => app.patientEmail === patientEmail);
  }
};

export default AppointmentService;
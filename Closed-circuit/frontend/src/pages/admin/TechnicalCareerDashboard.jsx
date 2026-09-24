import CareerApplicationsDashboard from './CareerApplicationsDashboard';

function formatDateTime(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

function getTechnicalDetailFields(selected) {
  return [
    ['Full Name', selected.fullName || selected.name],
    ['Email', selected.emailId || selected.email],
    ['Mobile', selected.mobileNumber || selected.phone],
    ['Latest Education', selected.latestEducation],
    ['Specialization', selected.specialization],
    ['Year of Pass-out', selected.yearOfPassout],
    ['University / College', selected.universityCollege],
    ['Total Experience', selected.totalExperience],
    ['Relevant Experience', selected.relevantExperience],
    ['Current / Last Company', selected.currentLastCompany],
    ['Current / Last Designation', selected.currentLastDesignation],
    ['Current Location', selected.currentLocation],
    ['City / Town', selected.city],
    ['District', selected.district],
    ['State', selected.state],
    ['PIN Code', selected.pinCode],
    ['Expected Salary', selected.expectedSalary],
    ['Notice Period', selected.noticePeriod],
    ['LinkedIn', selected.linkedinProfile],
    ['GitHub / Portfolio', selected.githubPortfolio],
    ['Applied On', formatDateTime(selected.created_at)],
  ];
}

export default function TechnicalCareerDashboard() {
  return (
    <CareerApplicationsDashboard
      title="Technical Candidates"
      subtitle="MERN stack developer applications"
      apiBase="/api/admin/careers/technical"
      getDetailFields={getTechnicalDetailFields}
    />
  );
}

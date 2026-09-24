import CareerApplicationsDashboard from './CareerApplicationsDashboard';

function formatDateTime(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

function getSalesDetailFields(selected) {
  return [
    ['Full Name', selected.fullName || selected.name],
    ['Email', selected.emailId || selected.email],
    ['Mobile', selected.mobileNumber || selected.phone],
    ['Education', selected.latestEducation],
    ['Location', selected.currentLocation],
    ['City', selected.city],
    ['District', selected.district],
    ['State', selected.state],
    ['Sales Experience', selected.salesExperience],
    ['Calls Per Day', selected.callsPerDay],
    ['Closures Per Day', selected.closuresPerDay],
    ['Languages', selected.languages],
    ['Laptop', selected.hasLaptop],
    ['Mobile Phone', selected.hasMobilePhone],
    ['Separate SIM', selected.hasSeparateSim],
    ['Workstation', selected.hasWorkstation],
    ['Internet', selected.hasInternet],
    ['Reviewed Product', selected.reviewedProduct],
    ['Watched Product Video', selected.watchedProductVideo],
    ['Watched Career Video', selected.watchedCareerVideo],
    ['Applied On', formatDateTime(selected.created_at)],
  ];
}

export default function CareerDashboard() {
  return (
    <CareerApplicationsDashboard
      title="Sales Candidates"
      subtitle="Inside sales career applications"
      apiBase="/api/admin/careers/sales"
      getDetailFields={getSalesDetailFields}
      renderExtraDetail={(selected) => (
        <div className="mb-4">
          <p className="text-slate-500 text-xs mb-1">Product Understanding</p>
          <pre className="whitespace-pre-wrap rounded-lg border border-white/10 bg-black/20 p-4 text-slate-200 max-h-40 overflow-y-auto">
            {selected.productUnderstanding || '-'}
          </pre>
        </div>
      )}
    />
  );
}

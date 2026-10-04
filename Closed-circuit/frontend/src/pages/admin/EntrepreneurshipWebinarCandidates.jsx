import WebinarCandidatesDashboard from './WebinarCandidatesDashboard';

export default function EntrepreneurshipWebinarCandidates() {
  return (
    <WebinarCandidatesDashboard
      title="Entrepreneurship Webinar Candidates"
      subtitle="Participation records and certificate status"
      apiBase="/api/admin/webinars/entrepreneurship/participations"
    />
  );
}

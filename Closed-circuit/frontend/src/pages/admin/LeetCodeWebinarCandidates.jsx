import WebinarCandidatesDashboard from './WebinarCandidatesDashboard';

export default function LeetCodeWebinarCandidates() {
  return (
    <WebinarCandidatesDashboard
      title="LeetCode Webinar Candidates"
      subtitle="Participation records and certificate status"
      apiBase="/api/admin/webinars/leetcode/participations"
    />
  );
}

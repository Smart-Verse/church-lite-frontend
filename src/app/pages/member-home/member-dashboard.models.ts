export interface MemberDashboard {
  memberName: string;
  monthTotal: number;
  yearTotal: number;
  upcomingEvents: MemberEvent[];
  recentContributions: MemberContribution[];
}

export interface MemberEvent {
  id: string;
  name: string;
  color: string;
  initialDate: string;
  finalDate: string;
  local: string;
}

export interface MemberContribution {
  id: string;
  description: string;
  planAccount?: string;
  date: string;
  value: number;
}

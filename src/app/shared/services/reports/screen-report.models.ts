export interface ScreenReportOption {
  id: string;
  name: string;
  screen: string;
}

export interface ScreenReportsResponse {
  reports: ScreenReportOption[];
}

export interface GenerateScreenReportRequest {
  reportId: string;
  data: Record<string, unknown>;
}

export interface GenerateScreenReportResponse {
  report: string;
}

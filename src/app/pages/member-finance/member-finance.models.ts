export interface MemberFinancialPortal { enabled:boolean; mode:'DISABLED'|'FULL'|'PARTIAL'; startDate:string; endDate:string; revenueTotal:number; expenseTotal:number; accounts:MemberAccountSummary[]; expenses:MemberExpenseDetail[]; }
export interface MemberAccountSummary { planAccountId:string; codeTree:string; description:string; financialNature:'REVENUE'|'EXPENSE'; visibility:'TOTAL_ONLY'|'DETAILED'; total:number; }
export interface MemberExpenseDetail { id:string; date:string; description:string; planAccountId?:string; planAccount:string; value:number; }

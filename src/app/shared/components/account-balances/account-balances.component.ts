import {CommonModule} from '@angular/common';
import {Component, Input} from '@angular/core';

export interface AccountBalanceItem {
  id: string;
  description: string;
  detail?: string | null;
  balance: number;
  type: 'BANK' | 'CASH';
  open?: boolean;
}

@Component({
  selector: 'app-account-balances',
  imports: [CommonModule],
  templateUrl: './account-balances.component.html',
  styleUrl: './account-balances.component.scss'
})
export class AccountBalancesComponent {
  @Input() accounts: AccountBalanceItem[] = [];

  get banks(): AccountBalanceItem[] { return this.accounts.filter(item => item.type === 'BANK'); }
  get cashes(): AccountBalanceItem[] { return this.accounts.filter(item => item.type === 'CASH'); }
  get total(): number { return this.accounts.reduce((sum, item) => sum + item.balance, 0); }
}

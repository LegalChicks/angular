import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  dueDate: string;
  issuedDate: string;
}

export interface Expense {
  id: string;
  date: string;
  category: 'Feeds' | 'Vitamins' | 'Equipment' | 'Utilities' | 'Other';
  description: string;
  amount: number;
}

export interface ProfitabilityData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  revenueVsExpenses: { month: string; revenue: number; expenses: number }[];
}

@Injectable({ providedIn: 'root' })
export class BusinessService {
  private http = inject(HttpClient);

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.business.invoices}`
    );
  }

  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.business.expenses}`
    );
  }

  addExpense(expenseData: Omit<Expense, 'id' | 'date'>): Observable<Expense> {
    return this.http.post<Expense>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.business.expenses}`,
      expenseData
    );
  }

  getProfitabilityData(): Observable<ProfitabilityData> {
    return this.http.get<ProfitabilityData>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.business.profitability}`
    );
  }
}
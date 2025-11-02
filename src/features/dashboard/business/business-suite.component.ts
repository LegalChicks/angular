import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BusinessService, Expense, Invoice, ProfitabilityData } from '../../../services/business.service';
import { finalize } from 'rxjs/operators';

type ActiveTab = 'profitability' | 'invoices' | 'expenses';

@Component({
  selector: 'app-business-suite',
  templateUrl: './business-suite.component.html',
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusinessSuiteComponent implements OnInit {
  private businessService = inject(BusinessService);
  private fb = inject(FormBuilder);

  activeTab = signal<ActiveTab>('profitability');
  isLoading = signal(true);
  
  // Data signals
  profitabilityData = signal<ProfitabilityData | null>(null);
  invoices = signal<Invoice[]>([]);
  expenses = signal<Expense[]>([]);

  // Expense form
  isAddingExpense = signal(false);
  expenseForm = this.fb.group({
    description: ['', Validators.required],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    category: ['Feeds' as Expense['category'], Validators.required],
  });

  // Computed value for profitability chart
  maxChartValue = computed(() => {
    const data = this.profitabilityData();
    if (!data) return 0;
    const allValues = data.revenueVsExpenses.flatMap(d => [d.revenue, d.expenses]);
    return Math.max(...allValues);
  });

  ngOnInit() {
    this.loadProfitabilityData();
  }

  changeTab(tab: ActiveTab) {
    this.activeTab.set(tab);
    if (tab === 'profitability' && !this.profitabilityData()) this.loadProfitabilityData();
    if (tab === 'invoices' && this.invoices().length === 0) this.loadInvoices();
    if (tab === 'expenses' && this.expenses().length === 0) this.loadExpenses();
  }

  loadProfitabilityData() {
    this.isLoading.set(true);
    this.businessService.getProfitabilityData()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe(data => this.profitabilityData.set(data));
  }

  loadInvoices() {
    this.isLoading.set(true);
    this.businessService.getInvoices()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe(data => this.invoices.set(data));
  }

  loadExpenses() {
    this.isLoading.set(true);
    this.businessService.getExpenses()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe(data => this.expenses.set(data));
  }

  async addExpense() {
    if (this.expenseForm.invalid) return;

    this.isAddingExpense.set(true);
    const newExpenseData = {
      description: this.expenseForm.value.description!,
      amount: this.expenseForm.value.amount!,
      category: this.expenseForm.value.category!,
    };
    
    this.businessService.addExpense(newExpenseData)
      .pipe(finalize(() => this.isAddingExpense.set(false)))
      .subscribe(newExpense => {
        this.expenses.update(expenses => [newExpense, ...expenses]);
        this.expenseForm.reset({ category: 'Feeds' });
      });
  }
  
  getBarHeight(value: number): string {
    const max = this.maxChartValue();
    if (max === 0) return '0%';
    return `${(value / max) * 100}%`;
  }

  getStatusClass(status: Invoice['status']): string {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
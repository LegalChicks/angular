import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  imageUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
}

@Component({
  selector: 'app-supply-ordering',
  templateUrl: './supply-ordering.component.html',
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplyOrderingComponent {
  
  products = signal<Product[]>([
    { id: 'c01', name: 'Day-Old RIR Chicks', description: 'Purebred Rhode Island Red chicks from our high-quality breeder flocks.', price: 45, unit: 'per chick', imageUrl: 'https://picsum.photos/seed/chicks/300/200' },
    { id: 'f01', name: 'Starter Crumble Feeds', description: 'High-protein starter feed for chicks (0-8 weeks).', price: 1800, unit: 'per 50kg bag', imageUrl: 'https://picsum.photos/seed/feeds/300/200' },
    { id: 'f02', name: 'Grower Pellets', description: 'Balanced nutrition for growing pullets (8-18 weeks).', price: 1750, unit: 'per 50kg bag', imageUrl: 'https://picsum.photos/seed/pellets/300/200' },
    { id: 'v01', name: 'Electrolytes + Vitamins', description: 'Water-soluble vitamins to reduce stress and boost immunity.', price: 150, unit: 'per 100g pack', imageUrl: 'https://picsum.photos/seed/vitamins/300/200' },
    { id: 'e01', name: 'Automatic Drinker', description: 'Ensure constant access to clean water for your flock.', price: 250, unit: 'per unit', imageUrl: 'https://picsum.photos/seed/equipment/300/200' },
    { id: 'p01', name: 'Branded Egg Cartons', description: 'Professional packaging for your harvested eggs (holds 12 eggs).', price: 10, unit: 'per carton', imageUrl: 'https://picsum.photos/seed/cartons/300/200' },
  ]);

  cart = signal<CartItem[]>([]);
  assignDistributor = signal(false);

  cartTotal = computed(() => this.cart().reduce((total, item) => total + (item.price * item.quantity), 0));

  addToCart(product: Product) {
    const existingItem = this.cart().find(item => item.id === product.id);
    if (existingItem) {
      this.cart.update(items =>
        items.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      this.cart.update(items => [...items, { ...product, quantity: 1 }]);
    }
  }

  removeFromCart(productId: string) {
    this.cart.update(items => items.filter(item => item.id !== productId));
  }

  updateQuantity(productId: string, event: Event) {
    const quantity = parseInt((event.target as HTMLInputElement).value, 10);
    if (quantity > 0) {
      this.cart.update(items =>
        items.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    } else {
      this.removeFromCart(productId);
    }
  }

  placeOrder() {
    if (this.cart().length === 0) {
      alert('Your cart is empty.');
      return;
    }
    
    let orderMessage = 'Order submitted successfully!\n\nItems:\n';
    this.cart().forEach(item => {
      orderMessage += `- ${item.name} (x${item.quantity})\n`;
    });
    orderMessage += `\nTotal: ₱${this.cartTotal().toFixed(2)}`;

    if (this.assignDistributor()) {
      orderMessage += `\n\nA request has been sent to assign a Local LCEN Distributor to you. They will be in touch shortly.`;
    }

    alert(orderMessage);

    // Reset cart and checkbox
    this.cart.set([]);
    this.assignDistributor.set(false);
  }
}
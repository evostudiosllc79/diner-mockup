// Cart management using localStorage
const Cart = {
  items: JSON.parse(localStorage.getItem('dinerCart') || '[]'),

  save() {
    localStorage.setItem('dinerCart', JSON.stringify(this.items));
    this.updateIcon();
  },

  add(id, name, price) {
    const existing = this.items.find(i => i.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      this.items.push({ id, name, price, qty: 1 });
    }
    this.save();
    this.showToast(name);
  },

  remove(id) {
    this.items = this.items.filter(i => i.id !== id);
    this.save();
  },

  updateQty(id, delta) {
    const item = this.items.find(i => i.id === id);
    if (item) {
      item.qty += delta;
      if (item.qty <= 0) this.remove(id);
      else this.save();
    }
  },

  clear() {
    this.items = [];
    this.save();
  },

  total() {
    return this.items.reduce((sum, i) => sum + (i.price * i.qty), 0);
  },

  count() {
    return this.items.reduce((sum, i) => sum + i.qty, 0);
  },

  updateIcon() {
    const count = this.count();
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  },

  showToast(name) {
    const existing = document.querySelector('.cart-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.innerHTML = `✅ <strong>${name}</strong> added to order!`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }
};

// Init icon on page load
Cart.updateIcon();

document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);
    Cart.add(name, name, price);
  });
});
'use client';

import { useMemo, useState } from 'react';
import {
  applyFreeWater,
  calculatePricing,
  canSkipMeal,
  isFreeWaterEligible,
  repeatOrderRate,
  validateBulkOrder
} from '../lib/businessRules';

const menuItems = [
  { id: 'thali', name: 'Student Thali', price: 95, taxRate: 0.05, under100: true, combo: false, stock: 40, sop: 'Serve rice, dal, sabzi, 2 rotis.' },
  { id: 'roll', name: 'Paneer Roll', price: 85, taxRate: 0.05, under100: true, combo: false, stock: 25, sop: 'Grill paneer, wrap with salad + sauce.' },
  { id: 'combo1', name: '+1 Combo: Thali + Lassi', price: 130, taxRate: 0.05, under100: false, combo: true, stock: 15, sop: 'Pack thali and add sealed lassi cup.' },
  { id: 'combo2', name: '+1 Combo: Roll + Fries', price: 120, taxRate: 0.05, under100: false, combo: true, stock: 20, sop: 'Prepare roll, add fries with spice mix.' }
];

export default function Home() {
  const [showUnder100, setShowUnder100] = useState(false);
  const [showCombos, setShowCombos] = useState(false);
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState('cart');
  const [userOrderCount, setUserOrderCount] = useState(0);
  const [isNewLogin, setIsNewLogin] = useState(true);
  const [address, setAddress] = useState('');
  const [bulkForm, setBulkForm] = useState({ eventDate: '', units: 50, advancePercent: 50 });
  const [subscription, setSubscription] = useState({ mealType: 'Lunch', durationDays: 7, nextMealAt: '' });
  const [orders, setOrders] = useState([]);
  const [selectedKdsItem, setSelectedKdsItem] = useState(null);

  const filteredMenu = useMemo(() => {
    return menuItems.filter((item) => {
      if (showUnder100 && !item.under100) return false;
      if (showCombos && !item.combo) return false;
      return true;
    });
  }, [showUnder100, showCombos]);

  const eligibleForWater = isFreeWaterEligible({ userOrderCount, isNewLogin });
  const cartWithRules = useMemo(() => applyFreeWater(cart, eligibleForWater), [cart, eligibleForWater]);
  const pricing = useMemo(() => calculatePricing(cartWithRules), [cartWithRules]);

  function addToCart(item) {
    setCart((prev) => [...prev, item]);
  }

  function placeOrder() {
    if (!address.trim()) return;
    const created = {
      id: `ORD-${orders.length + 1}`,
      type: 'Immediate Delivery',
      items: cartWithRules,
      total: pricing.total,
      createdAt: new Date().toISOString()
    };
    setOrders((prev) => [created, ...prev]);
    setCart([]);
    setIsNewLogin(false);
    setUserOrderCount((prev) => prev + 1);
    setAddress('');
    setStep('cart');
  }

  function createBulkOrder() {
    const error = validateBulkOrder(bulkForm);
    if (error) {
      alert(error);
      return;
    }

    const created = {
      id: `BULK-${orders.length + 1}`,
      type: 'Future Bulk Orders',
      items: [{ name: `Bulk Units x${bulkForm.units}`, sop: 'Pack ready-to-serve catering trays.' }],
      total: bulkForm.units * 90,
      createdAt: bulkForm.eventDate
    };
    setOrders((prev) => [created, ...prev]);
    alert('Bulk order booked with advance payment lock.');
  }

  function requestSkip() {
    if (!subscription.nextMealAt) {
      alert('Set a next meal date-time first.');
      return;
    }

    const allowed = canSkipMeal(subscription.nextMealAt);
    if (!allowed) {
      alert('Skip denied: requires at least 4-hour notice.');
      return;
    }
    alert('Skip accepted. Wallet credit added.');
  }

  const immediateOrders = orders.filter((o) => o.type === 'Immediate Delivery');
  const futureBulkOrders = orders.filter((o) => o.type === 'Future Bulk Orders');
  const rptRate = repeatOrderRate(120, 52).toFixed(1);

  return (
    <main>
      <h1>Lunatics Kitchen — MVP</h1>
      <p className="muted">No BS. Under ₹100 meals, subscription engine, and bulk booking.</p>

      <section className="panel">
        <h2>Home & Menu</h2>
        <div className="row" style={{ marginBottom: 10 }}>
          <button className={showUnder100 ? '' : 'secondary'} onClick={() => setShowUnder100((v) => !v)}>Under ₹100</button>
          <button className={showCombos ? '' : 'secondary'} onClick={() => setShowCombos((v) => !v)}>+1 Combos</button>
          <span className="badge accent">Free water: {eligibleForWater ? 'Eligible' : 'Not eligible'}</span>
        </div>
        <div className="grid menu-grid">
          {filteredMenu.map((item) => (
            <article className="panel" key={item.id}>
              <div className="row space-between">
                <strong>{item.name}</strong>
                {item.under100 && <span className="badge">₹100</span>}
              </div>
              <p>₹{item.price.toFixed(0)}</p>
              <p className="muted">Stock: {item.stock}</p>
              <button onClick={() => addToCart(item)}>Add</button>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Direct Checkout</h2>
        <p className="muted">Flow: Cart → Address → Payment</p>
        <div className="row" style={{ marginBottom: 10 }}>
          <button className={step === 'cart' ? '' : 'secondary'} onClick={() => setStep('cart')}>Cart</button>
          <button className={step === 'address' ? '' : 'secondary'} onClick={() => setStep('address')}>Address</button>
          <button className={step === 'payment' ? '' : 'secondary'} onClick={() => setStep('payment')}>Payment</button>
        </div>

        <ul>
          {cartWithRules.map((item, idx) => (
            <li key={`${item.id}-${idx}`}>{item.name} — ₹{item.price}</li>
          ))}
        </ul>

        {step !== 'cart' && (
          <input placeholder="Enter delivery address" value={address} onChange={(e) => setAddress(e.target.value)} />
        )}

        {step === 'payment' && (
          <div className="panel">
            <h3>Final Price (No Hidden Charges)</h3>
            <p>Subtotal: ₹{pricing.subtotal.toFixed(2)}</p>
            <p>Tax: ₹{pricing.taxAmount.toFixed(2)}</p>
            <p>Delivery Fee: ₹{pricing.deliveryFee.toFixed(2)}</p>
            <p className="kpi">Payable: ₹{pricing.total.toFixed(2)}</p>
            <button onClick={placeOrder}>Pay with UPI (mock)</button>
          </div>
        )}
      </section>

      <section className="panel grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <h2>Subscription — Daily Habit Engine</h2>
          <label>Meal Type</label>
          <select value={subscription.mealType} onChange={(e) => setSubscription((s) => ({ ...s, mealType: e.target.value }))}>
            <option>Lunch</option>
            <option>Dinner</option>
          </select>
          <label>Duration</label>
          <select value={subscription.durationDays} onChange={(e) => setSubscription((s) => ({ ...s, durationDays: Number(e.target.value) }))}>
            <option value={7}>7 days</option>
            <option value={15}>15 days</option>
            <option value={30}>30 days</option>
          </select>
          <label>Next Meal DateTime (for skip test)</label>
          <input type="datetime-local" onChange={(e) => setSubscription((s) => ({ ...s, nextMealAt: e.target.value }))} />
          <div className="row" style={{ marginTop: 8 }}>
            <button onClick={requestSkip}>Skip Meal</button>
            <span className="muted">Skip allowed only if 4+ hours before slot.</span>
          </div>
        </div>

        <div>
          <h2>Bulk Catering</h2>
          <p className="muted">Ready-to-serve bulk menu, 7-day lock, max 200 units.</p>
          <label>Event Date</label>
          <input type="date" value={bulkForm.eventDate} onChange={(e) => setBulkForm((b) => ({ ...b, eventDate: e.target.value }))} />
          <label>Units (1-200)</label>
          <input type="number" min={1} max={200} value={bulkForm.units} onChange={(e) => setBulkForm((b) => ({ ...b, units: Number(e.target.value) }))} />
          <label>Advance Payment % (50-100)</label>
          <input type="number" min={50} max={100} value={bulkForm.advancePercent} onChange={(e) => setBulkForm((b) => ({ ...b, advancePercent: Number(e.target.value) }))} />
          <button onClick={createBulkOrder}>Book Bulk Order</button>
        </div>
      </section>

      <section className="panel grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <h2>Kitchen Display System (KDS)</h2>
          <h3>Immediate Delivery</h3>
          {immediateOrders.map((order) => (
            <div key={order.id} className="panel">
              <div className="row space-between">
                <strong>{order.id}</strong>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
              <button onClick={() => setSelectedKdsItem(order.items[0])}>View SOP</button>
            </div>
          ))}

          <h3>Future Bulk Orders</h3>
          {futureBulkOrders.map((order) => (
            <div key={order.id} className="panel">
              <div className="row space-between">
                <strong>{order.id}</strong>
                <span>{order.createdAt}</span>
              </div>
              <button onClick={() => setSelectedKdsItem(order.items[0])}>View SOP</button>
            </div>
          ))}
          {!orders.length && <p className="muted">No live orders yet.</p>}
        </div>

        <div>
          <h2>SOP Panel + Admin KPIs</h2>
          <p><strong>SOP:</strong> {selectedKdsItem?.sop || 'Select an order item to view SOP.'}</p>
          <div className="panel">
            <p className="muted">Repeat Order Rate</p>
            <p className="kpi">{rptRate}%</p>
          </div>
          <div className="panel">
            <p className="muted">Segments</p>
            <p>Students: 74</p>
            <p>Corporate: 31</p>
            <p>Hostel Owners: 15</p>
          </div>
        </div>
      </section>
    </main>
  );
}

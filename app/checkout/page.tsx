'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatProductTitle } from '@/lib/format';
import { 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  Lock, 
  ArrowLeft 
} from 'lucide-react';

export default function CheckoutPage() {
  const { cart, totalPrice, totalItems, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    address: '',
    city: '',
    state: 'Karnataka',
    pincode: '',
    paymentMethod: 'RAZORPAY_UPI',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  if (cart.length === 0 && !orderConfirmed) {
    return (
      <div className="bg-[#f8fafc] min-h-screen py-16 text-center">
        <div className="agri-container max-w-md bg-white p-8 rounded-lg border shadow-sm">
          <p className="text-gray-700 text-sm mb-4">No items in cart to checkout.</p>
          <Link href="/products" className="agri-btn-primary text-xs">
            Return to Products →
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate order creation and Razorpay sandbox transaction
    setTimeout(() => {
      const generatedOrder = `AGRI-${Date.now().toString().slice(-6)}`;
      setOrderNumber(generatedOrder);
      setIsProcessing(false);
      setOrderConfirmed(true);
      clearCart();
    }, 1500);
  };

  if (orderConfirmed) {
    return (
      <div className="bg-[#f8fafc] min-h-screen py-16">
        <div className="agri-container max-w-xl text-center">
          <div className="bg-white rounded-lg border border-gray-200 p-10 shadow-sm">
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-xs font-mono text-gray-500 mb-4">
              Order Reference: <strong className="text-gray-900 font-bold">{orderNumber}</strong>
            </p>
            <div className="bg-green-50 border border-green-200 rounded p-4 text-xs text-green-800 text-left mb-6 space-y-1">
              <p><strong>Customer:</strong> {formData.fullName} ({formData.mobile})</p>
              <p><strong>Delivery Address:</strong> {formData.address}, {formData.city}, {formData.state} – {formData.pincode}</p>
              <p><strong>Payment Status:</strong> Paid via {formData.paymentMethod} (Sandbox Verified)</p>
              <p><strong>Total Paid:</strong> ₹ {totalPrice.toLocaleString('en-IN')}</p>
            </div>
            <p className="text-xs text-gray-600 mb-8 leading-relaxed">
              We have dispatched your order details to the Agrimart central logistics facility. You will receive an SMS and WhatsApp tracking update on <strong>+91 {formData.mobile}</strong>.
            </p>
            <Link href="/" className="agri-btn-primary text-xs py-2.5 px-6">
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen py-10">
      <div className="agri-container">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-6 flex items-center space-x-1.5">
          <Link href="/cart" className="hover:text-green-700">Cart</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Secure Checkout</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Checkout & Shipping Address
        </h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left 2 Cols: Shipping Details & Payment Options */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#0d9749]" />
                  <span>1. Delivery Address</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Enter receiver full name"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-green-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Mobile Number (For Delivery SMS & Call) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                      placeholder="10-digit mobile"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-green-600 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="For invoice & delivery updates"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-green-600 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-gray-700 mb-1">
                      Street Address / House / Plot / Farm No. <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Flat, Landmark, Road, Village"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-green-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      City / District <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Bangalore"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-green-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-green-600 focus:outline-none bg-white"
                    >
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Haryana">Haryana</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                      placeholder="6-digit pincode"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-green-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods (Razorpay Integration) */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#0d9749]" />
                  <span>2. Payment Method (Razorpay Gateway)</span>
                </h2>

                <div className="space-y-3 text-xs">
                  <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:border-green-600 bg-gray-50/50">
                    <input
                      type="radio"
                      name="payment"
                      value="RAZORPAY_UPI"
                      checked={formData.paymentMethod === 'RAZORPAY_UPI'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">UPI / QR Code (Google Pay, PhonePe, Paytm, BHIM)</p>
                      <p className="text-gray-500 text-[11px]">Instant settlement via Razorpay secure sandbox</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:border-green-600 bg-gray-50/50">
                    <input
                      type="radio"
                      name="payment"
                      value="RAZORPAY_CARDS"
                      checked={formData.paymentMethod === 'RAZORPAY_CARDS'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">Credit / Debit Card (Visa, MasterCard, RuPay)</p>
                      <p className="text-gray-500 text-[11px]">PCI-DSS level 1 encrypted transaction</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:border-green-600 bg-gray-50/50">
                    <input
                      type="radio"
                      name="payment"
                      value="NET_BANKING"
                      checked={formData.paymentMethod === 'NET_BANKING'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">Net Banking (All Major Indian Banks)</p>
                      <p className="text-gray-500 text-[11px]">SBI, HDFC, ICICI, Axis, Canara & 50+ banks</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Review & Submit */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm sticky top-24">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b">
                Order Review ({totalItems} items)
              </h2>

              <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 text-xs mb-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="py-2.5 flex justify-between items-center">
                    <div className="max-w-[180px]">
                      <p className="font-normal text-gray-900 line-clamp-1">{formatProductTitle(item.product.name)}</p>
                      <p className="text-[10px] text-gray-500 font-mono">
                        {item.quantity} x ₹ {item.product.sellingPrice.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <span className="font-bold text-gray-900">
                      ₹ {(item.product.sellingPrice * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-xs text-gray-600 border-t pt-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold text-gray-900">₹ {totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST:</span>
                  <span className="text-green-700 font-medium">Included in MRP</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span className="text-green-700 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 border-t pt-2">
                  <span>Payable Amount:</span>
                  <span className="text-[#097b3a]">₹ {totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#0d9749] hover:bg-[#097b3a] text-white text-xs font-bold py-3.5 px-4 rounded-md flex items-center justify-center gap-2 transition-colors shadow-md disabled:bg-gray-400"
              >
                <Lock className="w-4 h-4" />
                <span>{isProcessing ? 'Processing Secure Payment...' : `Pay ₹ ${totalPrice.toLocaleString('en-IN')} & Place Order`}</span>
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-500">
                <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                <span>256-bit SSL Encrypted Checkout</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

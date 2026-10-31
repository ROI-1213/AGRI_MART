'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Trash2, ArrowRight, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalPrice, totalItems, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="bg-[#f8fafc] min-h-screen py-16">
        <div className="agri-container max-w-2xl text-center">
          <div className="bg-white rounded-lg border border-gray-200 p-12 shadow-sm">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">Your Shopping Cart is Empty</h1>
            <p className="text-xs text-gray-500 mb-6">
              Looks like you haven&apos;t added any agricultural equipment or tools to your cart yet.
            </p>
            <Link href="/products" className="agri-btn-primary text-xs py-2.5 px-6">
              Browse Products Catalogue →
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
          <Link href="/" className="hover:text-green-700">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Shopping Cart</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center text-xs font-bold text-gray-700 uppercase tracking-wider">
              <span>Product Details</span>
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 font-semibold lowercase text-xs hover:underline"
              >
                Clear Cart
              </button>
            </div>

            <div className="divide-y divide-gray-200">
              {cart.map((item) => (
                <div key={item.product.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-center sm:items-start justify-between">
                  <div className="flex gap-4 items-start w-full sm:w-auto">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 bg-gray-50 rounded border border-gray-200 shrink-0 overflow-hidden">
                      <Image
                        src={item.product.thumbnailImage || '/assets/branding/logo.png'}
                        alt={item.product.name}
                        fill
                        unoptimized
                        className="object-contain p-1"
                      />
                    </div>

                    {/* Details */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-50 px-2 py-0.5 rounded">
                        {item.product.brand}
                      </span>
                      <h3 className="font-bold text-xs sm:text-sm text-gray-900 mt-1 line-clamp-2">
                        {item.product.name}
                      </h3>
                      <p className="text-[11px] font-mono text-gray-500 mt-0.5">
                        RIPL: <strong>{item.product.riplCode}</strong>
                      </p>
                      <p className="text-xs font-bold text-[#1b5e20] mt-1 sm:hidden">
                        ₹ {item.product.sellingPrice.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* Quantity and Line Total */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0">
                    <div className="flex items-center border border-gray-300 rounded text-xs">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-gray-900">
                        ₹ {(item.product.sellingPrice * item.quantity).toLocaleString('en-IN')}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        ₹ {item.product.sellingPrice.toLocaleString('en-IN')} each
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <Link
                href="/products"
                className="text-xs font-bold text-[#2d7d32] hover:text-green-800 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* Order Summary Box (1 col) */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items):</span>
                <span className="font-semibold text-gray-900">
                  ₹ {totalPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST (Goods & Services Tax):</span>
                <span className="text-green-700 font-medium">Included (MRP)</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping / Logistics:</span>
                <span className="text-green-700 font-medium">FREE Standard</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-sm font-bold text-gray-900">
                <span>Total Amount:</span>
                <span className="text-lg text-[#1b5e20]">
                  ₹ {totalPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full bg-[#2d7d32] hover:bg-[#1b5e20] text-white text-xs font-bold py-3 px-4 rounded-md flex items-center justify-center gap-2 transition-colors shadow-md text-center"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-[11px] text-gray-500">
              <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
              <span>100% Genuine Machinery backed by Ratnagiri Impex Warranty</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

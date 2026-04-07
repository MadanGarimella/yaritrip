import { create } from "zustand";

export const useCheckoutStore = create((set, get) => ({

  /* ================= CORE DATA ================= */
  packageData: null,
  travellers: [],
  addons: [],
  basePrice: 0,

  /* ================= PAYMENT DATA ================= */
  paymentDetails: null,
  transactionId: null,
  bookingId: null,

  /* ================= PACKAGE ================= */
  setPackage: (pkg) =>
    set({
      packageData: pkg,
      basePrice: pkg?.price || 0,
    }),

  /* ================= TRAVELLERS ================= */
  addTraveller: (traveller) =>
    set((state) => ({
      travellers: [...state.travellers, traveller],
    })),

  updateTraveller: (index, data) =>
    set((state) => {
      const updated = [...state.travellers];
      updated[index] = { ...updated[index], ...data };
      return { travellers: updated };
    }),

  removeTraveller: (index) =>
    set((state) => ({
      travellers: state.travellers.filter((_, i) => i !== index),
    })),

  clearTravellers: () =>
    set({ travellers: [] }),

  /* ================= ADDONS ================= */
  toggleAddon: (addon) =>
    set((state) => {
      const exists = state.addons.find(
        (a) => a.id === addon.id
      );

      if (exists) {
        return {
          addons: state.addons.filter(
            (a) => a.id !== addon.id
          ),
        };
      }

      return {
        addons: [...state.addons, addon],
      };
    }),

  clearAddons: () =>
    set({ addons: [] }),

  /* ================= PRICE CALCULATION ================= */
  getPriceBreakdown: () => {
    const { travellers, basePrice, addons } = get();

    const adults = travellers.filter(
      (t) => t.type === "Adult"
    );
    const children = travellers.filter(
      (t) => t.type === "Child"
    );

    const adultTotal = adults.length * basePrice;
    const childTotal =
      children.length * (basePrice * 0.75);

    const addonsTotal = addons.reduce(
      (sum, a) => sum + (a.price || 0),
      0
    );

    return {
      adultCount: adults.length,
      childCount: children.length,
      adultTotal,
      childTotal,
      addonsTotal,
      total:
        adultTotal + childTotal + addonsTotal,
    };
  },

  getTotal: () => {
    return get().getPriceBreakdown().total;
  },

  /* ================= PAYMENT ================= */
  generateTransactionId: () =>
    "TXN" + Date.now(),

  generateBookingId: () =>
    "BOOK" + Math.floor(Math.random() * 1000000000),

  setPaymentDetails: (data) => {
    const transactionId =
      get().generateTransactionId();
    const bookingId =
      get().generateBookingId();

    set({
      paymentDetails: data,
      transactionId,
      bookingId,
    });
  },

  clearPayment: () =>
    set({
      paymentDetails: null,
      transactionId: null,
      bookingId: null,
    }),

  /* ================= RESET CHECKOUT ================= */
  resetCheckout: () =>
    set({
      packageData: null,
      travellers: [],
      addons: [],
      basePrice: 0,
      paymentDetails: null,
      transactionId: null,
      bookingId: null,
    }),
}));
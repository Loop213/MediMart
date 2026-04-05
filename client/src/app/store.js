import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import medicineReducer from "../features/medicine/medicineSlice";
import cartReducer from "../features/cart/cartSlice";
import orderReducer from "../features/order/orderSlice";
import adminReducer from "../features/admin/adminSlice";
import themeReducer from "../features/theme/themeSlice";
import footerReducer from "../features/footer/footerSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    medicine: medicineReducer,
    cart: cartReducer,
    order: orderReducer,
    admin: adminReducer,
    theme: themeReducer,
    footer: footerReducer,
  },
});

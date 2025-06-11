// store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserType, CategoryTypes, SubCategoryTypes, AddressDetails, CartItem } from '../utils/Types';

const initialUserState: UserType = {
  _id: "",
  name: "",
  email: "",
  mobile: null,
  avatar: "",
  last_login_date: "",
  status: "",
  address_details: [],
  shopping_cart: [],
  verify_email: false,
  role: ""
};

const initialCategoryState: CategoryTypes[] = [];
const initialSubCategoryState: SubCategoryTypes[] = [];

type Store = {
  theme: string;
  setTheme: () => void;
  isAuthenticate: boolean;
  setIsAuthenticate: (value: boolean) => void;

  user: UserType;
  updateUser: (user: UserType) => void;
  clearUser: () => void;

  category: CategoryTypes[];
  updateCategory: (category: CategoryTypes[]) => void;
  clearCategory: () => void;

  subCategory: SubCategoryTypes[];
  updateSubCategory: (subCategory: SubCategoryTypes[]) => void;
  clearSubCategory: () => void;

  updateUserAddress: (newAddress: AddressDetails) => void;
  updateEditedAddress: (updatedAddress: AddressDetails) => void;
  deleteUserAddressById: (addressId: string) => void;

  updateUserCart: (newCart: CartItem[]) => void;
  clearUserCart: () => void;
};

const useStore = create<Store>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),

      isAuthenticate: false,
      setIsAuthenticate: (value: boolean) => set(() => ({ isAuthenticate: value })),

      user: initialUserState,
      updateUser: (user: UserType) => set(() => ({ user })),
      clearUser: () => set(() => ({ user: initialUserState })),

      category: initialCategoryState,
      updateCategory: (category: CategoryTypes[]) => set(() => ({ category })),
      clearCategory: () => set(() => ({ category: initialCategoryState })),

      subCategory: initialSubCategoryState,
      updateSubCategory: (subCategory: SubCategoryTypes[]) => set(() => ({ subCategory })),
      clearSubCategory: () => set(() => ({ subCategory: initialSubCategoryState })),

      updateUserAddress: (newAddress: AddressDetails) =>
        set((state) => ({
          user: {
            ...state.user,
            address_details: [...state.user.address_details, newAddress]
          }
        })),

      updateEditedAddress: (updatedAddress: AddressDetails) =>
        set((state) => ({
          user: {
            ...state.user,
            address_details: state.user.address_details.map((addr) =>
              addr._id === updatedAddress._id ? updatedAddress : addr
            )
          }
        })),

      deleteUserAddressById: (addressId: string) =>
        set((state) => ({
          user: {
            ...state.user,
            address_details: state.user.address_details.filter((addr) => addr._id !== addressId)
          }
        })),

      updateUserCart: (newCart: CartItem[]) =>
        set((state) => ({
 
          user: {
            ...state.user,
            shopping_cart: newCart,
          }
        })),

      clearUserCart: () =>
        set((state) => ({
          user: {
            ...state.user,
            shopping_cart: [],
          }
        }))
    }),
    {
      name: 'app-store-storage',
    }
  )
);

export default useStore;

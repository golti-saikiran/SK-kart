export interface AddressDetails {
    _id: string;
    name: string;
    address_line: string;
    city: string;
    state: string;
    pincode: number;
    country: string;
    mobile: number;
}

export interface ProductType {
    _id: string;
    productname: string;
    description: string;
    price: number;
    category: CategoryTypes;
    quantity_available: number;
    discount: number;
    product_image_url: string;
    sub_category: SubCategoryTypes;
    rating: number;
    updatedAt?: string;
    __v?: number;
    createdAt?: string;

}

export interface OrderType {
    _id?: string;
    userId: string;
    items_ordered: [{
        product: string;
        quantity: number
    }];
    payment_mode: string;
    address: string;
    total_amount: number;
    ordered_date: string;
    status: string;
    deliver_date: string;
}
export interface CartItem {
    productId: ProductType;
    quantity: number;
}

export interface UserType {
    _id: string;
    name: string;
    email: string;
    mobile: number | null;
    avatar: string;
    last_login_date: string;
    status: string;
    address_details: AddressDetails[];
    shopping_cart: CartItem[]; // Replace with actual type if available
    verify_email: boolean;
    role: string;
}

export interface CategoryTypes {
    _id: string;
    category_image_url: string;
    category_name: string;
}

export interface SubCategoryTypes {
    _id: string;
    subcategory_image_url: string;
    subcategory_name: string;
    category: CategoryTypes;
}
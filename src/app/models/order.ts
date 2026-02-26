export interface OrderItem {
    productId: number; 
    productName: string;
    price: number; 
    quantity: number; 
    subtotal: number; 
} 

export interface Order { 
    id: number; 
    createdAt: string; 
    status: string; 
    total: number; 
    items: OrderItem[];
}
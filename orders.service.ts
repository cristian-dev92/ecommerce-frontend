import { Injectable, inject } from '@angular/core'; 
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs'; 

@Injectable({ providedIn: 'root'}) 
export class OrdersService { 
    
     http = inject(HttpClient); 
     private apiUrl = 'http://localhost:8080/api/orders';
    
    createOrder(order: any): Observable<any> { 
        return this.http.post(this.apiUrl, order); 
    } 
    
    getMyOrders(): Observable<any[]> { 
        return this.http.get<any[]>(this.apiUrl); 
    } 

    updateOrderStatus(orderId: string, status: string): Observable<any> { 
        return this.http.put(`${this.apiUrl}/${orderId}/status`, { status }); 
    }

}
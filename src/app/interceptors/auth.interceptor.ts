import { inject } from '@angular/core'; 
import { HttpInterceptorFn } from '@angular/common/http'; 
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => { 
    const auth = inject(AuthService); 
    const token = auth.getToken(); // asegúrate de tener este método en AuthService 

    console.log('[INTERCEPTOR] URL:', req.url);
    console.log('[INTERCEPTOR] TOKEN:', token);
    
    if (!token) { 
        return next(req); 
    } 
    
    const authReq = req.clone({ 
        setHeaders: { 
            Authorization: `Bearer ${token}`, 
        }, 
    }); 
    
    return next(authReq); 
};
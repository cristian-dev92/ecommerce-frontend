import { inject } from '@angular/core'; 
import { HttpInterceptorFn } from '@angular/common/http'; 
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => { 
    const auth = inject(AuthService); 
    const token = auth.getToken();

    console.log('[INTERCEPTOR] URL:', req.url);
    console.log('[INTERCEPTOR] TOKEN:', token);
    
    if (!token) { 
        console.log('[INTERCEPTOR] No hay token, se envía petición limpia.');
        return next(req); 
    } 

    const cleanToken = token.trim().replace(/^["']|["']$/g, '');

    console.log('[INTERCEPTOR] TOKEN LIMPIO:', cleanToken);
    
    const authReq = req.clone({ 
        setHeaders: { 
            Authorization: `Bearer ${cleanToken}`, 
        }, 
    }); 
    
    return next(authReq); 
};
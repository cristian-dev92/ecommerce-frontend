import { inject } from '@angular/core'; 
import { HttpInterceptorFn } from '@angular/common/http'; 
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => { 
    const auth = inject(AuthService); 
    const token = auth.getToken();

    console.log('[INTERCEPTOR] URL:', req.url);
    
    if (!token) { 
        console.log('[INTERCEPTOR] No hay token, se envía petición limpia.');
        return next(req); 
    } 

    const cleanToken = token
        .replace(/^["']|["']$/g, '') // Quita comillas al principio y al final
        .replace(/\s+/g, '')        // Elimina absolutamente todos los saltos de línea (\n, \r) y espacios internos
        .trim();

    console.log('[INTERCEPTOR] HEADER ENVIADO:', `Bearer ${cleanToken}`);
    
    const authReq = req.clone({ 
        setHeaders: { 
            Authorization: `Bearer ${cleanToken}`, 
        }, 
    }); 
    
    return next(authReq); 
};
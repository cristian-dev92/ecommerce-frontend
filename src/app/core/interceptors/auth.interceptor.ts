import { HttpInterceptorFn } from '@angular/common/http'; 

export const authInterceptor: HttpInterceptorFn = (req, next) => { 
    const token = localStorage.getItem('token'); 
    
    // Rutas públicas: no añadimos token 
    const publicUrls = [ 
        '/api/auth/', 
        '/api/products/', 
        '/swagger-ui/', 
        '/v3/api-docs/' 
    ]; 
    
    const isPublic = publicUrls.some(url => req.url.includes(url));
    
    if (isPublic) { 
        return next(req); 
    } 
    
    // Si hay token, lo añadimos
    if (token) { 
        const authReq = req.clone({ 
            setHeaders: { 
                Authorization: `Bearer ${token}` 
            } 
        }); 
        return next(authReq); 
    } 
    return next(req); 
};
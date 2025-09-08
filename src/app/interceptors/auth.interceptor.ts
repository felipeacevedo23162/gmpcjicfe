import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add headers for API requests to localhost:3003
    if (req.url.includes('localhost:3003')) {
      const authReq = req.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      return next.handle(authReq);
    }
    
    return next.handle(req);
  }
}
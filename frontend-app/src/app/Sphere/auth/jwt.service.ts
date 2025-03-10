import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class JwtService {
    constructor() {}

    // Method to extract the user ID from the token
    getUserIdFromToken(): string | null {
        const token = localStorage.getItem('auth_token');
        if (token) {
            try {
                // Decode the JWT to retrieve the payload
                const decodedToken = JSON.parse(atob(token.split('.')[1]));  // Decodes the JWT
                console.log('Decoded Token:', decodedToken);  // For debugging purposes
                return decodedToken.sub || null;  // Ensure "sub" contains the user ID
            } catch (error) {
                console.error('Error decoding token:', error);
                return null;
            }
        }
        return null;
    }
}

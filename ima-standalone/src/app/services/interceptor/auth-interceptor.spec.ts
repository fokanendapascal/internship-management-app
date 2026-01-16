import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors, HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { authInterceptor } from './auth-interceptor';

describe('authInterceptor', () => {
    let httpMock: HttpTestingController;
    let httpClient: HttpClient;
    let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
        providers: [
            provideHttpClient(withInterceptors([authInterceptor])),
            provideHttpClientTesting(),
            {
            provide: Router,
            useValue: { navigate: jasmine.createSpy('navigate') }
            }
        ]
        });

        httpMock = TestBed.inject(HttpTestingController);
        httpClient = TestBed.inject(HttpClient);
        router = TestBed.inject(Router);

        // On nettoie le localStorage avant chaque test
        localStorage.clear();
    });

    afterEach(() => {
        httpMock.verify(); // Vérifie qu'il n'y a pas de requêtes non résolues
    });

    it('should add an Authorization header when a token is present', () => {
        const mockToken = 'test-token-123';
        localStorage.setItem('accessToken', mockToken);

        httpClient.get('/api/data').subscribe();

        const req = httpMock.expectOne('/api/data');
        expect(req.request.headers.has('Authorization')).toBeTrue();
        expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    });

    it('should NOT add an Authorization header when token is missing', () => {
        httpClient.get('/api/data').subscribe();

        const req = httpMock.expectOne('/api/data');
        expect(req.request.headers.has('Authorization')).toBeFalse();
    });

    it('should handle 401 error: clear token and navigate to login', () => {
        localStorage.setItem('accessToken', 'expired-token');

        httpClient.get('/api/data').subscribe({
        error: (err) => expect(err).toBeTruthy()
        });

        const req = httpMock.expectOne('/api/data');

        // On simule une réponse 401
        req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

        expect(localStorage.getItem('accessToken')).toBeNull();
        expect(router.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { expired: true } });
    });
});

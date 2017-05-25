import { Component }   from '@angular/core';
import { Router }      from '@angular/router';
import { AuthService } from '../../service-module/auth/auth.service';

@Component({
    moduleId: module.id,
    selector: 'ltto-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})
export class LoginComponent {

    error: any;

    constructor(public authService: AuthService, public router: Router) {}


    onSubmit(formData): void {
        if (this.isValid(formData)) {
            this.login(formData.value);
        } else {
            this.error = new Error('Invalid E-mail or password!');
        }
    }

    isValid(formData: any): boolean {
        let bool: boolean = false;
        let vals: {email: string, password: string} = formData.value;
        if (vals) {
            bool = vals.email !== null && vals.password !== null;
        }
        return bool;
    }

    login(cred: any) {
        this.authService.login(cred).then(
                (success) => {
                    let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/home';
                    // Redirect the user
                    console.log('navigate user to -> ', redirect);
                    this.router.navigate([redirect]);
                }
            ).catch(
                (err) => {
                    console.log(err);
                    this.error = err;
                }
            );
    }

}
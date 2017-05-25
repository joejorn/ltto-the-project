import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './service-module/auth/auth.service';
import { UserService } from './service-module/database/user/user.service';
import { IUser } from './service-module/database/user/user.interface';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {

	title :string;
	links: any[];

	user: IUser;

	constructor( private userService: UserService, private authService: AuthService, private router: Router ) {

		this.title = 'ltto.';

		let navLinks = [
			{ label: 'Overview', routerlink: ['overview'], roles: ['master', 'admin', 'reviewer'] },
			{ label: 'Summary', routerlink: ['summary'], roles: ['master', 'reviewer'] },
			{ label: 'Document', routerlink: ['document'], roles: ['master', 'reviewer', 'editor'] },
			{ label: 'Settings', routerlink: ['settings'], roles: ['master', 'admin'] }
			/*{ label: 'Rewards', routerlink: ['rewards'] },*/
			/*{ label: 'Archived', routerlink: ['archived'] },*/
		];

		this.userService.currentUser
			.subscribe(
				usr => {
					this.user = usr;
					let roles = this.userService.getUserRoles();
					this.links = navLinks.filter( link => this.intersected(link.roles, roles) );
				}
			);

	}

	intersected(arr_1: any[], arr_2: any[]): boolean {
		let bool = false;

		for (let elem of arr_2) {
			if (arr_1.indexOf(elem) > -1) {
				bool = true;
				break;
			}
		}

		return bool;
	}

	onLogout(): void {
		this.authService.logout().then(() => { this.router.navigate(['login'])});
	}
}

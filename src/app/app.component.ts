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

	constructor( 
		private userService: UserService, 
		private authService: AuthService, 
		private router: Router
	) {

		this.title = 'ltto.';

		let navLinks = [
			{ label: 'ทั่วไป', routerlink: ['overview'], roles: ['master', 'admin', 'reviewer'], icon: 'dashboard' },
			{ label: 'ยอดรวม', routerlink: ['summary'], roles: ['master', 'reviewer'], icon: 'functions' },
			{ label: 'เอกสาร', routerlink: ['document'], roles: ['master', 'reviewer', 'editor'], icon: 'library_books' },
			// { label: 'ตั้งค่า', routerlink: ['settings'], roles: ['master', 'admin'], icon: 'settings' }
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

import { Component, OnInit }   from '@angular/core';
import { Router, ActivatedRoute }      from '@angular/router';

import { IUser } from '../../service-module/database/user/user.interface';

@Component({
    moduleId: module.id,
    selector: 'ltto-home',
    template: `<div></div>`
})
// export class RootBridgeComponent implements OnInit {
export class HomeComponent {

    constructor(public route: ActivatedRoute, public router: Router) {

        this.route.data.subscribe(
            (data: {user: IUser}) => {
                // redirect to default page according to user role
                let _root = (data.user && data.user.roles['admin']) ? 'overview' : 'document';
                this.router.navigate([_root]);
            }
        );

    }

}
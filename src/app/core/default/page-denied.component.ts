import { Component } from '@angular/core';

@Component({
    selector: 'ltto-page-denied',
    template: `
        <div class="default-text-container">
            <h4 class="default-text title">Permission Denied!</h4>
            <p class="default-text subtitle">You are not allowed to access the document</p>
        </div>
    `,
    styleUrls:[
        './default-page.style.css'
    ]
})

export class PageDeniedComponent {

}
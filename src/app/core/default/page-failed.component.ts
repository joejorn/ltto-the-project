import { Component } from '@angular/core';

@Component({
    selector: 'ltto-page-denied',
    template: `
        <div class="default-text-container">
            <h4 class="default-text title">Page is currently unavailable!</h4>
            <p class="default-text subtitle">Please try again later</p>
        </div>
    `,
    styleUrls:[
        './default-page.style.css'
    ]
})

export class PageFailedComponent {}
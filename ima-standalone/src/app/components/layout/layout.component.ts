import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-layout',
    imports: [
        CommonModule,
        RouterOutlet,
        MenuComponent,
        FooterComponent,
        HeaderComponent,

    ],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.css',
})
export class LayoutComponent {

}

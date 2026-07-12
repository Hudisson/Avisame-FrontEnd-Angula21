import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { NavMenu } from '../nav-menu/nav-menu';
import { Footer } from '../footer/footer';
import { MenuSidebar } from "../menu-sidebar/menu-sidebar";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet,
    NavMenu,
    MenuSidebar,
    Footer
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})

export class Home {

}

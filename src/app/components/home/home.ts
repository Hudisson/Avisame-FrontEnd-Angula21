import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NavMenu } from '../nav-menu/nav-menu';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, CommonModule, NavMenu, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NavLogin } from "../nav-login/nav-login";
import { Footer } from "../footer/footer";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NavLogin, Footer],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {

}

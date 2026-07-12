import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu-sidebar',
  imports: [RouterLink],
  templateUrl: './menu-sidebar.html',
  styleUrl: './menu-sidebar.css',
})

export class MenuSidebar {

  agendaAberta = false;

  toggleAgenda(): void {
    this.agendaAberta = !this.agendaAberta;
  }

}

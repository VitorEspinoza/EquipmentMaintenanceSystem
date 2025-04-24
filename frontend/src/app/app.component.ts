import { Component, HostListener, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { ContentComponent } from './features/layout/main/content.component';
import { SidenavComponent } from './features/layout/sidenav/sidenav.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxMaskDirective, NgxMaskPipe, SidenavComponent, ContentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'EquipmentMaintenanceSystem';
  isSidebarCollapsed = signal<boolean>(false);
  screenWidth = signal<number>(window.innerWidth);

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < 768) {
      this.isSidebarCollapsed.set(true);
    }
  }

  ngOnInit(): void {
    this.isSidebarCollapsed.set(this.screenWidth() < 768);
  }

  changeIsSidebarCollapsed(isSidebarCollapsed: boolean): void {
    this.isSidebarCollapsed.set(isSidebarCollapsed);
  }
}

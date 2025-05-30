import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-content',
  imports: [RouterOutlet, NgClass],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
})
export class ContentComponent {
  isSidebarCollapsed = input.required<boolean>();
  screenWidth = input.required<number>();

  sizeClass = computed(() => {
    const isSidebarCollapsed = this.isSidebarCollapsed();
    if (isSidebarCollapsed) {
      return '';
    }
    return this.screenWidth() > 768 ? 'body-trimmed' : 'body-md-screen';
  });
}

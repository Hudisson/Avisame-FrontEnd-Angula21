import { Directive, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { IconDefinition, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Directive({
  selector: 'input[type="password"][appTogglePassword]',
  standalone: true
})
export class TogglePasswordDirective implements OnInit, OnDestroy {
  private readonly input: HTMLInputElement;
  private readonly wrapper: HTMLElement;
  private readonly button: HTMLButtonElement;
  private readonly originalStyles: {
    width: string;
    boxSizing: string;
    paddingRight: string;
  };
  private removeClickListener?: () => void;
  private removeMouseDownListener?: () => void;
  private visible = false;

  constructor(
    elementRef: ElementRef<HTMLInputElement>,
    private renderer: Renderer2
  ) {
    this.input = elementRef.nativeElement;
    this.originalStyles = {
      width: this.input.style.width,
      boxSizing: this.input.style.boxSizing,
      paddingRight: this.input.style.paddingRight
    };

    this.wrapper = this.renderer.createElement('span');
    this.button = this.renderer.createElement('button');
    this.button.type = 'button';
    this.button.className = 'password-toggle-button';
    this.button.setAttribute('aria-label', 'Mostrar senha');
    this.button.title = 'Mostrar senha';

    const parent = this.renderer.parentNode(this.input);
    this.renderer.insertBefore(parent, this.wrapper, this.input);
    this.renderer.appendChild(this.wrapper, this.input);
    this.renderer.appendChild(this.wrapper, this.button);
  }

  ngOnInit(): void {
    this.renderer.setStyle(this.wrapper, 'position', 'relative');
    this.renderer.setStyle(this.wrapper, 'display', 'block');
    this.renderer.setStyle(this.wrapper, 'width', '100%');

    this.renderer.setStyle(this.input, 'width', '100%');
    this.renderer.setStyle(this.input, 'box-sizing', 'border-box');
    this.renderer.setStyle(this.input, 'padding-right', '44px');

    this.renderer.setStyle(this.button, 'position', 'absolute');
    this.renderer.setStyle(this.button, 'top', '50%');
    this.renderer.setStyle(this.button, 'right', '10px');
    this.renderer.setStyle(this.button, 'transform', 'translateY(-50%)');
    this.renderer.setStyle(this.button, 'display', 'inline-flex');
    this.renderer.setStyle(this.button, 'align-items', 'center');
    this.renderer.setStyle(this.button, 'justify-content', 'center');
    this.renderer.setStyle(this.button, 'padding', '4px');
    this.renderer.setStyle(this.button, 'border', '0');
    this.renderer.setStyle(this.button, 'background', 'transparent');
    this.renderer.setStyle(this.button, 'color', 'inherit');
    this.renderer.setStyle(this.button, 'cursor', 'pointer');
    this.renderer.setStyle(this.button, 'line-height', '1');

    this.renderIcon(faEye);

    this.removeMouseDownListener = this.renderer.listen(
      this.button,
      'mousedown',
      (event: MouseEvent) => event.preventDefault()
    );
    this.removeClickListener = this.renderer.listen(this.button, 'click', () => {
      this.visible = !this.visible;
      this.renderer.setAttribute(this.input, 'type', this.visible ? 'text' : 'password');
      this.button.setAttribute('aria-label', this.visible ? 'Ocultar senha' : 'Mostrar senha');
      this.button.title = this.visible ? 'Ocultar senha' : 'Mostrar senha';
      this.renderIcon(this.visible ? faEyeSlash : faEye);
    });
  }

  ngOnDestroy(): void {
    this.removeClickListener?.();
    this.removeMouseDownListener?.();

    const parent = this.renderer.parentNode(this.wrapper);
    if (parent) {
      this.renderer.insertBefore(parent, this.input, this.wrapper);
      this.renderer.removeChild(parent, this.wrapper);
    }

    this.renderer.setStyle(this.input, 'width', this.originalStyles.width);
    this.renderer.setStyle(this.input, 'box-sizing', this.originalStyles.boxSizing);
    this.renderer.setStyle(this.input, 'padding-right', this.originalStyles.paddingRight);
  }

  private renderIcon(definition: IconDefinition): void {
    while (this.button.firstChild) {
      this.renderer.removeChild(this.button, this.button.firstChild);
    }

    const [width, height, , , iconPaths] = definition.icon;
    const svg = this.renderer.createElement('svg', 'svg');
    this.renderer.setAttribute(svg, 'viewBox', `0 0 ${width} ${height}`);
    this.renderer.setAttribute(svg, 'width', '18');
    this.renderer.setAttribute(svg, 'height', '18');
    this.renderer.setAttribute(svg, 'aria-hidden', 'true');
    this.renderer.setAttribute(svg, 'focusable', 'false');
    this.renderer.setStyle(svg, 'fill', 'currentColor');

    const paths = Array.isArray(iconPaths) ? iconPaths : [iconPaths];
    for (const pathData of paths) {
      const path = this.renderer.createElement('path', 'svg');
      this.renderer.setAttribute(path, 'd', pathData);
      this.renderer.appendChild(svg, path);
    }

    this.renderer.appendChild(this.button, svg);
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'replaceNewlinesWithBr',
  standalone: true,
})
export class ReplaceNewlinesWithBrPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | null | undefined): SafeHtml {
    if (value === null || value === undefined) {
      return '';
    }
    // Substitui \n por <br> e confia no HTML (cuidado se o conteúdo não for confiável)
    return this.sanitizer.bypassSecurityTrustHtml(value.replace(/\n/g, '<br/>'));
  }
}

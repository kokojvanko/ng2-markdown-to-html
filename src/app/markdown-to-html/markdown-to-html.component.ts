import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MarkdownToHtmlService } from './markdown-to-html.service';

import marked from 'marked';
import * as Prism from 'prismjs';

import 'prismjs/prism';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-diff';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-perl';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sass';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-typescript';

@Component({
  selector: 'markdown-to-html, [markdown-to-html]',
  template: '<ng-content></ng-content>',
  moduleId: module.id
})
export class MarkdownToHtmlComponent implements AfterViewInit, OnChanges {
  @Input() src: string;

  private renderer: any;

  constructor(
    public element: ElementRef,
    public mthService: MarkdownToHtmlService,
  ) {

  }

  ngAfterViewInit() {
    if (this.src) {
      this.handleSrc();
    } else {
      this.handleRaw(this.element.nativeElement.innerHTML);
    }
  }

  // SimpleChanges parameter is required for AoT compilation (do not remove)
  ngOnChanges(changes: SimpleChanges) {
    if ('src' in changes) {
      this.handleSrc();
    }
  }

  handleSrc() {
    const extension = this.src
      ? this.src.split('.').splice(-1).join()
      : null;
    return this.mthService.getSource(this.src)
      .subscribe(data => {
        const raw = extension !== 'md'
          ? '```' + extension + '\n' + data + '\n```'
          : data;
        this.handleRaw(raw);
      });
  }

  handleRaw(raw: string) {
    const markdown = this.prepare(raw);
    this.element.nativeElement.innerHTML = marked(markdown);
    Prism.highlightAll(false);
  }

  prepare(raw: string) {
    if (!raw) {
      return '';
    }
    let indentStart: number;
    let isCodeBlock = false;
    return raw.split('\n').map((line: string) => {
      if (this.trimLeft(line).substring(0, 3) === "```") {
        isCodeBlock = !isCodeBlock;
      }
      return isCodeBlock ? line : line.trim();
    }).join('\n');
  }


  private trimLeft(line: string) {
    return line.replace(/^\s+|\s+$/g, '');
  }


}

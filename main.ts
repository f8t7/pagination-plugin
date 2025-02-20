import { App, Plugin, MarkdownView, Editor } from 'obsidian';
import {
  EditorView,
  Decoration,
  DecorationSet,
  WidgetType,
  ViewUpdate
} from '@codemirror/view';
import {
  RangeSetBuilder,
  StateField,
  StateEffect
} from '@codemirror/state';

export default class PaginationPlugin extends Plugin {
  async onload() {
    // 注册装饰状态字段
    this.registerEditorExtension([decorationField]);

    // 使用防抖来避免频繁计算
    this.registerEvent(
      this.app.workspace.on('active-leaf-change', this.debounce(() => {
        const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (markdownView) {
          this.decorateView(markdownView.editor);
        }
      }, 100))
    );
  }

  // 添加防抖函数
  private debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  onunload() {
    // 插件卸载时的清理操作
  }

  decorateView(editor: Editor) {
    try {
      // @ts-expect-error
      const editorView = editor.cm as EditorView;
      if (!editorView) return;

      const viewport = editorView.viewport;
      const pageHeight = 800;
      const maxPages = 50; // 限制最大页数

      const builder = new RangeSetBuilder<Decoration>();
      let currentPos = viewport.from; // 只处理可视区域
      let pageNumber = 1;

      // 添加安全检查
      while (currentPos < viewport.to && pageNumber <= maxPages) {
        try {
          const blockInfo = editorView.lineBlockAt(currentPos);
          let accHeight = 0;
          let pos = currentPos;

          while (pos < viewport.to) {
            const block = editorView.lineBlockAt(pos);
            if (accHeight + block.height > pageHeight) break;
            accHeight += block.height;
            pos = block.to;
          }

          const decoration = Decoration.widget({
            widget: new PageBreakWidget(pageNumber),
            side: 1,
          });

          builder.add(pos, pos, decoration);
          currentPos = pos;
          pageNumber++;

        } catch (e) {
          console.error('Error in pagination calculation:', e);
          break;
        }
      }

      const decorations = builder.finish();
      editorView.dispatch({
        effects: setDecorations.of(decorations)
      });

    } catch (e) {
      console.error('Error in decorateView:', e);
    }
  }
}

class PageBreakWidget extends WidgetType {
  constructor(private pageNumber: number) {
    super();
  }

  toDOM() {
    const div = document.createElement('div');
    div.className = 'pagination-page-end';
    div.setAttribute('data-page', `Page ${this.pageNumber}`);
    return div;
  }

  eq(other: PageBreakWidget): boolean {
    return this.pageNumber === other.pageNumber;
  }

  get estimatedHeight(): number {
    return 24; // 估计的高度，单位为像素
  }

  get lineBreaks(): number {
    return 1; // 分页符占用的行数
  }

  destroy() {
    // 清理工作
  }

  ignoreEvent(): boolean {
    return true;
  }
}

// 定义装饰效果
const setDecorations = StateEffect.define<DecorationSet>();

// 创建装饰状态字段
const decorationField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(decorations, tr) {
    decorations = decorations.map(tr.changes);
    for (let effect of tr.effects) {
      if (effect.is(setDecorations)) {
        decorations = effect.value;
      }
    }
    return decorations;
  },
  provide: field => EditorView.decorations.from(field)
});

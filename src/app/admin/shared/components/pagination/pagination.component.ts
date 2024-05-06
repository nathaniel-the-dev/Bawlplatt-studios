import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent {
    @Input() pagination = {
        current: 1,
        max: 1,
        limit: 5,
    };

    @Output('changePage') pageChanged = new EventEmitter<number>();

    changePage(dir: number) {
        let nextPage = Math.max(
            1,
            Math.min(this.pagination.max, this.pagination.current + dir)
        );

        this.pageChanged.emit(nextPage);
    }
}

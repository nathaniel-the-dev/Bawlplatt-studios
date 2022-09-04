import * as dayjs from 'dayjs';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

    transform(value: Date | string, type: 'date' | 'time'): string {
        return dayjs(value).format(type === 'date' ? 'MMM. D, YYYY' : 'h:mm A');
    }

}

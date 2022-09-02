import * as dayjs from 'dayjs';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

    transform(value: Date | string, format: 'date' | 'time'): string {
        return dayjs(value).format(format === 'date' ? 'MMM. D, YYYY' : 'h:mm A');
    }

}

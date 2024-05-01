import dayjs from 'dayjs';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateTime',
})
export class FormatDatePipe implements PipeTransform {
    transform(value: Date | string, type: 'date' | 'time' | 'both'): string {
        switch (type) {
            case 'date':
                return dayjs(value).format('MMM. D, YYYY');
            case 'time':
                let val =
                    typeof value == 'string' && value.match(/^\d{2}(:\d{2})+/)
                        ? `Jan. 01, 1970 ${value}`
                        : value;
                return dayjs(val).format('h:mm A');

            case 'both':
            default:
                return dayjs(value).format('MMM. D, YYYY h:mm A');
        }
    }
}

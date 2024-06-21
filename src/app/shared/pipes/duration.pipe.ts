import { Pipe, PipeTransform } from '@angular/core';
import humanizeDuration from 'humanize-duration';

@Pipe({
    name: 'duration',
})
export class DurationPipe implements PipeTransform {
    transform(value: number): string {
        if (value < 60) return `${value} mins.`;

        return humanizeDuration(value, {
            units: ['h'],
            // round: true,
            unitMeasures: {
                h: 60,
                m: 1,
            },
        });
    }
}

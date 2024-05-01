import { Pipe, PipeTransform } from '@angular/core';
import humanizeDuration from 'humanize-duration';

@Pipe({
    name: 'duration',
})
export class DurationPipe implements PipeTransform {
    transform(value: number): unknown {
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

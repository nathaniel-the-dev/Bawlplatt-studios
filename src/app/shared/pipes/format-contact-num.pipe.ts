import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatContactNum'
})
export class FormatContactNumPipe implements PipeTransform {

    transform(value: number): unknown {
        return value.toString(10).replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");;
    }

}

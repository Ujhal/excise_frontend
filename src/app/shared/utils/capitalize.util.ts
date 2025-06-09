import { AbstractControl } from '@angular/forms';
import { takeUntil } from 'rxjs';

export class FormUtils {
    static capitalize(control: AbstractControl, destroy$: any) {
      control.valueChanges.pipe(takeUntil(destroy$)).subscribe((value) => {
        if (value) {
          control.setValue(value.toUpperCase(), { emitEvent: false });
        }
      });
    }
}
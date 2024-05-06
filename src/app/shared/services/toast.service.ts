import { Injectable } from '@angular/core';
import Notify from 'simple-notify';
import Swal, { SweetAlertOptions } from 'sweetalert2';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    createToast(
        title: string,
        msg: string,
        status: 'success' | 'error' | 'warning' = 'success'
    ) {
        return new Notify({
            status: status,
            title: title,
            text: msg,
            effect: 'slide',
            speed: 300,
            showIcon: true,
            autoclose: true,
            autotimeout: 3000,
            gap: 20,
            distance: 20,
            type: 3,
            position: 'right top',
        });
    }

    async openConfirmDeleteModal(
        options: Pick<
            SweetAlertOptions,
            'title' | 'text' | 'confirmButtonText' | 'cancelButtonText'
        >
    ) {
        const result = await Swal.fire({
            title: options.title,
            text: options.text,
            showCancelButton: true,
            confirmButtonText: options.confirmButtonText,
            cancelButtonText: options.cancelButtonText,

            color: '#fff',
            background: '#1f2937',
            customClass: 'text-center',
            confirmButtonColor: '#e24141',
        });

        return result.isConfirmed;
    }

    async openPasswordConfirmModal() {
        const { value: password } = await Swal.fire({
            title: 'Confirm account deletion',
            input: 'password',
            inputLabel: 'Enter your password',
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to write something!';
                } else return null;
            },

            showCancelButton: true,

            inputAttributes: {
                autocapitalize: 'off',
                autocorrect: 'off',
            },

            color: '#fff',
            background: '#1f2937',
            customClass: 'text-center',
            confirmButtonColor: '#e24141',
        });

        return password;
    }

    constructor() {}
}

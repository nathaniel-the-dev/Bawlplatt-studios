import { AfterViewInit, Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.page.html',
    styleUrls: ['./checkout.page.css'],
})
export class CheckoutPage implements AfterViewInit {
    constructor() {}

    ngAfterViewInit(): void {
        const script = document.createElement('script');
        let braintreeSDK = `
       let submitButton = document.querySelector('#submit-button');

    braintree.dropin.create({
        // Insert your tokenization key here
        authorization: '${environment.BRAINTREE_SDK_TOKEN}',
        container: '#dropin-container'
    }, function (createErr, instance) {
        submitButton.addEventListener('click', function () {
            instance.requestPaymentMethod(async function (requestPaymentMethodErr, payload) {
                // When the user clicks on the 'Submit payment' button this code will send the
                // encrypted payment information in a variable called a payment method nonce
                const result = await fetch('/checkout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 'paymentMethodNonce': payload.nonce })
                });

                // Tear down the Drop-in UI
                instance.teardown(function (teardownErr) {
                    if (teardownErr) {
                        console.error('Could not tear down Drop-in UI!');
                    } else {
                        console.info('Drop-in UI has been torn down!');
                        // Remove the 'Submit payment' button
                        submitButton.remove();
                    }
                });

                const checkoutMessage = document.getElementById('checkout-message');
                if (result.success) {
                    checkoutMessage.innerHTML = \`
                <h1>Success</h1><p>Your Drop-in UI is working! Check your <a href="https://sandbox.braintreegateway.com/login">sandbox Control Panel</a> for your test transactions.</p><p>Refresh to try another transaction.</p>
                \`;
                } else {
                    console.log(result);
                    checkoutMessage.innerHTML = '<h1>Error</h1><p>Check your console.</p>';
                }
            });
        });
    });`;

        script.innerHTML = braintreeSDK;
        document.body.appendChild(script);
    }
}

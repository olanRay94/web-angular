import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { customizationAnimations } from '@customization/animations';
import { CustomizationAlertType } from '@customization/components/alert';
import { EmployeeService } from 'app/services/employee.service';
import { SnackBarService } from 'app/services/snackbar.service';
import { StorageService } from 'app/services/storage.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [customizationAnimations]
})
export class LoginComponent implements OnInit {

    @ViewChild('logInNgForm') logInNgForm: NgForm;

    alert: { type: CustomizationAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    logInForm: FormGroup;
    showAlert: boolean = false;

    account = {
        email: 'testing@example.com',
        password: 'whateveryouwant'
    };

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _storageService: StorageService,
        private _snackBarService: SnackBarService,
        private _employeeService: EmployeeService,
        private router: Router
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.logInForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void {
        // Return if the form is invalid
        if (this.logInForm.invalid) {
            return;
        }

        // Disable the form
        this.logInForm.disable();

        // Hide the alert
        this.showAlert = false;

        setTimeout(() => {
            if ((this.logInForm.get('email').value !== this.account.email) ||
                (this.logInForm.get('password').value !== this.account.password)) {
                // Re-enable the form
                this.logInForm.enable();

                // Reset the form
                this.logInNgForm.resetForm();

                // Set the alert
                this.alert = {
                    type: 'error',
                    message: 'Wrong email or password'
                };

                // Show the alert
                this.showAlert = true;

                this._changeDetectorRef.markForCheck();
            } else {
                if (!this._employeeService.employees) {
                    this._employeeService.initData();
                }
                this._storageService.saveAuthUser(this.logInForm.value);
                this.router.navigateByUrl('/employee');
                this._snackBarService.presentSnackBar('You are logged in successfully!');
            }
        }, 800);

    }

}

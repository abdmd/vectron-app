import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'change-password.component.html' })
export class ChangePasswordComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        // this.id = this.route.snapshot.params['id'];

        // password not required in edit mode
        const passwordValidators = [Validators.minLength(6)];

        passwordValidators.push(Validators.required);        

        this.form = this.formBuilder.group({
            current_password: ['', passwordValidators],
            password: ['', passwordValidators],
            password_confirmation: ['', passwordValidators],
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.changePassword();
    }

    private changePassword() {
        this.accountService.changePassword(this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Password changed successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['..', { relativeTo: this.route }]);
                    this.loading = false;
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
import { AuthService } from './../../services/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

    user!: any;
    id!: string;
    updateInfosForm!: FormGroup;
    updateInfos: boolean = false;
    fileUrl!: Observable<string>;
    fileUploaded: boolean;
    fileIsUploading: boolean;
    persentage!: any;
    isAdmin: boolean;

    constructor(
        private angularFireStorage: AngularFireStorage,
        private angularFirestore: AngularFirestore,
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location
    ) {
        this.fileIsUploading = false;
        this.fileUploaded = false;
        this.isAdmin = false;
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'];
        this.angularFirestore.collection('users').doc(this.id).valueChanges()
            .subscribe(res => this.user = res);
    }

    onSubmit() {
        this.user = this.updateInfosForm.value;
        if (this.fileIsUploading || this.fileUploaded) {
            this.user.imageURL = this.fileUrl;
            return this.angularFirestore.collection("users").doc(this.id)
                .update(this.user).then(() => {
                    this.updateInfos = false;
                    this.updateInfosForm.reset();
                    this.fileUploaded = false;
                });
        } else {
            return this.angularFirestore.collection("users").doc(this.id)
                .update(this.user).then(() => {
                    this.updateInfos = false;
                    this.updateInfosForm.reset();
                    this.fileUploaded = false;
                });
        }
    }

    detectFiles(event: any) {
        this.fileIsUploading = true;
        let name = `${this.user.firstName}-${this.user.familyName}'s profile picture (profile-id=${this.id})`;
        const file = event.target.files[0];
        const filePath = `profile-pictures/${name}`;
        const fileRef = this.angularFireStorage.ref(filePath);
        const task = this.angularFireStorage.upload(filePath, file);
        this.persentage = task.percentageChanges();
        task.snapshotChanges().pipe(finalize(() => {
            this.fileUrl = fileRef.getDownloadURL();
            this.fileUrl.subscribe((url: any) => {
                if (url) {
                    this.fileUrl = url;
                    this.fileIsUploading = false;
                    this.fileUploaded = true;
                }
            });
        })).subscribe();
    }

    onUpdateBTN() {
        if (this.updateInfos === true) {
            this.updateInfos = false;
            this.updateInfosForm.reset();
            this.fileUploaded = false;
        } else {
            this.updateInfos = true;
            this.updateInfosForm = this.formBuilder.group({
                firstName: [this.user.firstName, [Validators.required, Validators.pattern(/.*\S.*/)]],
                familyName: [this.user.familyName, [Validators.required, Validators.pattern(/.*\S.*/)]],
                phoneNumber: [this.user.phoneNumber, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
                email: [this.user.email, [Validators.required, Validators.email]]
            });
        }
    }

    deleteUser() {
        if (confirm("By deleting your account, you will lose all your information.\nIf you are sure about this, press: OK.\nOtherwise press: Cancel"))
            this.authService.deleteUser();
    }

}

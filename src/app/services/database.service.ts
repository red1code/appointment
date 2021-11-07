import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    constructor(private angularFirestore: AngularFirestore) { }

    // patients data
    createNewPatient(data: any) {
        return new Promise<any>(() => {
            this.angularFirestore.collection('patientsList').add(data);
        });
    }

    getPatientsList() {
        return this.angularFirestore.collection('patientsList', ref => {
            return ref.orderBy('created_at')
        }).snapshotChanges();
    }

    updatePatient(id: string, patient: any) {
        return new Promise(() => {
            this.angularFirestore.collection("patientsList").doc(id).update(patient);
        })
    }

    deletePatient(data: any) {
        if (confirm(`Are you sure You want to delete "${data.fullName}"?`)) {
            this.angularFirestore.collection("patientsList").doc(data.rdvID).delete();
        }
    }

    // users data
    getUsersList() {
        return this.angularFirestore.collection('users').snapshotChanges();
    }

    exportToCsv(filename: string, rows: object[]) {
        if (!rows || !rows.length) {
            return;
        }
        const separator = ',';
        const keys = Object.keys(rows[0]);
        const csvContent =
            keys.join(separator) +
            '\n' +
            rows.map((row: any) => {
                return keys.map(k => {
                    let cell = row[k] === null || row[k] === undefined ? '' : row[k];
                    cell = cell instanceof Date
                        ? cell.toLocaleString()
                        : cell.toString().replace(/"/g, '""');
                    if (cell.search(/("|,|\n)/g) >= 0) {
                        cell = `"${cell}"`;
                    }
                    return cell;
                }).join(separator);
            }).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            // Browsers that support HTML5 download attribute
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

    }

}

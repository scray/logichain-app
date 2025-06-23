import { Injectable } from '@angular/core';
import { Document } from './shared/models/document';

@Injectable({
    providedIn: 'root',
})
export class DocumentService {
    private baseUrl = 'http://localhost:8080/tour-app/tours';

    /**
     * Berechnet SHA256 Hash einer Datei im Browser
     */
    async calculateSHA256(file: File): Promise<string> {
        const buffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    /**
     * Lädt ein Dokument hoch
     */
    async uploadDocument(userId: string, tourId: string, file: File): Promise<Document> {
        // Validierung
        this.validateFile(file);

        // Hash berechnen
        const hash = await this.calculateSHA256(file);

        // FormData erstellen
        const formData = new FormData();
        formData.append('file', file);
        formData.append('hash', hash);

        const response = await fetch(`${this.baseUrl}/${userId}/${tourId}/documents`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            if (error.type === 'USER_NOT_AUTHORIZED') {
                throw new Error('AUTHORIZATION_ERROR: ' + error.message);
            }
            throw new Error(error.message || 'Upload fehlgeschlagen');
        }

        return await response.json();
    }

    /**
     * Lädt die Liste der Dokumente einer Tour
     */
    async getDocuments(userId: string, tourId: string): Promise<Document[]> {
        const response = await fetch(`${this.baseUrl}/${userId}/${tourId}/documents`);

        if (!response.ok) {
            throw new Error('Fehler beim Laden der Dokumente');
        }

        return await response.json();
    }

    /**
     * Lädt ein Dokument herunter
     */
    async downloadDocument(userId: string, tourId: string, fileName: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${userId}/${tourId}/documents/${encodeURIComponent(fileName)}`);

        if (!response.ok) {
            throw new Error('Fehler beim Download');
        }

        // Blob erstellen und Download triggern
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }

    /**
     * Löscht ein Dokument
     */
    async deleteDocument(userId: string, tourId: string, fileName: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${userId}/${tourId}/documents/${encodeURIComponent(fileName)}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const error = await response.json();
            if (error.type === 'USER_NOT_AUTHORIZED') {
                throw new Error('AUTHORIZATION_ERROR: ' + error.message);
            }
            throw new Error(error.message || 'Löschen fehlgeschlagen');
        }
    }

    /**
     * Validiert eine Datei vor dem Upload
     */
    private validateFile(file: File): void {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = [
            'application/pdf',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv',
            'application/csv'
        ];
        const allowedExtensions = ['.pdf', '.xls', '.xlsx', '.csv'];

        // Größe prüfen
        if (file.size > maxSize) {
            throw new Error('Datei ist zu groß. Maximum: 10MB');
        }

        // Typ prüfen
        if (!allowedTypes.includes(file.type)) {
            // Fallback: Extension prüfen
            const extension = '.' + file.name.split('.').pop()?.toLowerCase();
            if (!allowedExtensions.includes(extension)) {
                throw new Error('Dateityp nicht erlaubt. Erlaubt sind: PDF, Excel, CSV');
            }
        }
    }

    /**
     * Formatiert Dateigröße für Anzeige
     */
    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}
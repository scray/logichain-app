import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DocumentService } from '../../../document.service';
import { Document } from '../../models/document';

@Component({
    selector: 'app-document-upload',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatProgressBarModule, MatSnackBarModule],
    template: `
        <div
                class="upload-area"
                [class.drag-over]="isDragging"
                (drop)="onDrop($event)"
                (dragover)="onDragOver($event)"
                (dragleave)="onDragLeave($event)"
        >
            <mat-icon class="upload-icon">cloud_upload</mat-icon>
            <p class="upload-text">
                Dateien hier ablegen oder
                <label class="browse-link">
                    durchsuchen
                    <input
                            type="file"
                            #fileInput
                            (change)="onFileSelected($event)"
                            accept=".pdf,.xls,.xlsx,.csv"
                            style="display: none"
                    />
                </label>
            </p>
            <p class="upload-hint">PDF, Excel oder CSV • Max. 10MB</p>
        </div>

        <div class="upload-progress" *ngIf="isUploading">
            <div class="progress-item">
                <span class="progress-filename">{{ uploadingFileName }}</span>
                <mat-progress-bar mode="indeterminate"></mat-progress-bar>
            </div>
        </div>

        <div class="documents-list" *ngIf="documents.length > 0">
            <div class="document-item" *ngFor="let doc of documents">
                <div class="doc-info">
                    <mat-icon class="doc-icon" [class]="getFileIconClass(doc.fileName)">
                        {{ getFileIcon(doc.fileName) }}
                    </mat-icon>
                    <div class="doc-details">
                        <span class="doc-name">{{ doc.fileName }}</span>
                        <span class="doc-meta">
              {{ formatFileSize(doc.fileSize) }} •
                            {{ formatDate(doc.uploadDate) }}
            </span>
                    </div>
                </div>
                <div class="doc-actions">
                    <button
                            class="action-btn download"
                            (click)="downloadDocument(doc)"
                            title="Download"
                            [disabled]="isDownloading"
                    >
                        <mat-icon>download</mat-icon>
                    </button>
                    <button
                            class="action-btn verify"
                            (click)="verifyDocument(doc)"
                            title="Hash verifizieren"
                    >
                        <mat-icon>verified</mat-icon>
                    </button>
                    <button
                            class="action-btn delete"
                            (click)="deleteDocument(doc)"
                            title="Löschen"
                            [disabled]="isDeleting"
                    >
                        <mat-icon>delete</mat-icon>
                    </button>
                </div>
            </div>
        </div>

        <div class="empty-state" *ngIf="documents.length === 0 && !isUploading">
            <mat-icon>insert_drive_file</mat-icon>
            <p>Noch keine Dokumente hochgeladen</p>
        </div>
    `,
    styleUrls: ['./document-upload.component.css']
})
export class DocumentUploadComponent {
    @Input() tourId!: string;
    @Input() userId: string = 'alice';
    @Input() documents: Document[] = [];
    @Output() documentUploaded = new EventEmitter<Document>();
    @Output() documentDeleted = new EventEmitter<string>();

    isDragging = false;
    isUploading = false;
    isDownloading = false;
    isDeleting = false;
    uploadingFileName = '';

    constructor(
        private documentService: DocumentService,
        private snackBar: MatSnackBar
    ) {}

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = true;
    }

    onDragLeave(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = false;
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = false;

        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            this.handleFile(files[0]);
        }
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.handleFile(input.files[0]);
            input.value = ''; // Reset input
        }
    }

    private async handleFile(file: File) {
        try {
            // Validierung erfolgt im Service
            this.documentService['validateFile'](file);

            this.isUploading = true;
            this.uploadingFileName = file.name;

            const document = await this.documentService.uploadDocument(
                this.userId,
                this.tourId,
                file
            );

            this.snackBar.open('Dokument erfolgreich hochgeladen!', 'OK', {
                duration: 3000,
                panelClass: ['success-snackbar']
            });

            this.documentUploaded.emit(document);
            this.documents = [...this.documents, document];

        } catch (error: any) {
            let errorMessage = 'Fehler beim Upload';

            if (error.message) {
                if (error.message.includes('AUTHORIZATION_ERROR:')) {
                    errorMessage = error.message.replace('AUTHORIZATION_ERROR: ', '');
                } else {
                    errorMessage = error.message;
                }
            }

            this.snackBar.open(errorMessage, 'OK', {
                duration: 5000,
                panelClass: ['error-snackbar']
            });
        } finally {
            this.isUploading = false;
            this.uploadingFileName = '';
        }
    }

    async downloadDocument(doc: Document) {
        try {
            this.isDownloading = true;
            await this.documentService.downloadDocument(this.userId, this.tourId, doc.fileName);

            this.snackBar.open('Download gestartet', 'OK', {
                duration: 2000
            });
        } catch (error) {
            this.snackBar.open('Fehler beim Download', 'OK', {
                duration: 3000,
                panelClass: ['error-snackbar']
            });
        } finally {
            this.isDownloading = false;
        }
    }

    async deleteDocument(doc: Document) {
        if (!confirm(`Möchten Sie "${doc.fileName}" wirklich löschen?`)) {
            return;
        }

        try {
            this.isDeleting = true;
            await this.documentService.deleteDocument(this.userId, this.tourId, doc.fileName);

            this.documents = this.documents.filter(d => d.fileName !== doc.fileName);
            this.documentDeleted.emit(doc.fileName);

            this.snackBar.open('Dokument gelöscht', 'OK', {
                duration: 3000
            });
        } catch (error: any) {
            let errorMessage = 'Fehler beim Löschen';

            if (error.message && error.message.includes('AUTHORIZATION_ERROR:')) {
                errorMessage = error.message.replace('AUTHORIZATION_ERROR: ', '');
            }

            this.snackBar.open(errorMessage, 'OK', {
                duration: 3000,
                panelClass: ['error-snackbar']
            });
        } finally {
            this.isDeleting = false;
        }
    }

    async verifyDocument(doc: Document) {
        this.snackBar.open(`Hash: ${doc.hash.substring(0, 16)}...`, 'OK', {
            duration: 5000
        });
    }

    getFileIcon(fileName: string): string {
        const extension = fileName.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'pdf': return 'picture_as_pdf';
            case 'xls':
            case 'xlsx': return 'table_chart';
            case 'csv': return 'view_list';
            default: return 'insert_drive_file';
        }
    }

    getFileIconClass(fileName: string): string {
        const extension = fileName.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'pdf': return 'pdf-icon';
            case 'xls':
            case 'xlsx': return 'excel-icon';
            case 'csv': return 'csv-icon';
            default: return '';
        }
    }

    formatFileSize(bytes: number): string {
        return this.documentService.formatFileSize(bytes);
    }

    formatDate(timestamp: number): string {
        return new Date(timestamp * 1000).toLocaleDateString('de-DE');
    }
}
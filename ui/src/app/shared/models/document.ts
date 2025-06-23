export interface Document {
    fileName: string;
    hash: string;
    uploadDate: number;
    s3Key: string;
    fileSize: number;
    contentType: string;
}
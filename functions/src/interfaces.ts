export interface Report {
    propertyId: string;
    userId: string;
    addressLine1: string;
    city: string;
    state: string;
    postCode: string;
    isLocked: boolean;
    createdAt: Date;
    updatedAt: Date;
    pdfUrl: string;
    spaces: string[];
    local_images: [];
    spaceCompleted: number;
    status: string; // "draft", "completed", "pdf_generated"
    paymentStatus: string; // "paid", "unpaid"
}

export interface Property {
    addressLine1: string;
    city: string;
    state: string;
    postCode: string;
    createdAt: Date;
    createdBy: string; // userId
}

export interface User {
    phoneNumber: string;
    uid: string; // token
    firstName: string;
    lastName: string;
    createdAt: Date;
}

export interface Space {
    name: string;
    reportId: string;
    issues: [];
    createdAt: Date;
}

export interface Image {
    uploadTimestamp: Date;
    uploadStatus: string; // e.g., "pending", "in_progress", "complete", "failed"
    reportId: string;
    spaceId: string;
    storagePath: string; // Download url link for everyone
    filename: string;
    type: string; // e.g., "general" or "issue"
    issue: string; // e.g., "walls", "windows" ...
    createdAt: string;
    uploadedAt: string;
}

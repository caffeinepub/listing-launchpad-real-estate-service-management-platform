import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ServiceRequest {
    id: string;
    status: string;
    title: string;
    urgency: string;
    createdAt: bigint;
    createdBy: Principal;
    description: string;
    propertyId: string;
    updatedAt: bigint;
    photos: Array<string>;
}
export interface Property {
    id: string;
    zip: string;
    owner: Principal;
    city: string;
    state: string;
    address: string;
    timestamp: bigint;
}
export interface Plan {
    id: string;
    features: Array<string>;
    name: string;
    description: string;
    monthlyPrice: bigint;
}
export interface ContactForm {
    id: string;
    name: string;
    submittedAt: bigint;
    email: string;
    message: string;
    phone: string;
}
export interface UserProfile {
    name: string;
    role: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProperty(id: string, address: string, city: string, state: string, zip: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createServiceRequest(propertyId: string, title: string, description: string, urgency: string): Promise<string>;
    getAllContactForms(): Promise<Array<ContactForm>>;
    getAllPlans(): Promise<Array<Plan>>;
    getAllProperties(): Promise<Array<Property>>;
    getAllServiceRequests(): Promise<Array<ServiceRequest>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactForm(id: string): Promise<ContactForm>;
    getPlanById(planId: string): Promise<Plan>;
    getProperty(id: string): Promise<Property>;
    getServiceRequest(id: string): Promise<ServiceRequest>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitContactForm(name: string, email: string, phone: string, message: string): Promise<string>;
    updateServiceRequestStatus(requestId: string, newStatus: string): Promise<void>;
    uploadPhoto(requestId: string, blobId: string): Promise<void>;
}

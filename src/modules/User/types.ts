// Admin-specific types for user management

export interface AdminUser {
    id: string;
    name: string;
    last_name: string;
    phone: string;
    role: 'admin' | 'customer';
    profile_image: string | null;
    country: string;
    city: string;
    address: string;
    created_at: string;
    updated_at: string;
    email: string; // From auth.users
}

export interface UserTableRow {
    id: string;
    profileImage: string | null;
    fullName: string;
    email: string;
    phone: string;
    role: 'admin' | 'customer';
    country: string;
    city: string;
    address: string;
    createdAt: string;
}

export interface UpdateUserData {
    name?: string;
    last_name?: string;
    phone?: string;
    role?: 'admin' | 'customer';
    country?: string;
    city?: string;
    address?: string;
    profile_image?: string;
}

export interface UserPurchase {
    id: number;
    excursion_id: number;
    total_amount: number;
    amount_paid: number;
    remaining_amount: number;
    status: string;
    created_at: string;
    excursion: {
        id: number;
        title: string;
        start_date: string;
        end_date: string;
    };
    payments: Array<{
        id: number;
        amount: number;
        status: string;
        created_at: string;
    }>;
}

export interface Client {
  id?: string;
  name: string;
  email: string;
  phone: string;
  phoneType?: 'mobile' | 'home' | 'work';
  cpf: string;
  address: string;
  birthDate: string; // ISO string YYYY-MM-DD
  status: 'active' | 'inactive' | 'pending';
  isVerified?: boolean;
  avatarUrl?: string;
  createdAt: any; // Firestore Timestamp
  updatedAt: any;
  userId: string; // To link client to the user who created it (optional, but good for multi-tenancy)
}

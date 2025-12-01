'use client'

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Users } from 'lucide-react';
import { UsersDataTable } from '@/modules/User/Components/UsersDataTable';
import { EditUserDialog } from '@/modules/User/Components/EditUserDialog';
import { UserDetailSheet } from '@/modules/User/Components/UserDetailSheet';
import type { AdminUser, UserTableRow } from '@/modules/User/types';

export default function AdminUsersPage() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<UserTableRow[]>([]);

    // Edit dialog state
    const [editOpen, setEditOpen] = useState(false);
    const [editUserId, setEditUserId] = useState<string | null>(null);

    // Detail sheet state
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailUserId, setDetailUserId] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/users');

            if (!response.ok) {
                throw new Error('Error al cargar usuarios');
            }

            const data = await response.json();

            // Transform to table rows
            const tableData: UserTableRow[] = (data.users || []).map((u: AdminUser) => ({
                id: u.id,
                profileImage: u.profile_image,
                fullName: `${u.name || ''} ${u.last_name || ''}`.trim() || 'Sin nombre',
                email: u.email || '',
                phone: u.phone || '',
                role: u.role as 'admin' | 'customer',
                country: u.country || '',
                city: u.city || '',
                address: u.address || '',
                createdAt: u.created_at,
            }));

            setUsers(tableData);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    const handleEditUser = (userId: string) => {
        setEditUserId(userId);
        setEditOpen(true);
    };

    const handleViewPurchases = (userId: string) => {
        setDetailUserId(userId);
        setDetailOpen(true);
    };

    const handleEditSuccess = () => {
        fetchUsers(); // Refresh list
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 mx-auto text-[#256EFF] animate-spin mb-4" />
                    <p className="text-[#102542]/60">Cargando usuarios...</p>
                </div>
            </div>
        );
    }

    const adminCount = users.filter(u => u.role === 'admin').length;
    const customerCount = users.filter(u => u.role === 'customer').length;

    return (
        <div className="container mx-auto py-8 px-4">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-[#256EFF]/10 to-[#07BEB8]/10 rounded-lg">
                                <Users className="w-6 h-6 text-[#256EFF]" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl text-[#102542]">
                                    Gestión de Usuarios
                                </CardTitle>
                                <CardDescription>
                                    Administrar usuarios del sistema
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex gap-4 text-sm">
                            <div className="text-center">
                                <div className="font-bold text-xl text-[#256EFF]">{users.length}</div>
                                <div className="text-[#102542]/60">Total</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-xl text-purple-600">{adminCount}</div>
                                <div className="text-[#102542]/60">Admins</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-xl text-blue-600">{customerCount}</div>
                                <div className="text-[#102542]/60">Clientes</div>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <UsersDataTable
                        data={users}
                        onEditUser={handleEditUser}
                        onViewPurchases={handleViewPurchases}
                    />
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <EditUserDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                userId={editUserId}
                onSuccess={handleEditSuccess}
            />

            {/* Detail Sheet */}
            <UserDetailSheet
                open={detailOpen}
                onOpenChange={setDetailOpen}
                userId={detailUserId}
            />
        </div>
    );
}

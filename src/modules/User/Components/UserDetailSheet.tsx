'use client'

import { useEffect, useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import UserInfo from '../Views/UserInfo';
import type { AdminUser, UserPurchase } from '../types';

interface UserDetailSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string | null;
}

export function UserDetailSheet({
    open,
    onOpenChange,
    userId,
}: UserDetailSheetProps) {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<AdminUser | null>(null);
    const [purchases, setPurchases] = useState<UserPurchase[]>([]);

    useEffect(() => {
        if (open && userId) {
            fetchDetails();
        }
    }, [open, userId]);

    const fetchDetails = async () => {
        if (!userId) return;

        setLoading(true);
        try {
            // Fetch user
            const userRes = await fetch(`/api/admin/users/${userId}`);
            if (userRes.ok) {
                const data = await userRes.json();
                setUser(data.user);
            }

            // Fetch purchases
            const purchasesRes = await fetch(`/api/admin/users/${userId}/purchases`);
            if (purchasesRes.ok) {
                const data = await purchasesRes.json();
                setPurchases(data.purchases || []);
            }
        } catch (error) {
            console.error('Error fetching details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user && loading) {
        return (
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 animate-spin text-[#256EFF]" />
                    </div>
                </SheetContent>
            </Sheet>
        );
    }

    if (!user) return null;

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        reserved: 'bg-blue-100 text-blue-800',
        paid: 'bg-green-100 text-green-800',
        cancelled: 'bg-gray-100 text-gray-800',
        refunded: 'bg-purple-100 text-purple-800',
        expired: 'bg-red-100 text-red-800',
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Detalles del Usuario</SheetTitle>
                    <SheetDescription>
                        {user.email}
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 mt-6">
                    {/* User Info Component Reused */}
                    <UserInfo />

                    <Separator />

                    {/* Purchases Section */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">
                            Compras ({purchases.length})
                        </h3>

                        {purchases.length === 0 ? (
                            <div className="text-center py-8 text-[#102542]/60">
                                No tiene compras registradas
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {purchases.map((purchase) => (
                                    <div
                                        key={purchase.id}
                                        className="border rounded-lg p-4 space-y-2"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="font-medium text-[#102542]">
                                                    {purchase.excursion.title}
                                                </div>
                                                <div className="text-xs text-[#102542]/60">
                                                    ID: #{purchase.id}
                                                </div>
                                            </div>
                                            <Badge className={statusColors[purchase.status as keyof typeof statusColors] || ''}>
                                                {purchase.status}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <span className="text-[#102542]/60">Total: </span>
                                                <span className="font-semibold">${purchase.total_amount.toFixed(2)}</span>
                                            </div>
                                            <div>
                                                <span className="text-[#102542]/60">Pagado: </span>
                                                <span className="font-semibold text-green-600">${purchase.amount_paid.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <div className="text-xs text-[#102542]/60">
                                            Fecha: {new Date(purchase.created_at).toLocaleDateString('es-MX')}
                                        </div>

                                        {purchase.payments && purchase.payments.length > 0 && (
                                            <div className="mt-2 pt-2 border-t">
                                                <div className="text-xs font-semibold mb-1">Pagos:</div>
                                                <div className="space-y-1">
                                                    {purchase.payments.map((payment) => (
                                                        <div key={payment.id} className="text-xs flex justify-between">
                                                            <span>${payment.amount.toFixed(2)}</span>
                                                            <span className="text-[#102542]/60">{payment.status}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

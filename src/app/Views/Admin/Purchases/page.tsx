'use client'

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ShoppingCart } from 'lucide-react';
import { PurchasesDataTable } from '@/modules/Purchases/Components/PurchasesDataTable';
import { PurchaseDetailSheet } from '@/modules/Purchases/Components/PurchaseDetailSheet';
import { ManualPaymentDialog } from '@/modules/Purchases/Components/ManualPaymentDialog';
import type { AdminPurchase, PurchaseTableRow } from '@/modules/Purchases/types';

export default function AdminPurchasesPage() {
    const [loading, setLoading] = useState(true);
    const [purchases, setPurchases] = useState<PurchaseTableRow[]>([]);

    // Detail sheet state
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedPurchaseId, setSelectedPurchaseId] = useState<number | null>(null);

    // Manual payment dialog state
    const [manualPaymentOpen, setManualPaymentOpen] = useState(false);
    const [manualPaymentPurchaseId, setManualPaymentPurchaseId] = useState<number | null>(null);
    const [manualPaymentRemaining, setManualPaymentRemaining] = useState(0);

    useEffect(() => {
        fetchPurchases();
    }, []);

    const fetchPurchases = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/purchases');

            if (!response.ok) {
                throw new Error('Error al cargar compras');
            }

            const data = await response.json();

            // Transform to table rows
            const tableData: PurchaseTableRow[] = (data.purchases || []).map((p: AdminPurchase) => ({
                id: p.id,
                userName: `${p.user?.name || ''} ${p.user?.last_name || ''}`.trim() || 'Sin nombre',
                userEmail: p.user?.email || '',
                excursionTitle: p.excursion?.title || 'Sin título',
                totalAmount: p.total_amount,
                amountPaid: p.amount_paid,
                remainingAmount: p.remaining_amount,
                numberOfPeople: p.number_of_people || 1,
                status: p.status,
                refundStatus: p.refund_status,
                expiresAt: p.expires_at,
                createdAt: p.created_at,
            }));

            setPurchases(tableData);
        } catch (error) {
            console.error('Error fetching purchases:', error);
            alert('Error al cargar las compras');
        } finally {
            setLoading(false);
        }
    };

    // Handlers
    const handleViewDetails = (id: number) => {
        setSelectedPurchaseId(id);
        setDetailOpen(true);
    };

    const handleViewPayments = (id: number) => {
        // Open detail sheet which shows payments
        setSelectedPurchaseId(id);
        setDetailOpen(true);
    };

    const handleChangeStatus = async (id: number) => {
        const newStatus = prompt('Nuevo estado (pending/reserved/paid/cancelled/refunded/expired):');
        if (!newStatus) return;

        try {
            const response = await fetch(`/api/admin/purchases/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                alert('Estado actualizado');
                fetchPurchases();
            } else {
                alert('Error al actualizar estado');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al actualizar estado');
        }
    };

    const handleManualPayment = (id: number) => {
        const purchase = purchases.find(p => p.id === id);
        if (!purchase) return;

        setManualPaymentPurchaseId(id);
        setManualPaymentRemaining(purchase.remainingAmount);
        setManualPaymentOpen(true);
    };

    const handleCancel = async (id: number) => {
        if (!confirm(`¿Cancelar compra #${id}?`)) return;

        try {
            const response = await fetch(`/api/admin/purchases/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'cancelled' }),
            });

            if (response.ok) {
                alert('Compra cancelada');
                fetchPurchases();
            } else {
                alert('Error al cancelar');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al cancelar');
        }
    };

    const handleRefund = async (id: number) => {
        if (!confirm(`¿Reembolsar compra #${id}?`)) return;

        try {
            const response = await fetch(`/api/admin/purchases/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'refunded',
                    refund_status: 'refunded'
                }),
            });

            if (response.ok) {
                alert('Compra reembolsada');
                fetchPurchases();
            } else {
                alert('Error al reembolsar');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al reembolsar');
        }
    };

    const handleExtendExpiration = async (id: number) => {
        const newDate = prompt('Nueva fecha de expiración (YYYY-MM-DD HH:MM:SS):');
        if (!newDate) return;

        try {
            const response = await fetch(`/api/admin/purchases/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ expires_at: newDate }),
            });

            if (response.ok) {
                alert('Expiración extendida');
                fetchPurchases();
            } else {
                alert('Error al extender expiración');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al extender expiración');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm(`¿Eliminar compra #${id}? Solo si no tiene pagos.`)) return;

        try {
            const response = await fetch(`/api/admin/purchases/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Compra eliminada');
                fetchPurchases();
            } else {
                const data = await response.json();
                alert(data.error || 'Error al eliminar');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar');
        }
    };

    // Payment handlers
    const handleApprovePayment = async (paymentId: number) => {
        try {
            const response = await fetch(`/api/admin/payments/${paymentId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'succeeded' }),
            });

            if (response.ok) {
                alert('Pago aprobado');
                fetchPurchases();
                // Refresh detail view
                setDetailOpen(false);
                setTimeout(() => setDetailOpen(true), 100);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al aprobar pago');
        }
    };

    const handleMarkPaymentRefunded = async (paymentId: number) => {
        if (!confirm('¿Marcar pago como reembolsado?')) return;

        try {
            const response = await fetch(`/api/admin/payments/${paymentId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'refunded' }),
            });

            if (response.ok) {
                alert('Pago marcado como reembolsado');
                // Refresh detail view
                setDetailOpen(false);
                setTimeout(() => setDetailOpen(true), 100);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al marcar como reembolsado');
        }
    };

    const handleDeletePayment = async (paymentId: number) => {
        if (!confirm('¿Eliminar pago pendiente?')) return;

        try {
            const response = await fetch(`/api/admin/payments/${paymentId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Pago eliminado');
                // Refresh detail view
                setDetailOpen(false);
                setTimeout(() => setDetailOpen(true), 100);
            } else {
                const data = await response.json();
                alert(data.error || 'Error al eliminar');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar pago');
        }
    };

    const handleManualPaymentSuccess = () => {
        fetchPurchases();
        // Refresh detail if open
        if (detailOpen) {
            setDetailOpen(false);
            setTimeout(() => setDetailOpen(true), 100);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 mx-auto text-[#256EFF] animate-spin mb-4" />
                    <p className="text-[#102542]/60">Cargando compras...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-[#256EFF]/10 to-[#07BEB8]/10 rounded-lg">
                                <ShoppingCart className="w-6 h-6 text-[#256EFF]" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl text-[#102542]">
                                    Gestión de Compras
                                </CardTitle>
                                <CardDescription>
                                    Administrar reservas y pagos
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex gap-4 text-sm">
                            <div className="text-center">
                                <div className="font-bold text-xl text-[#256EFF]">{purchases.length}</div>
                                <div className="text-[#102542]/60">Total</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-xl text-green-600">
                                    {purchases.filter(p => p.status === 'paid').length}
                                </div>
                                <div className="text-[#102542]/60">Pagadas</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-xl text-yellow-600">
                                    {purchases.filter(p => p.status === 'pending' || p.status === 'reserved').length}
                                </div>
                                <div className="text-[#102542]/60">Pendientes</div>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <PurchasesDataTable
                        data={purchases}
                        onViewDetails={handleViewDetails}
                        onViewPayments={handleViewPayments}
                        onChangeStatus={handleChangeStatus}
                        onManualPayment={handleManualPayment}
                        onCancel={handleCancel}
                        onRefund={handleRefund}
                        onExtendExpiration={handleExtendExpiration}
                        onDelete={handleDelete}
                    />
                </CardContent>
            </Card>

            {/* Detail Sheet */}
            <PurchaseDetailSheet
                open={detailOpen}
                onOpenChange={setDetailOpen}
                purchaseId={selectedPurchaseId}
                onApprovePayment={handleApprovePayment}
                onMarkPaymentRefunded={handleMarkPaymentRefunded}
                onDeletePayment={handleDeletePayment}
            />

            {/* Manual Payment Dialog */}
            <ManualPaymentDialog
                open={manualPaymentOpen}
                onOpenChange={setManualPaymentOpen}
                purchaseId={manualPaymentPurchaseId}
                remainingAmount={manualPaymentRemaining}
                onSuccess={handleManualPaymentSuccess}
            />
        </div>
    );
}

'use client'

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import type { AdminUser } from '../types';

interface EditUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string | null;
    onSuccess: () => void;
}

export function EditUserDialog({
    open,
    onOpenChange,
    userId,
    onSuccess,
}: EditUserDialogProps) {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<AdminUser | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        last_name: '',
        phone: '',
        role: 'customer' as 'admin' | 'customer',
        country: '',
        city: '',
        address: '',
    });

    useEffect(() => {
        if (open && userId) {
            fetchUser();
        }
    }, [open, userId]);

    const fetchUser = async () => {
        if (!userId) return;

        try {
            setLoading(true);
            const response = await fetch(`/api/admin/users/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                setFormData({
                    name: data.user.name || '',
                    last_name: data.user.last_name || '',
                    phone: data.user.phone || '',
                    role: data.user.role || 'customer',
                    country: data.user.country || '',
                    city: data.user.city || '',
                    address: data.user.address || '',
                });
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar usuario');
            }

            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Error al actualizar usuario');
        } finally {
            setLoading(false);
        }
    };

    if (!user && loading) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent>
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-[#256EFF]" />
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Editar Usuario</DialogTitle>
                    <DialogDescription>
                        Modifica la información del usuario
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="last_name">Apellido</Label>
                            <Input
                                id="last_name"
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div>
                        <Label htmlFor="role">Rol</Label>
                        <Select
                            value={formData.role}
                            onValueChange={(v) => setFormData({ ...formData, role: v as 'admin' | 'customer' })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="customer">Cliente</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="country">País</Label>
                            <Input
                                id="country"
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="city">Ciudad</Label>
                            <Input
                                id="city"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="address">Dirección</Label>
                        <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                'Guardar Cambios'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

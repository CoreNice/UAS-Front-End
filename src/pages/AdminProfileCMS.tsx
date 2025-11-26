import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuthHook";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Shield, Award, Target, Users, Heart, BookOpen,
    X, Plus, Edit2, Trash2, Loader2
} from "lucide-react";
import { profileCMSApi } from "@/lib/api";
import { uploadImage } from "@/supabase/storage/client";

type IconType = 'Shield' | 'Award' | 'Target' | 'Users' | 'Heart' | 'BookOpen';

interface Division {
    _id?: unknown;
    id?: string;
    name: string;
    description: string;
    longDescription: string;
    icon: IconType;
    color: string;
    image?: string;
    order?: number;
}

const iconMap = {
    Shield: { icon: Shield, name: 'Shield' },
    Award: { icon: Award, name: 'Award' },
    Target: { icon: Target, name: 'Target' },
    Users: { icon: Users, name: 'Users' },
    Heart: { icon: Heart, name: 'Heart' },
    BookOpen: { icon: BookOpen, name: 'BookOpen' },
};

const colorOptions = [
    { name: 'Blue', value: 'from-blue-600 to-blue-400' },
    { name: 'Purple', value: 'from-purple-600 to-purple-400' },
    { name: 'Cyan', value: 'from-cyan-600 to-cyan-400' },
    { name: 'Green', value: 'from-green-600 to-green-400' },
    { name: 'Pink', value: 'from-pink-600 to-pink-400' },
    { name: 'Orange', value: 'from-orange-600 to-orange-400' },
    { name: 'Indigo', value: 'from-indigo-600 to-indigo-400' },
    { name: 'Red', value: 'from-red-600 to-red-400' },
];

const AdminProfileCMS = () => {
    const { token } = useAuth();
    const { toast } = useToast();
    const [divisions, setDivisions] = useState<Division[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadingId, setUploadingId] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const [formData, setFormData] = useState<Division>({
        name: '',
        description: '',
        longDescription: '',
        icon: 'Shield',
        color: 'from-blue-600 to-blue-400',
        image: '',
        order: 0,
    });

    const extractId = (raw: unknown): string | null => {
        if (!raw) return null;
        if (typeof raw === 'string') return raw;
        if (typeof raw === 'object' && raw !== null) {
            const asRec = raw as Record<string, unknown>;
            if (typeof asRec['$oid'] === 'string') return asRec['$oid'] as string;
            if (typeof asRec['oid'] === 'string') return asRec['oid'] as string;
            try { return String(raw); } catch (e) { return null; }
        }
        return null;
    };

    useEffect(() => {
        fetchDivisions();
        fetchSiteSettings();
    }, [token]);

    const fetchSiteSettings = async () => {
    };

    const fetchDivisions = async () => {
        try {
            setIsLoading(true);
            const response = await profileCMSApi.getAll(token);
            if (response.success) {
                setDivisions((response.data || []) as Division[]);
            } else {
                toast({
                    title: "Error",
                    description: response.message || "Failed to fetch divisions",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Fetch error:', error);
            toast({
                title: "Error",
                description: "Failed to fetch divisions",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, divisionId?: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast({
                title: "Error",
                description: "Please select an image file",
                variant: "destructive"
            });
            return;
        }

        setUploadingId(divisionId || 'new');
        try {
            const imageUrl = await uploadImage(file);
            setFormData(prev => ({
                ...prev,
                image: imageUrl
            }));
            setPreviewImage(imageUrl);
            toast({
                title: "Success",
                description: "Image uploaded successfully",
            });
        } catch (error) {
            console.error('Upload error:', error);
            toast({
                title: "Error",
                description: "Failed to upload image",
                variant: "destructive"
            });
        } finally {
            setUploadingId(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.description || !formData.longDescription) {
            toast({
                title: "Error",
                description: "Please fill all required fields",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const dataToSend = { ...formData };
            if (editingId) {
                delete dataToSend._id;
            }

            const response = editingId
                ? await profileCMSApi.update(editingId, dataToSend, token)
                : await profileCMSApi.create(dataToSend, token);

            if (response.success) {
                toast({
                    title: "Success",
                    description: editingId ? "Division updated successfully" : "Division created successfully",
                });
                await fetchDivisions();
                resetForm();
                setIsDialogOpen(false);
            } else {
                toast({
                    title: "Error",
                    description: response.message || "Failed to save division",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Submit error:', error);
            toast({
                title: "Error",
                description: "Failed to save division",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (division: Division) => {
        const idStr = extractId(division._id ?? division.id) || null;

        setFormData({
            ...division,
            _id: idStr || undefined,
        });
        setPreviewImage(division.image || null);
        setEditingId(idStr);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: unknown) => {
        if (!confirm('Are you sure you want to delete this division?')) return;

        try {
            const idStr = extractId(id) || '';
            const response = await profileCMSApi.delete(idStr, token);
            if (response.success) {
                toast({
                    title: "Success",
                    description: "Division deleted successfully",
                });
                await fetchDivisions();
            } else {
                toast({
                    title: "Error",
                    description: response.message || "Failed to delete division",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast({
                title: "Error",
                description: "Failed to delete division",
                variant: "destructive"
            });
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            longDescription: '',
            icon: 'Shield',
            color: 'from-blue-600 to-blue-400',
            image: '',
            order: 0,
        });
        setPreviewImage(null);
        setEditingId(null);
    };

    return (
        <AdminLayout title="Divisions & Departments" subtitle="Pengurus Organisasi">
            <div className="space-y-6">
                <div className="flex justify-end">
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) resetForm();
                    }}>
                        <DialogTrigger asChild>
                            <Button
                                onClick={() => {
                                    resetForm();
                                    setIsDialogOpen(true);
                                }}
                                className="gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingId ? 'Edit Division' : 'Add New Division'}
                                </DialogTitle>
                            </DialogHeader>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Nama Divisi *</label>
                                    <Input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        placeholder="e.g., BPHI"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Deskripsi Singkat *</label>
                                    <Textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleFormChange}
                                        placeholder="Brief description for the card"
                                        rows={2}
                                        className="mt-1 resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Deskripsi Lengkap *</label>
                                    <Textarea
                                        name="longDescription"
                                        value={formData.longDescription}
                                        onChange={handleFormChange}
                                        placeholder="Detailed description for the detail card"
                                        rows={4}
                                        className="mt-1 resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Icon</label>
                                    <select
                                        name="icon"
                                        value={formData.icon}
                                        onChange={handleFormChange}
                                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {Object.entries(iconMap).map(([key, value]) => (
                                            <option key={key} value={key}>{value.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Color</label>
                                    <select
                                        name="color"
                                        value={formData.color}
                                        onChange={handleFormChange}
                                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {colorOptions.map(option => (
                                            <option key={option.value} value={option.value}>{option.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Image</label>
                                    <div className="mt-1 space-y-3">
                                        {previewImage && (
                                            <div className="relative">
                                                <img
                                                    src={previewImage}
                                                    alt="preview"
                                                    className="w-full h-48 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPreviewImage(null);
                                                        setFormData(prev => ({ ...prev, image: '' }));
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, editingId || 'new')}
                                                disabled={uploadingId !== null}
                                                className="flex-1"
                                            />
                                            {uploadingId && (
                                                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsDialogOpen(false);
                                            resetForm();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || uploadingId !== null}
                                    >
                                        {isSubmitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                ) : divisions.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-gray-500">Belum ada Divisi yang ditambahkan.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {divisions.map(division => (
                            <Card key={extractId(division._id ?? division.id) ?? division.name} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <CardTitle className="text-lg">{division.name}</CardTitle>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(division)}
                                                className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="h-4 w-4 text-blue-600" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(division._id ?? division.id ?? null)}
                                                className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </button>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-3">
                                    {division.image && (
                                        <img
                                            src={division.image}
                                            alt={division.name}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                    )}

                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-12 h-12 rounded-lg bg-gradient-to-br ${division.color} flex items-center justify-center`}
                                        >
                                            {iconMap[division.icon].icon && (() => {
                                                const Icon = iconMap[division.icon].icon; // grab the component
                                                return <Icon className="h-6 w-6 text-white" />;
                                            })()}
                                        </div>
                                        <span className="text-sm text-gray-600">
                                            {iconMap[division.icon].name}
                                        </span>
                                    </div>


                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-gray-700">Deskripsi singkat:</p>
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {division.description}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-gray-700">Deskripsi lengkap:</p>
                                        <p className="text-sm text-gray-600 line-clamp-3">
                                            {division.longDescription}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminProfileCMS;

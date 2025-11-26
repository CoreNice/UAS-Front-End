import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuthHook";
import { LogOut, Edit2, Mail, Shield, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { uploadImage } from "@/supabase/storage/client";

interface User {
    _id?: string;
    name: string;
    email: string;
    role: string;
    avatarUrl?: string | null;
}

interface MiniCardProps {
    user?: User | null;
    onClose: () => void;
}

const MiniCard = ({ user, onClose }: MiniCardProps) => {
    const navigate = useNavigate();
    const { logout, updateProfile, token } = useAuth();
    const [isHovering, setIsHovering] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!user) {
        return (
            <div className="text-center p-4 text-gray-500">
                Tidak ada user
            </div>
        );
    }

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            logout();
        } catch (error) {
            console.error('Logout error:', error);
            setIsLoggingOut(false);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Image must be less than 5MB');
            return;
        }

        setIsUploadingAvatar(true);
        try {
            const imageUrl = await uploadImage(file, 'pout-pictures');

            if (!imageUrl) {
                throw new Error('Failed to upload image');
            }

            const result = await updateProfile({ avatarUrl: imageUrl });

            if (!result.success) {
                throw new Error(result.message || 'Failed to update profile');
            }

            alert('Avatar updated successfully!');
        } catch (error) {
            console.error('Avatar upload error:', error);
            alert(error instanceof Error ? error.message : 'Failed to upload avatar');
        } finally {
            setIsUploadingAvatar(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <>
            <Card className="w-80 shadow-2xl border-0 bg-white">
                <CardContent className="p-6">
                    <div className="flex flex-col items-center mb-6">
                        <div
                            className="relative mb-4"
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                        >
                            {user.avatarUrl ? (
                                <img
                                    src={user.avatarUrl}
                                    alt={user.name}
                                    className="h-20 w-20 rounded-full object-cover border-4 border-primary/20"
                                />
                            ) : (
                                <div className="h-20 w-20 rounded-full bg-gradient-primary flex items-center justify-center border-4 border-primary/20">
                                    <span className="text-2xl font-bold text-white">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}

                            {isHovering && !isUploadingAvatar && (
                                <button
                                    onClick={handleAvatarClick}
                                    disabled={isUploadingAvatar}
                                    className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center transition-all disabled:opacity-50"
                                >
                                    <Edit2 className="h-6 w-6 text-white" />
                                </button>
                            )}

                            {isUploadingAvatar && (
                                <button
                                    disabled
                                    className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center transition-all"
                                >
                                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                                </button>
                            )}
                        </div>

                        <button
                            onClick={handleAvatarClick}
                            disabled={isUploadingAvatar}
                            className="text-sm text-primary font-semibold hover:text-accent transition-colors mb-4 disabled:opacity-50"
                        >
                            {isUploadingAvatar ? 'Uploading...' : 'Edit Avatar'}
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                            disabled={isUploadingAvatar}
                        />
                    </div>

                    <div className="space-y-3 border-t border-gray-200 pt-4">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Username</p>
                            <p className="text-lg font-bold text-gray-900">{user.name}</p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Role</p>
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-primary" />
                                <p className="text-sm font-semibold text-primary capitalize">
                                    {user.role}
                                </p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Email</p>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <p className="text-sm text-gray-700 break-all">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut || isUploadingAvatar}
                        className="w-full mt-6 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <LogOut className="h-5 w-5" />
                        {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </button>
                </CardContent>
            </Card>
        </>
    );
};

export default MiniCard;
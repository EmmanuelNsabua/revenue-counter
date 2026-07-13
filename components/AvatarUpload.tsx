'use client';

import { useState } from 'react';
import { useEdgeStore } from '@/lib/edgestore';
import axios from 'axios';
import { useAuth } from '@/providers/auth-provider';
import { toast } from 'sonner';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  onSuccess?: (newUrl: string) => void;
}

export default function AvatarUpload({ currentAvatarUrl, onSuccess }: AvatarUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { edgestore } = useEdgeStore();
  
  // We try to get auth token and user context
  const { user } = useAuth();
  const token = typeof window !== 'undefined' ? localStorage.getItem('revenue_token') || '' : '';

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    try {
      // 1. Upload to EdgeStore
      const res = await edgestore.publicFiles.upload({
        file,
        options: {
          replaceTargetUrl: currentAvatarUrl, // Remplace l'ancien fichier s'il existe
        },
      });

      const newAvatarUrl = res.url;

      // 2. Envoi à l'API Laravel
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      
      await axios.post(`${apiUrl}/user/avatar`, {
        avatar_url: newAvatarUrl,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });

      toast.success("Votre avatar a été mis à jour avec succès !");
      if (onSuccess) onSuccess(newAvatarUrl);
      
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.message || 
        err.message || 
        "Une erreur est survenue lors de la mise à jour de l'avatar."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-5 border border-gray-200 rounded-xl shadow-sm bg-white dark:bg-gray-900 dark:border-gray-800">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        Photo de profil
      </h3>
      
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={(e) => {
          setFile(e.target.files?.[0] ?? null);
        }}
        className="block w-full text-sm text-gray-500 dark:text-gray-400
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-indigo-50 file:text-indigo-700
          hover:file:bg-indigo-100
          dark:file:bg-indigo-950 dark:file:text-indigo-400"
        disabled={loading}
      />

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="px-4 py-2 mt-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Mise à jour...
          </span>
        ) : (
          "Enregistrer l'avatar"
        )}
      </button>
    </div>
  );
}

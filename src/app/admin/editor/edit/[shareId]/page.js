"use client";

import { useParams } from 'next/navigation';
import EditorLayout from '@/components/editor/EditorLayout';
import EditorLoadingSkeleton from '@/components/editor/EditorLoadingSkeleton';
import AdminGuard from '@/components/admin/AdminGuard';

export default function AdminEditorEditPage() {
  const params = useParams();
  const { shareId } = params;

  if (!shareId) {
    return <EditorLoadingSkeleton />;
  }

  return (
    <AdminGuard>
      <EditorLayout shareId={shareId} adminMode="edit" />
    </AdminGuard>
  );
}

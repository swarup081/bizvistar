"use client";

import { useParams } from 'next/navigation';
import EditorLayout from '@/components/editor/EditorLayout';
import EditorLoadingSkeleton from '@/components/editor/EditorLoadingSkeleton';
import AdminGuard from '@/components/admin/AdminGuard';

export default function AdminEditorCreatePage() {
  const params = useParams();
  const { templateName } = params;

  if (!templateName) {
    return <EditorLoadingSkeleton />;
  }

  return (
    <AdminGuard>
      <EditorLayout templateName={templateName} adminMode="create" />
    </AdminGuard>
  );
}

'use client';
// export const runtime = 'edge';

import { useParams } from 'next/navigation';
import EditorLayout from '@/components/editor/EditorLayout';
import EditorLoadingSkeleton from '@/components/editor/EditorLoadingSkeleton';

export default function EditorPage() {
  const params = useParams();
  const { templateName } = params;

  if (!templateName) {
    return <EditorLoadingSkeleton />;
  }

  return (
    <EditorLayout templateName={templateName} />
  );
}
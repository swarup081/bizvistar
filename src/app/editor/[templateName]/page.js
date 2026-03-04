'use client';
export const runtime = 'edge';

import { useParams } from 'next/navigation';
import EditorLayout from '@/components/editor/EditorLayout';

export default function EditorPage() {
  const params = useParams();
  const { templateName } = params;

  if (!templateName) {
    return <div>Loading editor...</div>;
  }

  return (
    <EditorLayout templateName={templateName} />
  );
}
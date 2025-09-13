import NotionLayout from '@/components/NotionLayout';
import PageViewer from '@/components/PageViewer';

interface PageProps {
  params: {
    id: string;
  };
}

export default function NotionPage({ params }: PageProps) {
  return (
    <NotionLayout>
      <PageViewer pageId={params.id} />
    </NotionLayout>
  );
}
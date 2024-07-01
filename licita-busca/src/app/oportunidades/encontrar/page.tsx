import { ContentLayout } from "@/components/layout/content-layout";
import OportunidadeList from "@/components/oportunidades/oportunidade-list";

export default function Oportunidades() {
  return (
    <ContentLayout title="Oportunidades">
      <div className="space-y-12">
        <OportunidadeList />
      </div>
    </ContentLayout>
  );
}

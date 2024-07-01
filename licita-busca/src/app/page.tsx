import { ContentLayout } from "@/components/layout/content-layout";

export default function Home() {
  return (
    <ContentLayout title="Home">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <h1 className="text-2xl font-semibold">Bem-vindo ao Licitabusca!</h1>
        <p>
          O Licitabusca é um sistema eficiente que simplifica a busca por
          licitações, oferecendo uma interface intuitiva para encontrar e salvar
          licitações relevantes. Sua capacidade de gerar alertas personalizados
          mantém os usuários atualizados sobre novas oportunidades de negócios,
          tornando-o uma ferramenta indispensável para empresas que buscam
          expandir no mercado público.
        </p>
      </div>
    </ContentLayout>
  );
}

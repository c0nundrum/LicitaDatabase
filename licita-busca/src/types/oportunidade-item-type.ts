export type OportunidadeItemProps = {
  title?: string;
  tipoInstrumentoConvocatorioNome?: string;
  numeroCompra?: string;
  description?: string;
  item_url?: string;
  numero?: string | null;
  ano?: string;
  modalidadeNome?: string;
  situacaoCompraNome?: string;
  data_inicio_vigencia?: string | null;
  data_fim_vigencia?: string | null;
  valorTotalEstimado?: number;
  orgao_nome?: string;
  orgaoEntidade?: {
    razaoSocial?: string;
  };
  unidade_nome?: string;
  unidadeOrgao?: {
    ufSigla?: string;
    municipioNome?: string;
    nomeUnidade?: string;
  };
  objetoCompra?: string;
  dataAberturaProposta?: string | null;
  dataEncerramentoProposta?: string | null;
  publicSessionDatetime?: string | null;
  linkSistemaOrigem?: string | null;
  itens?: Array<{
    numeroItem: number;
    descricao: string;
    materialOuServicoNome: string;
    valorUnitarioEstimado: number;
    valorTotal: number;
    quantidade: number;
    unidadeMedida: string;
    itemCategoriaNome: string;
    criterioJulgamentoNome: string;
    situacaoCompraItemNome: string;
    tipoBeneficioNome: string;
    incentivoProdutivoBasico: boolean;
    dataInclusao: string;
    dataAtualizacao: string;
  }>;
};

"use client";

import React, { useState } from "react";
import { Plus, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import OportunidadeItemSub from "./oportunidade-item-sub";
import { OportunidadeItemProps } from "@/types/oportunidade-item-type";
import { Pagination } from "./pagination";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function OportunidadeItem({
  title,
  description,
  item_url,
  numero,
  ano,
  modalidade_licitacao_nome,
  situacao_nome,
  data_inicio_vigencia,
  data_fim_vigencia,
  valorTotalEstimado,
  orgao_nome,
  unidade_nome,
  municipio_nome,
  uf,
  objetoCompra,
  dataAberturaProposta,
  dataEncerramentoProposta,
  dataAberturaSessao,
  linkSistemaOrigem,
  itens = [],
}: OportunidadeItemProps) {
  const [showContent, setShowContent] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 3;

  const handleToggleContent = () => {
    setShowContent(!showContent);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = itens.slice(startIndex, endIndex);

  const totalPages = Math.ceil(itens.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-2">
          {title && (
            <CardTitle className="group flex items-center gap-2 text-lg">
              {municipio_nome}-{uf}: {title}
            </CardTitle>
          )}
          <div className="space-y-2">
            {description && <p>{description}</p>}
            {orgao_nome && (
              <div>
                <span className="font-semibold">Órgão: </span>
                {orgao_nome}
              </div>
            )}
            {dataAberturaProposta && (
              <div>
                <span className="font-semibold">
                  Data de Abertura da Proposta:{" "}
                </span>
                {formatDate(dataAberturaProposta)}
              </div>
            )}
            {dataEncerramentoProposta && (
              <div>
                <span className="font-semibold">
                  Data de Encerramento da Proposta:{" "}
                </span>
                {formatDate(dataEncerramentoProposta)}
              </div>
            )}
            {dataAberturaSessao && (
              <div>
                <span className="font-semibold">
                  Data de Abertura da Sessão:{" "}
                </span>
                {formatDate(dataAberturaSessao)}
              </div>
            )}
            {valorTotalEstimado && (
              <div>
                <span className="font-semibold">Valor estimado: </span>
                {formatCurrency(valorTotalEstimado)}
              </div>
            )}
            {modalidade_licitacao_nome && (
              <div>
                <span className="font-semibold">Modalidade: </span>
                {modalidade_licitacao_nome}
              </div>
            )}
            {linkSistemaOrigem && (
              <div className="flex items-center gap-1">
                <a
                  href={linkSistemaOrigem}
                  className="text-md hover:underline"
                  target="_blank"
                >
                  Acessar
                </a>
                <SquareArrowOutUpRight className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8"
            onClick={handleToggleContent}
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="sr-only">More</span>
          </Button>
        </div>
      </CardHeader>
      {showContent && (
        <CardContent className="p-6 text-sm">
          <div className="grid gap-3">
            <div className="font-semibold text-lg">Detalhes do Pregão</div>
            {modalidade_licitacao_nome && (
              <div>
                <span className="font-semibold">Modalidade de Licitação: </span>
                {modalidade_licitacao_nome}
              </div>
            )}
            {situacao_nome && (
              <div>
                <span className="font-semibold">Situação: </span>
                {situacao_nome}
              </div>
            )}
            {data_inicio_vigencia && (
              <div>
                <span className="font-semibold">Início da Vigência: </span>
                {formatDate(data_inicio_vigencia)}
              </div>
            )}
            {data_fim_vigencia && (
              <div>
                <span className="font-semibold">Fim da Vigência: </span>
                {formatDate(data_fim_vigencia)}
              </div>
            )}
            {valorTotalEstimado && (
              <div>
                <span className="font-semibold">Valor Total Estimado: </span>
                {formatCurrency(valorTotalEstimado)}
              </div>
            )}
            <Separator className="my-2" />
            <div className="font-semibold text-lg">Informações Adicionais</div>
            {orgao_nome && (
              <div>
                <span className="font-semibold">Órgão: </span>
                {orgao_nome}
              </div>
            )}
            {unidade_nome && (
              <div>
                <span className="font-semibold">Unidade: </span>
                {unidade_nome}
              </div>
            )}
            {municipio_nome && (
              <div>
                <span className="font-semibold">Município: </span>
                {municipio_nome}
              </div>
            )}
            {uf && (
              <div>
                <span className="font-semibold">UF: </span>
                {uf}
              </div>
            )}
            {objetoCompra && (
              <div>
                <span className="font-semibold">Objeto da Compra: </span>
                {objetoCompra}
              </div>
            )}
            <Separator className="my-2" />
            <div className="font-semibold text-lg">Datas Importantes</div>
            {dataAberturaProposta && (
              <div>
                <span className="font-semibold">
                  Data de Abertura da Proposta:{" "}
                </span>
                {formatDate(dataAberturaProposta)}
              </div>
            )}
            {dataEncerramentoProposta && (
              <div>
                <span className="font-semibold">
                  Data de Encerramento da Proposta:{" "}
                </span>
                {formatDate(dataEncerramentoProposta)}
              </div>
            )}
            <Separator className="my-2" />
            <div className="font-semibold text-lg">Itens</div>
            <div className="grid gap-3">
              {currentItems.map((item, index) => (
                <OportunidadeItemSub key={index} {...item} />
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </CardContent>
      )}
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        {data_fim_vigencia && (
          <div className="text-xs text-muted-foreground">
            Fim da vigência:{" "}
            <time dateTime={data_fim_vigencia}>
              {formatDate(data_fim_vigencia)}
            </time>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

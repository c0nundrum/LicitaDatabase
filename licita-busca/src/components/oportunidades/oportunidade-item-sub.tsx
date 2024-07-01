"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OportunidadeItemSubProps } from "@/types/oportunidade-item-sub-type";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function OportunidadeItemSub({
  numeroItem,
  descricao,
  materialOuServicoNome,
  valorUnitarioEstimado,
  valorTotal,
  quantidade,
  unidadeMedida,
  itemCategoriaNome,
  criterioJulgamentoNome,
  situacaoCompraItemNome,
  tipoBeneficioNome,
  incentivoProdutivoBasico,
  dataInclusao,
  dataAtualizacao,
}: OportunidadeItemSubProps) {
  const [showContent, setShowContent] = useState(false);

  const handleToggleContent = () => {
    setShowContent(!showContent);
  };

  return (
    <Card className="overflow-hidden mb-4">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-2">
          {(numeroItem || descricao) && (
            <CardTitle className="text-lg">
              {numeroItem && `Item ${numeroItem}:`} {descricao}
            </CardTitle>
          )}
          {quantidade !== undefined && (
            <div>
              <span className="font-semibold">Qtde: </span>
              {quantidade}
            </div>
          )}
          {valorUnitarioEstimado !== undefined && (
            <div>
              <span className="font-semibold">Valor Unit.: </span>
              {formatCurrency(valorUnitarioEstimado)}
            </div>
          )}
          {valorTotal !== undefined && (
            <div>
              <span className="font-semibold">Valor Total: </span>
              {formatCurrency(valorTotal)}
            </div>
          )}
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
            {materialOuServicoNome && (
              <div>
                <span className="font-semibold">Material/Serviço: </span>
                {materialOuServicoNome}
              </div>
            )}
            {itemCategoriaNome && (
              <div>
                <span className="font-semibold">Categoria: </span>
                {itemCategoriaNome}
              </div>
            )}
            {criterioJulgamentoNome && (
              <div>
                <span className="font-semibold">Critério de Julgamento: </span>
                {criterioJulgamentoNome}
              </div>
            )}
            {situacaoCompraItemNome && (
              <div>
                <span className="font-semibold">Situação do Item: </span>
                {situacaoCompraItemNome}
              </div>
            )}
            {tipoBeneficioNome && (
              <div>
                <span className="font-semibold">Tipo de Benefício: </span>
                {tipoBeneficioNome}
              </div>
            )}
            {incentivoProdutivoBasico !== undefined && (
              <div>
                <span className="font-semibold">
                  Incentivo Produtivo Básico:{" "}
                </span>
                {incentivoProdutivoBasico ? "Sim" : "Não"}
              </div>
            )}
            {dataInclusao && (
              <div>
                <span className="font-semibold">Data de Inclusão: </span>
                {formatDate(dataInclusao)}
              </div>
            )}
            {dataAtualizacao && (
              <div>
                <span className="font-semibold">Data de Atualização: </span>
                {formatDate(dataAtualizacao)}
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

"use client";

import { useState } from "react";
import OportunidadeItem from "@/components/oportunidades/oportunidade-item";
import detalhesEditalDuplicated from "@/data/all_data.json";
import { Pagination } from "./pagination";
import { Filters } from "./filters";

export default function OportunidadeList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [advancedFilters, setAdvancedFilters] = useState<{ states: string[] }>({
    states: [],
  });

  const itemsPerPage = 5;

  const handleFilterChange = (filter: string | null) => {
    setSelectedFilter(filter);
    setCurrentPage(1); // Volta pra primeira página quando muda o filtro
  };

  const handleApplyFilters = (filters: { states: string[] }) => {
    setAdvancedFilters(filters);
    setCurrentPage(1); // Volta pra primeira página quando muda o filtro
  };

  const filteredItems = detalhesEditalDuplicated.filter((item) => {
    if (
      selectedFilter === "pregao" &&
      item.modalidade_licitacao_nome !== "Pregão - Eletrônico"
    ) {
      return false;
    } else if (
      selectedFilter === "dispensa" &&
      item.modalidade_licitacao_nome !== "Dispensa"
    ) {
      return false;
    }

    if (
      advancedFilters.states.length > 0 &&
      !advancedFilters.states.includes(item.uf)
    ) {
      return false;
    }

    return true;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  function handlePageChange(newPage: number) {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <Filters
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
      />
      {currentItems.map((detalhe) => (
        <OportunidadeItem key={detalhe.id} {...detalhe} />
      ))}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}

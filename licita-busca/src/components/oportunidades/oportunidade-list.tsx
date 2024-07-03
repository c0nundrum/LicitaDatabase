"use client";

import { useState, useEffect } from "react";
import OportunidadeItem from "@/components/oportunidades/oportunidade-item";
import { Pagination } from "./pagination";
import { Filters } from "./filters";

export default function OportunidadeList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [advancedFilters, setAdvancedFilters] = useState<{ states: string[] }>({
    states: [],
  });
  const [oportunidades, setOportunidades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchOportunidades = async () => {
      try {
        const response = await fetch("/api/oportunidades");
        const data = await response.json();
        console.log(data);
        setOportunidades(data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar oportunidades:", error);
        setLoading(false);
      }
    };

    fetchOportunidades();
  }, []);

  const handleFilterChange = (filter: string | null) => {
    setSelectedFilter(filter);
    setCurrentPage(1); // Volta pra primeira página quando muda o filtro
  };

  const handleApplyFilters = (filters: { states: string[] }) => {
    setAdvancedFilters(filters);
    setCurrentPage(1); // Volta pra primeira página quando muda o filtro
  };

  const filteredItems = oportunidades.filter((item) => {
    if (
      selectedFilter === "pregao" &&
      item.modalidadeNome !== "Pregão - Eletrônico"
    ) {
      return false;
    } else if (
      selectedFilter === "dispensa" &&
      item.modalidadeNome !== "Dispensa"
    ) {
      return false;
    }

    if (
      advancedFilters.states.length > 0 &&
      !advancedFilters.states.includes(item.unidadeOrgao.ufSigla)
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

  if (loading) {
    return <div>Carregando...</div>;
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

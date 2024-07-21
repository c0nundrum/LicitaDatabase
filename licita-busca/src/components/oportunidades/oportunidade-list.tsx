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
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 5;

  useEffect(() => {
    fetchOportunidades(selectedFilter, null);
    countOportunidades(selectedFilter);
  }, [selectedFilter]);

  const handleFilterChange = (filter: string | null) => {
    setSelectedFilter(filter);
    setCurrentPage(1); // Volta pra primeira página quando muda o filtro
  };

  const handleApplyFilters = (filters: { states: string[] }) => {
    setAdvancedFilters(filters);
    fetchOportunidades(selectedFilter, advancedFilters);
    setCurrentPage(1); // Volta pra primeira página quando muda o filtro
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = oportunidades.slice(startIndex, endIndex);

  const totalPages = Math.ceil(oportunidades.length / itemsPerPage);

  function handlePageChange(newPage: number) {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  const countOportunidades = async (selectedFilter:any) => {
    try {
      const params = {'modalidadeNome': selectedFilter};
      const url = new URL("/api/oportunidade-count", window.location.origin);
      url.search = new URLSearchParams(params).toString();
      const response = await fetch(url);
      const data = await response.json();
      setTotalItems(data)
    } catch (error) {
      console.error("Erro ao contar:", error);
    }
  };

  const fetchOportunidades = async (selectedFilter:any, advancedFilters:any) => {
    try {
      const params = {'modalidadeNome': selectedFilter,
        'unidadeOrgao.ufSigla': advancedFilters.states
      };
      console.log(params)
      const url = new URL("/api/oportunidades", window.location.origin);
      url.search = new URLSearchParams(params).toString();
      const response = await fetch(url);
      const data = await response.json();
      setOportunidades(data);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar oportunidades:", error);
      setLoading(false);
    }
  };

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
        totalItems={totalItems}
      />
    </>
  );
}

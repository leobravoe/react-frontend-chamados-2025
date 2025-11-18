// src/components/ChamadosList.jsx

import { useState, useEffect } from "react";
import Chamado from "./Chamado";
import { useAuthFetch } from "../../auth/useAuthFetch";
import Toast from "../shared/Toast";
import ChamadosListFilter from "./ChamadosListFilter";

function filtrarPorEstado(lista, estado) {
  if (!estado) return lista; // "" = todos
  return lista.filter((ch) => ch.estado === estado);
}

const ChamadosList = () => {
  // Lê cache do localStorage (se existir)
  let chamadosCache = null;
  try {
    chamadosCache = JSON.parse(localStorage.getItem("chamadosCache"));
  } catch {
    chamadosCache = null;
  }

  // allChamados = fonte de verdade (sempre a lista completa)
  const [allChamados, setAllChamados] = useState(chamadosCache ?? []);
  // filteredChamados = o que está sendo exibido (aplica filtro em cima de allChamados)
  const [filteredChamados, setFilteredChamados] = useState(chamadosCache ?? []);
  const [loading, setLoading] = useState(chamadosCache ? false : true);
  const [error, setError] = useState(null);
  const [estadoFilter, setEstadoFilter] = useState("a"); // "", "a", "f"

  const authFetch = useAuthFetch();

  // Função helper para atualizar allChamados + filteredChamados + cache de forma consistente
  const atualizarChamadosLocais = (novaLista) => {
    setAllChamados(novaLista);
    setFilteredChamados(filtrarPorEstado(novaLista, estadoFilter));
    localStorage.setItem("chamadosCache", JSON.stringify(novaLista));
  };

  useEffect(() => {
    const abortController = new AbortController();

    const fetchChamados = async () => {
      try {
        const res = await authFetch("http://localhost:3000/api/chamados", {
          method: "GET",
          signal: abortController.signal,
        });

        if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
        if (res.status === 304) return;

        const data = await res.json();

        // Atualiza fonte de verdade + filtrado + cache
        atualizarChamadosLocais(data);
      } catch (error) {
        if (error?.name === "AbortError") return;
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChamados();
    const interval5secs = setInterval(fetchChamados, 5000);

    return () => {
      abortController.abort();
      clearInterval(interval5secs);
    };
    // depende de authFetch e do filtro atual, para que novas listas vindas da API
    // sejam aplicadas respeitando o filtro que o usuário escolheu
  }, [authFetch, estadoFilter]);

  // Quando o usuário troca o filtro no <ChamadosListFilter>
  const handleFilterChange = (novoEstado) => {
    setEstadoFilter(novoEstado);
    setFilteredChamados(filtrarPorEstado(allChamados, novoEstado));
  };

  // Chamado alterado (ex.: mudou estado de "a" para "f")
  const onChamadoEstadoChange = (chamadoAlterado) => {
    setAllChamados((prev) => {
      const novaLista = prev.map((ch) =>
        ch.id === chamadoAlterado.id ? chamadoAlterado : ch
      );
      // reaplica filtro e atualiza cache
      setFilteredChamados(filtrarPorEstado(novaLista, estadoFilter));
      localStorage.setItem("chamadosCache", JSON.stringify(novaLista));
      return novaLista;
    });
  };

  // Chamado deletado
  const onChamadoDelete = (chamadoDeletadoId) => {
    setAllChamados((prev) => {
      const novaLista = prev.filter((ch) => ch.id !== chamadoDeletadoId);
      setFilteredChamados(filtrarPorEstado(novaLista, estadoFilter));
      localStorage.setItem("chamadosCache", JSON.stringify(novaLista));
      return novaLista;
    });
  };

  if (loading) {
    return <p>Carregando chamados...</p>;
  }

  return (
    <div>
      {error && <Toast error={error} setError={setError} />}

      <ChamadosListFilter value={estadoFilter} onChange={handleFilterChange} />

      {filteredChamados.length === 0 && (
        <p className="mx-2">Nenhum chamado encontrado.</p>
      )}

      {filteredChamados.map((chamado) => (
        <Chamado
          key={chamado.id}
          chamado={chamado}
          setError={setError}
          onChamadoEstadoChange={onChamadoEstadoChange}
          onChamadoDelete={onChamadoDelete}
        />
      ))}
    </div>
  );
};

export default ChamadosList;

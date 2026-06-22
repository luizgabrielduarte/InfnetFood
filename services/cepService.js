const BASE_URL = 'https://viacep.com.br/ws';

export async function fetchAddressByCep(cep) {
  const cleanCep = String(cep).replace(/\D/g, '');

  if (cleanCep.length !== 8) {
    throw new Error('CEP deve ter 8 dígitos.');
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}/${cleanCep}/json/`);
  } catch (networkError) {
    throw new Error('Não foi possível buscar o CEP.');
  }

  if (!response.ok) {
    throw new Error('Não foi possível buscar o CEP.');
  }

  const data = await response.json();

  if (data.erro) {
    throw new Error('CEP não encontrado.');
  }

  return {
    street: data.logradouro,
    neighborhood: data.bairro,
    city: data.localidade,
    state: data.uf,
  };
}
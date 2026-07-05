import type { NormalizedIncomingMessage } from "../../schemas/whatsapp.schema.js";

const normalizeText = (text: string): string =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const hasAny = (text: string, terms: string[]): boolean =>
  terms.some((term) => text.includes(term));

export const buildAutoReplyText = (
  message: NormalizedIncomingMessage
): string | undefined => {
  if (message.type !== "text") {
    return "Graca e paz! No momento, nosso atendimento automatico entende melhor mensagens de texto. Voce pode enviar: cultos, localizacao ou pedido de oracao.";
  }

  const text = normalizeText(message.text ?? "");

  if (hasAny(text, ["culto", "cultos", "horario", "programacao", "domingo", "quarta"])) {
    return "Graca e paz! Nossos cultos sao online: domingo as 10h e quarta-feira as 19h. Sera uma alegria ter voce conosco.";
  }

  if (hasAny(text, ["local", "endereco", "endereco", "onde", "chegar", "colubande"])) {
    return "A Igreja Missionaria Filadelfia fica no Colubande, Sao Goncalo - RJ. Os cultos principais informados no site sao online.";
  }

  if (hasAny(text, ["oracao", "orar", "pedido", "intercessao"])) {
    return "Recebemos seu pedido de oracao. Nossa igreja ira apresentar sua causa em oracao. Se quiser, envie tambem seu nome e um breve resumo do pedido.";
  }

  if (hasAny(text, ["whatsapp", "contato", "falar", "atendente", "pessoa"])) {
    return "Recebemos sua mensagem. Assim que possivel, alguem da igreja dara continuidade ao atendimento por aqui.";
  }

  return "Graca e paz! Obrigado por entrar em contato com a Igreja Missionaria Filadelfia. Para atendimento rapido, envie uma destas palavras: cultos, localizacao ou oracao.";
};

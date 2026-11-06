import { useEffect, useState } from 'react'

export type HelperStage = 'welcome' | 'builder' | 'added' | 'cart' | 'sent'

const MESSAGES: Record<HelperStage, string> = {
  welcome: 'Oi! Eu sou o Açaizinho 💜 Toca num açaí pra montar do seu jeito!',
  builder: 'Escolhe seus complementos grátis. Os adicionais têm um custinho a mais 😉',
  added: 'Boa escolha! Sua sacola tá aqui embaixo. Toca nela quando terminar.',
  cart: 'Preenche nome e endereço que o pedido vai direto pro WhatsApp!',
  sent: 'Pedido enviado! Agora é só esperar o açaí chegar 😋',
}

const HIDE_KEY = 'cardapio-helper-off'

function readHidden() {
  try {
    return localStorage.getItem(HIDE_KEY) === '1'
  } catch {
    return false
  }
}

/** O mascote: um frutinho de açaí que pisca, balança e acena. */
function Mascot({ talking }: { talking: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className={`h-full w-full ${talking ? 'mascot-talk' : 'mascot-idle'}`} aria-hidden>
      <defs>
        <radialGradient id="berry" cx="38%" cy="32%" r="70%">
          <stop offset="0" stopColor="#8e3fa8" />
          <stop offset=".6" stopColor="#5b1f6b" />
          <stop offset="1" stopColor="#2a0d33" />
        </radialGradient>
      </defs>
      {/* folhinha */}
      <path className="mascot-leaf" d="M32 13c2-7 9-10 15-8-2 6-8 10-15 8Z" fill="#3fae6a" />
      <path d="M32 14c0-3 1-5 2-6" stroke="#2e7d4f" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* corpo */}
      <circle cx="32" cy="37" r="24" fill="url(#berry)" />
      <ellipse cx="23" cy="26" rx="6" ry="3.5" fill="#fff" opacity=".25" transform="rotate(-30 23 26)" />
      {/* olhos */}
      <g className="mascot-eyes">
        <ellipse cx="24" cy="36" rx="4.2" ry="5" fill="#fff" />
        <ellipse cx="40" cy="36" rx="4.2" ry="5" fill="#fff" />
        <circle cx="25" cy="37" r="2.4" fill="#1b0820" />
        <circle cx="41" cy="37" r="2.4" fill="#1b0820" />
        <circle cx="25.8" cy="35.8" r=".9" fill="#fff" />
        <circle cx="41.8" cy="35.8" r=".9" fill="#fff" />
      </g>
      {/* bochechas */}
      <ellipse cx="18" cy="44" rx="3.6" ry="2.2" fill="#ff8fb1" opacity=".7" />
      <ellipse cx="46" cy="44" rx="3.6" ry="2.2" fill="#ff8fb1" opacity=".7" />
      {/* boca */}
      {talking ? (
        <ellipse className="mascot-mouth" cx="32" cy="46" rx="3.6" ry="2.8" fill="#1b0820" />
      ) : (
        <path d="M28 45c2 2.6 6 2.6 8 0" stroke="#1b0820" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      )}
    </svg>
  )
}

type Props = {
  stage: HelperStage
  /** true quando alguma gaveta (sacola/montador) está aberta: o mascote vai pro topo */
  overlay: boolean
  /** true quando a barra da sacola está visível: o mascote sobe pra não cobrir */
  cartBar: boolean
}

export function Helper({ stage, overlay, cartBar }: Props) {
  const [hidden, setHidden] = useState(readHidden)
  const [bubble, setBubble] = useState(false)

  // mostra o balão quando a etapa muda (e na chegada, depois de um tempinho)
  useEffect(() => {
    const show = setTimeout(() => setBubble(true), stage === 'welcome' ? 1800 : 250)
    const hide = setTimeout(() => setBubble(false), stage === 'welcome' ? 11000 : 7000)
    return () => {
      clearTimeout(show)
      clearTimeout(hide)
    }
  }, [stage])

  if (hidden) return null

  const dismiss = () => {
    setHidden(true)
    try {
      localStorage.setItem(HIDE_KEY, '1')
    } catch {
      /* sem armazenamento: some só nesta visita */
    }
  }

  const position = overlay
    ? 'top-2 left-2 h-12 w-12'
    : `${cartBar ? 'bottom-24' : 'bottom-4'} left-3 h-16 w-16`

  return (
    <div className={`helper-enter fixed z-50 transition-all duration-500 ${position}`}>
      <button
        onClick={() => setBubble((b) => !b)}
        aria-label="Ajudante do cardápio"
        className="h-full w-full drop-shadow-[0_6px_10px_rgba(42,13,51,.35)] transition active:scale-90"
      >
        <Mascot talking={bubble} />
      </button>

      {bubble && (
        <div
          key={stage}
          role="status"
          className={`bubble-in absolute w-60 rounded-2xl bg-white p-3 pr-7 text-sm leading-snug text-ink shadow-xl ring-1 ring-acai-100 ${
            overlay ? 'left-14 top-0 origin-left' : 'bottom-[4.5rem] left-1 origin-bottom-left'
          }`}
        >
          {MESSAGES[stage]}
          <button
            onClick={() => setBubble(false)}
            aria-label="Fechar dica"
            className="absolute right-1.5 top-1 grid h-6 w-6 place-items-center rounded-full text-ink/40 hover:bg-acai-50"
          >
            ×
          </button>
          {!overlay && (
            <button onClick={dismiss} className="mt-1.5 block text-[11px] font-medium text-acai-700 underline-offset-2 hover:underline">
              Não preciso de ajuda
            </button>
          )}
          {/* rabinho do balão */}
          <span
            className={`absolute h-3 w-3 rotate-45 bg-white ${
              overlay ? '-left-1.5 top-4 border-b border-l border-acai-100' : '-bottom-1.5 left-6 border-b border-r border-acai-100'
            }`}
          />
        </div>
      )}
    </div>
  )
}

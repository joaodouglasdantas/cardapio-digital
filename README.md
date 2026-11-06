# Cardápio Digital

Cardápio digital para pequenos negócios (lanchonetes, açaiterias, restaurantes), com pedido enviado direto pelo **WhatsApp**. Feito para funcionar bem no celular.

> Projeto de demonstração com dados fictícios ("Açaí do Oeste", Mossoró/RN).

## Funcionalidades

- Cabeçalho com nome, horário e status **aberto/fechado** calculado automaticamente
- Busca e abas de categorias fixas no topo
- Sacola com quantidades, entrega ou retirada, forma de pagamento, troco e observações
- Pedido mínimo e taxa de entrega configuráveis
- Botão que abre o WhatsApp com o pedido já formatado
- Sacola salva no navegador (não perde ao recarregar)

## Tecnologias

React 19 · TypeScript · Vite · Tailwind CSS 4

## Rodando localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`.

## Adaptando para um cliente

Quase tudo fica em **`src/data/menu.json`**:

- `store.whatsapp`: número com DDI e DDD, só dígitos (ex.: `5584999999999`)
- `store.hours`: dias (0 = domingo) e horários de funcionamento
- `store.deliveryFee`, `store.minOrder`, `store.paymentMethods`
- `categories` e `products` (o campo `image` é opcional; sem ele aparece um ícone)

As cores ficam em `src/index.css`, no bloco `@theme`.

## Deploy

Conecte o repositório na [Vercel](https://vercel.com), que detecta o Vite automaticamente, e faça o deploy.

## Licença

MIT

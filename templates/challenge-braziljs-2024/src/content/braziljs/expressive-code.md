---
lang: 'pt-br'
title: 'Fase Final'
description: 'Participe da fase final do desafio e concorra a uma bolsa de estudos RocketSeat ONE no valor aproximado de R$ 2 mil'
namespace: 'console_template_braziljs'
meta_tags: 'braziljs, azion, edge computing'
ogImage: ''
---

```js showLineNumbers
  function acessarMarketplaceEProcurarBotManager() {
      console.log(
          "1. No menu lateral esquerdo, acesse o Marketplace e procure pelo template Bot Manager da Azion."
      );
      console.log("   a. Instale o template.");
  }

  function acessarDomainEProcurar() {
      console.log(
          "2. Volte ao menu e acesse - Domains -. Procure pelo domínio que foi criado em seu primeiro deploy, na etapa anterior."
      );
      console.log(
          "   a. Selecione o domínio e copie o ID do mesmo, que se encontra na URL, logo após /edit/<ID>"
      );
  }

  function abrirCreateEProcurarTemplate() {
      console.log(
          "3. Acesse o +Create e procure pelo template de segurança Bot Manager and Tor Block Starter Kit."
      );
      console.log("   a. Selecione o template.");
  }

  function nomearAConfiguracao(nomeDaConfiguracao) {
      console.log(`6. Nomeando a configuração como: ${nomeDaConfiguracao}.`);
  }

  function colarDomainIDeSalvar() {
      console.log(`7. Cole o Domain ID que foi copiado da URL e salve.`);
  }

  function aguardarDeployDoTemplate() {
      console.log("8. Aguarde enquanto o deploy é efetuado.");
  }

  function verificarValidacao() {
      console.log("Formas de validação:");
      console.log(
          "9. Acesse a listagem de Edge Firewall e veja se o nome escolhido aparece na mesma."
      );
  }

  acessarMarketplaceEProcurarBotManager();
  acessarDomainEProcurar();
  abrirCreateEProcurarTemplate();
  nomearAConfiguracao("Escolha um nome legal...");
  colarDomainIDeSalvar();
  aguardarDeployDoTemplate();
  verificarValidacao();
```
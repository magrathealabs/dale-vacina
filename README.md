# Dale Vacina

App do Slack para acompanhar o progresso da vacinação entre as pessoas da Magrathea.

## Uso


- `/vacina`: retorna as barras de progresso da vacinação da primeira e segunda dose
  ![vacina](https://user-images.githubusercontent.com/21130697/136725168-bd9b1b19-c6c8-4b81-88a7-f8ddc26449f6.png)
- `/vacina1dose @user`: registra o @user com a primeira dose e retorna as barras de progresso
  ![vacina1dose](https://user-images.githubusercontent.com/21130697/136725255-b24c15fa-6f10-44b0-b129-dd7715021d77.png)
- `/vacina2dose @user`: registra o @user com a segunda dose e retorna as barras de progresso 
  ![vacina2dose](https://user-images.githubusercontent.com/21130697/136725169-d634ee0e-623c-4382-a436-6feae8c0f2ac.png)


## Detalhes Técnicos

### "Servidor" e Banco de Dados
O sistema responsável por registrar e procurar pelos vacinados é o Google Sheets (Banco de Dados) com o uso do Google Apps Script ("Servidor"). Um exemplo da planilha utilizada se encontra abaixo.

![image](https://user-images.githubusercontent.com/21130697/129918337-c2906f88-f95b-47f6-b6f7-47ed53d45a26.png)

Nesse exemplo, os valores das linhas e colunas serão os seguintes:

```js
const LOG_LINE = 30;
const LOG_COLUMN = 4;

const firstDoseLocations = {
  currentCount: {
    line: 24,
    column: 1 
  },
  totalCount: {
    line: 24,
    column: 2 
  },
  users: {
    line: 24,
    column: 3
  }
}

const secondDoseLocations = {
  currentCount: {
    line: 28,
    column: 1 
  },
  totalCount: {
    line: 28,
    column: 2 
  },
  users: {
    line: 28,
    column: 3
  }
}
```

### App no Slack

Para interagir com a planilha, um app no Slack foi criado com um comando slash. O endpoint dos três comandos é o mesmo, e o que os difere é o texto do comando utilizado.

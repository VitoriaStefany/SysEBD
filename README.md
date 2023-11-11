# SysEBD

## Requisitos
É necessário ter o NodeJS instalado! 
[NodeJS](https://nodejs.org/en/)

## Para inicializar, é necessário executar os seguintes comandos:

### Clona este repositório
```
$ git clone https://github.com/VitoriaStefany/SysEBD.git
```
### Acessa a pasta do projeto
```
$ cd SysEBD
```
### Instala as dependências
```
$ npm install
```

## Com todas as dependências instaladas, já é possível iniciar o projeto!


```
// Inicia a aplicação em localhost:8080
$ npm run start

```

## Endpoints
|       Rota          |    Método    |                                                                   
|   ---------------   | :----------: |
|  `/user/:id`        |    GET       | 
|  `/auth/register`   |    POST      | 
|  `/auth/login`      |    POST      |   

## Schemas

### Users
|                         |    Type   | 
|-------------------------|:---------:|
| `Nome`                  | String    |
| `Email`                 | String    |
| `Senha`                 | String    |

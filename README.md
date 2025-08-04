# Modelo-Site 🏆

Uma aplicação web interativa desenvolvida em React para criação e visualização de modelos de camisetas esportivas. O projeto permite aos usuários personalizar camisetas com logos, navegar por diferentes modelos de esportes e visualizar designs em tempo real.

## 🚀 Funcionalidades

- **Criação de Modelos**: Interface intuitiva para personalizar camisetas com upload de logos
- **Drag & Drop**: Sistema de arrastar e soltar para posicionar logos nas camisetas
- **Galeria de Esportes**: Modelos específicos para Futebol, Vôlei e Basquete
- **Captura de Tela**: Funcionalidade para exportar designs criados
- **Interface Responsiva**: Design adaptável para diferentes dispositivos
- **Navegação Fluida**: Sistema de abas inferiores para fácil navegação

## 🛠️ Tecnologias Utilizadas

- **React** 18.2.0 - Biblioteca principal
- **React Router DOM** 6.3.0 - Roteamento da aplicação
- **HTML2Canvas** 1.4.1 - Captura de tela dos designs
- **CSS3** - Estilização e responsividade
- **Cloudinary** - Hospedagem de imagens

## 📁 Estrutura do Projeto

```
Modelo-Site/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── BottomTabs.jsx      # Navegação inferior
│   ├── pages/
│   │   ├── CriarModelo.jsx     # Página principal de criação
│   │   ├── Futebol.jsx         # Modelos de futebol
│   │   ├── Volei.jsx           # Modelos de vôlei
│   │   └── Basquete.jsx        # Modelos de basquete
│   ├── App.jsx                 # Componente principal
│   ├── index.js               # Ponto de entrada
│   └── index.css              # Estilos globais
├── package.json
├── vercel.json                # Configuração de deploy
└── README.md
```

## 🎮 Como Usar

### Criando um Modelo
1. Acesse a aba "Crie seu modelo"
2. Escolha a cor da camiseta (Preto ou Branco)
3. Faça upload da sua logo clicando em "Adicionar Logo"
4. Arraste e posicione a logo na camiseta
5. Use os botões "+" e "-" para ajustar o tamanho
6. Clique em "Capturar Modelo" para salvar o design

### Navegando pelos Esportes
- **Futebol**: Visualize modelos Dragão e Águia
- **Vôlei**: Explore designs específicos para vôlei
- **Basquete**: Confira modelos de basquete

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn

### Passos para executar

1. **Clone o repositório**
```bash
git clone https://github.com/jvictordev7/Modelo-Site.git
cd Modelo-Site
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute o projeto**
```bash
npm start
```

4. **Acesse a aplicação**
```
http://localhost:3000
```

## 📦 Build para Produção

```bash
npm run build
```

O comando cria uma pasta `build` com os arquivos otimizados para produção.

## 🌐 Deploy

O projeto está configurado para deploy automático na Vercel através do arquivo `vercel.json`.

### Deploy manual na Vercel:
```bash
npm install -g vercel
vercel --prod
```

## 🔧 Scripts Disponíveis

- `npm start` - Executa a aplicação em modo de desenvolvimento
- `npm run build` - Cria build de produção
- `npm test` - Executa os testes
- `npm run eject` - Remove dependência do Create React App (irreversível)

## 📱 Funcionalidades Técnicas

### Sistema de Upload de Logos
- Suporte a múltiplas logos por camiseta
- Preview em tempo real
- Controle de posição e tamanho

### Captura de Imagem
- Utiliza HTML2Canvas para captura de alta qualidade
- Exportação em formato PNG
- Resolução otimizada (3x para qualidade superior)

### Responsividade
- Design adaptável para mobile e desktop
- Navegação otimizada por abas
- Interface intuitiva

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**João Victor** - [@jvictordev7](https://github.com/jvictordev7)

## 📞 Contato

- GitHub: [@jvictordev7](https://github.com/jvictordev7)
- LinkedIn: [João Victor](https://linkedin.com/in/jvictordev7)

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!

import React, { useState } from "react";
import html2canvas from 'html2canvas';

export default function CriarModelo() {
  // Array com as URLs das camisetas do Cloudinary
  const camisetas = [
    {
      id: 1,
      nome: "Modelo Masculino Preto",
      url: "https://res.cloudinary.com/dx8lkbjpl/image/upload/v1754261290/modelo-masc-preto_xt9rws.png",
      cor: "#000000",
      corNome: "Preto"
    },
    {
      id: 2,
      nome: "Modelo Masculino Branco",
      url: "https://res.cloudinary.com/dx8lkbjpl/image/upload/v1754261290/modelo-masc-branco_dodgav.png",
      cor: "#FFFFFF",
      corNome: "Branco"
    }
    // Você pode adicionar mais camisetas aqui
  ];

  // Estado para controlar qual camiseta está sendo exibida
  const [camisetaAtual, setCamisetaAtual] = useState(0);
  // Estado para armazenar as logos do usuário (array)
  const [logos, setLogos] = useState([]);
  // Estado para controlar qual logo está sendo arrastada
  const [draggingIndex, setDraggingIndex] = useState(null);

  // Função para selecionar camiseta por cor
  const selecionarCamiseta = (index) => {
    setCamisetaAtual(index);
  };

  // Função para lidar com upload da logo
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newLogo = {
          id: Date.now(), // ID único
          src: e.target.result,
          position: { x: 50, y: 35 }, // posição inicial
          size: 60 // tamanho inicial
        };
        setLogos(prev => [...prev, newLogo]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para remover uma logo específica
  const removerLogo = (logoId) => {
    setLogos(prev => prev.filter(logo => logo.id !== logoId));
  };

  // Função para remover todas as logos
  const removerTodasLogos = () => {
    setLogos([]);
  };

  // Função para lidar com o início do arraste
  const handleMouseDown = (e, logoIndex) => {
    setDraggingIndex(logoIndex);
    e.preventDefault();
  };

  // Função para lidar com o movimento do mouse
  const handleMouseMove = (e) => {
    if (draggingIndex === null) return;
    
    const container = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - container.left) / container.width) * 100;
    const y = ((e.clientY - container.top) / container.height) * 100;
    
    // Limitar a posição dentro da camiseta
    const clampedX = Math.max(10, Math.min(90, x));
    const clampedY = Math.max(10, Math.min(90, y));
    
    setLogos(prev => prev.map((logo, index) => 
      index === draggingIndex 
        ? { ...logo, position: { x: clampedX, y: clampedY } }
        : logo
    ));
  };

  // Função para finalizar o arraste
  const handleMouseUp = () => {
    setDraggingIndex(null);
  };

  // Função para aumentar uma logo específica
  const aumentarLogo = (logoIndex) => {
    setLogos(prev => prev.map((logo, index) => 
      index === logoIndex 
        ? { ...logo, size: Math.min(120, logo.size + 10) }
        : logo
    ));
  };

  // Função para diminuir uma logo específica
  const diminuirLogo = (logoIndex) => {
    setLogos(prev => prev.map((logo, index) => 
      index === logoIndex 
        ? { ...logo, size: Math.max(30, logo.size - 10) }
        : logo
    ));
  };

  // Função alternativa para criar imagem composta usando Canvas API
  const criarImagemComposta = async () => {
    try {
      // Pega as dimensões reais do elemento da camiseta para manter proporções
      const elementoCamiseta = document.querySelector('.camiseta-container');
      const elementoImagem = document.querySelector('.camiseta-image');
      
      if (!elementoCamiseta || !elementoImagem) {
        throw new Error('Elementos não encontrados');
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Usa as dimensões reais do elemento para manter proporções exatas
      const rect = elementoImagem.getBoundingClientRect();
      canvas.width = rect.width * 3;  // 3x para alta qualidade
      canvas.height = rect.height * 3; // 3x para alta qualidade
      
      // Fundo transparente (igual ao elemento original)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Carrega a imagem da camiseta
      const camisetaImg = new Image();
      camisetaImg.crossOrigin = 'anonymous';
      
      return new Promise((resolve, reject) => {
        camisetaImg.onload = async () => {
          try {
            // Ativa suavização para melhor qualidade da camiseta
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            // Desenha a camiseta
            ctx.drawImage(camisetaImg, 0, 0, canvas.width, canvas.height);
            
            // Desenha cada logo
            for (const logo of logos) {
              const logoImg = new Image();
              logoImg.src = logo.src;
              
              await new Promise((logoResolve) => {
                logoImg.onload = () => {
                  // Calcula posições usando as mesmas proporções do elemento original
                  const logoX = (logo.position.x / 100) * canvas.width - (logo.size * 3 / 2); // 3x para qualidade
                  const logoY = (logo.position.y / 100) * canvas.height - (logo.size * 3 / 2);
                  
                  // Ativa suavização para melhor qualidade
                  ctx.imageSmoothingEnabled = true;
                  ctx.imageSmoothingQuality = 'high';
                  
                  ctx.drawImage(logoImg, logoX, logoY, logo.size * 3, logo.size * 3); // 3x para qualidade
                  logoResolve();
                };
                logoImg.onerror = () => logoResolve(); // Continue mesmo se uma logo falhar
              });
            }
            
            // Converte para blob com qualidade máxima
            canvas.toBlob(resolve, 'image/png', 1.0);
            
          } catch (error) {
            reject(error);
          }
        };
        
        camisetaImg.onerror = () => reject(new Error('Falha ao carregar imagem da camiseta'));
        camisetaImg.src = camiseta.url;
      });
      
    } catch (error) {
      console.error('Erro ao criar imagem composta:', error);
      return null;
    }
  };

  // Função para capturar a camiseta com as logos (print da tela)
  const capturarCamisetaComLogos = async () => {
    try {
      // Encontra o elemento que contém a camiseta com as logos
      const elementoCamiseta = document.querySelector('.camiseta-container');
      
      if (!elementoCamiseta) {
        throw new Error('Elemento da camiseta não encontrado');
      }

      // Aguarda um momento para garantir que as imagens foram carregadas
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Captura o elemento como imagem usando html2canvas
      const canvas = await html2canvas(elementoCamiseta, {
        backgroundColor: null, // Fundo transparente para manter o original
        scale: 3, // 3x para alta qualidade
        useCORS: true,
        allowTaint: true,
        logging: false,
        proxy: undefined,
        removeContainer: true,
        imageTimeout: 15000,
        width: elementoCamiseta.offsetWidth,
        height: elementoCamiseta.offsetHeight,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        onclone: function(clonedDoc) {
          // Garante que as imagens mantenham as mesmas propriedades
          const originalImages = document.querySelectorAll('.camiseta-container img');
          const clonedImages = clonedDoc.querySelectorAll('.camiseta-container img');
          
          originalImages.forEach((originalImg, index) => {
            if (clonedImages[index]) {
              const clonedImg = clonedImages[index];
              // Copia exatamente o estilo computado
              const computedStyle = window.getComputedStyle(originalImg);
              clonedImg.style.cssText = originalImg.style.cssText;
              clonedImg.style.position = computedStyle.position;
              clonedImg.style.top = computedStyle.top;
              clonedImg.style.left = computedStyle.left;
              clonedImg.style.width = computedStyle.width;
              clonedImg.style.height = computedStyle.height;
              clonedImg.style.transform = computedStyle.transform;
              
              if (originalImg.src && originalImg.src.startsWith('data:')) {
                clonedImg.crossOrigin = 'anonymous';
              }
            }
          });
        }
      });
      
      // Converte o canvas para blob com qualidade máxima
      return new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/png', 1.0);
      });
      
    } catch (error) {
      console.error('Erro ao capturar imagem:', error);
      return null;
    }
  };

  // Função para baixar todas as logos individualmente
  const baixarLogosIndividuais = async () => {
    for (let i = 0; i < logos.length; i++) {
      const logo = logos[i];
      try {
        // Converte o data URL para blob
        const response = await fetch(logo.src);
        const blob = await response.blob();
        const urlBlob = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = urlBlob;
        link.download = `Logo_${i + 1}_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(urlBlob);
        
        // Pequena pausa entre downloads para não sobrecarregar
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Erro ao baixar logo ${i + 1}:`, error);
      }
    }
  };

  // Função para compartilhar no WhatsApp
  const compartilharWhatsApp = async (camiseta) => {
    try {
      console.log('Iniciando captura de tela...');
      
      // Tenta primeiro o html2canvas
      let imagemCompleta = await capturarCamisetaComLogos();
      
      // Se falhar, tenta o método Canvas API alternativo
      if (!imagemCompleta) {
        console.log('html2canvas falhou, tentando método Canvas API...');
        imagemCompleta = await criarImagemComposta();
      }
      
      if (!imagemCompleta) {
        throw new Error('Não foi possível capturar a imagem da tela');
      }
      
      console.log('Imagem capturada com sucesso!');
      
      // Verifica se está no mobile e tem a API nativa do compartilhamento
      if (navigator.share && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // Cria um arquivo da imagem completa
        const arquivo = new File([imagemCompleta], `Modelo_Personalizado_${camiseta.corNome}_ThreeBrothers.png`, {
          type: 'image/png'
        });
        
        // Prepara o conteúdo para compartilhar
        const shareData = {
          title: `Three Brothers - Modelo Personalizado`,
          text: `Olha meu modelo personalizado: ${camiseta.nome}!

Camiseta ${camiseta.corNome} customizada
${logos.length} logo(s) personalizada(s)
Criado na Three Brothers

Visite nossa loja e crie o seu tambem!`,
          files: [arquivo]
        };
        
        // Usa a API nativa de compartilhamento
        await navigator.share(shareData);
        
      } else {
        // Fallback para desktop ou navegadores que não suportam
        // Baixa a imagem completa
        const nomeArquivo = `Modelo_Personalizado_${camiseta.corNome}_ThreeBrothers.png`;
        const urlBlob = window.URL.createObjectURL(imagemCompleta);
        
        const link = document.createElement('a');
        link.href = urlBlob;
        link.download = nomeArquivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(urlBlob);
        
        // Baixa também as logos individuais
        if (logos.length > 0) {
          await baixarLogosIndividuais();
        }
        
        // Prepara a mensagem para WhatsApp Web
        const mensagem = `Olha meu modelo personalizado: ${camiseta.nome}!

Camiseta ${camiseta.corNome} customizada
${logos.length} logo(s) personalizada(s)
Criado na Three Brothers
As imagens foram capturadas da tela e baixadas!

Visite nossa loja e crie o seu tambem!`;
        
        // Abre o WhatsApp Web
        const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
        
        // Notifica o usuário
        const totalArquivos = 1 + logos.length;
        alert(`✅ ${totalArquivos} arquivo(s) baixado(s) com sucesso!
        
📁 Arquivos baixados:
• ${nomeArquivo} (captura da tela com logos)
${logos.length > 0 ? `• ${logos.length} logo(s) individual(is)` : ''}

📱 No WhatsApp Web, clique no ícone de anexo (📎) e selecione as imagens!`);
      }
      
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      
      // Fallback em caso de erro - baixa só a camiseta e logos separadamente
      try {
        alert('⚠️ Erro na captura da tela. Baixando arquivos separadamente...');
        // Baixa a camiseta
        const response = await fetch(camiseta.url);
        const blob = await response.blob();
        const urlBlob = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = urlBlob;
        link.download = `Camiseta_${camiseta.corNome}_ThreeBrothers.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(urlBlob);
        
        // Baixa as logos
        if (logos.length > 0) {
          await baixarLogosIndividuais();
        }
        
        // Prepara mensagem de fallback
        const mensagem = `Olha meu modelo personalizado: ${camiseta.nome}!

Camiseta ${camiseta.corNome} customizada
${logos.length} logo(s) personalizada(s)
Criado na Three Brothers
Link da camiseta: ${camiseta.url}

Visite nossa loja e crie o seu tambem!`;
        
        const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
        
        alert(`✅ Arquivos baixados separadamente!
        
📁 ${1 + logos.length} arquivo(s) baixado(s)
📱 Anexe-os no WhatsApp!`);
        
      } catch (fallbackError) {
        // Último fallback - só abre WhatsApp com mensagem
        const mensagem = `Olha meu modelo personalizado: ${camiseta.nome}!

Camiseta ${camiseta.corNome} customizada
${logos.length} logo(s) personalizada(s)
Criado na Three Brothers

Visite nossa loja e crie o seu tambem!`;
        
        const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
        
        alert('❌ Erro ao baixar as imagens. O WhatsApp foi aberto com a mensagem.');
      }
    }
  };

  const camiseta = camisetas[camisetaAtual];

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="sport-icon" style={{fontSize: '2.5rem', marginBottom: '5px'}}>🎨</div>
        <h1 className="page-title" style={{marginTop: '0px', marginBottom: '5px', fontSize: '1.8rem'}}>Crie seu Modelo</h1>
        <p className="page-description" style={{marginTop: '0px', marginBottom: '15px', fontSize: '0.9rem'}}>
          Confira os modelos disponíveis em nossa coleção personalizada!
        </p>
        
        {/* Carrossel de Camisetas */}
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '400px',
          margin: '10px auto'
        }}>
          {/* Card da Camiseta */}
          <div 
            className="camiseta-card"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '15px',
              borderRadius: '20px',
              border: '2px solid #ff6b35',
              textAlign: 'center',
              transition: 'all 0.5s ease',
              margin: '0 10px'
            }}>
            <div 
              className="camiseta-container"
              style={{
                position: 'relative',
                display: 'inline-block',
                width: '100%'
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img 
                src={camiseta.url} 
                alt={camiseta.nome}
                className="camiseta-image"
                style={{
                  width: '100%',
                  height: '280px',
                  objectFit: 'contain',
                  borderRadius: '10px',
                  marginBottom: '10px',
                  background: 'transparent'
                }}
              />
              {/* Logos do usuário sobrepostas */}
              {logos.map((logo, index) => (
                <img 
                  key={logo.id}
                  src={logo.src}
                  alt={`Logo ${index + 1}`}
                  onMouseDown={(e) => handleMouseDown(e, index)}
                  style={{
                    position: 'absolute',
                    top: `${logo.position.y}%`,
                    left: `${logo.position.x}%`,
                    transform: 'translate(-50%, -50%)',
                    width: `${logo.size}px`,
                    height: `${logo.size}px`,
                    objectFit: 'contain',
                    borderRadius: '5px',
                    zIndex: 2,
                    cursor: draggingIndex === index ? 'grabbing' : 'grab',
                    userSelect: 'none'
                  }}
                  draggable={false}
                />
              ))}
            </div>
            <div style={{
              fontSize: '0.9rem', 
              color: '#ff6b35', 
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
              {camiseta.nome}
            </div>
            
            {/* Seletores de Cor da Camiseta */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '15px',
              marginBottom: '15px'
            }}>
              {camisetas.map((camiseta, index) => (
                <div
                  key={index}
                  onClick={() => selecionarCamiseta(index)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Bolinha da cor */}
                  <div
                    style={{
                      width: '35px',
                      height: '35px',
                      borderRadius: '50%',
                      background: camiseta.cor,
                      border: index === camisetaAtual 
                        ? '3px solid #ff6b35' 
                        : camiseta.cor === '#FFFFFF' 
                          ? '2px solid rgba(255, 255, 255, 0.5)' 
                          : '2px solid rgba(0, 0, 0, 0.3)',
                      boxShadow: index === camisetaAtual 
                        ? '0 0 15px rgba(255, 107, 53, 0.6)' 
                        : '0 2px 8px rgba(0, 0, 0, 0.2)',
                      transform: index === camisetaAtual ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.3s ease'
                    }}
                  />
                  {/* Nome da cor */}
                  <span style={{
                    fontSize: '0.7rem',
                    color: index === camisetaAtual ? '#ff6b35' : 'rgba(255, 255, 255, 0.7)',
                    fontWeight: index === camisetaAtual ? 'bold' : 'normal',
                    marginTop: '5px',
                    transition: 'all 0.3s ease'
                  }}>
                    {camiseta.corNome}
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {/* Botão para adicionar nova logo */}
              <label style={{
                background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
                border: 'none',
                color: 'black',
                padding: '12px 20px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <span>🎨</span>
                Adicionar Logo ({logos.length})
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  style={{ display: 'none' }}
                />
              </label>

              {/* Lista de logos com controles individuais */}
              {logos.map((logo, index) => (
                <div key={logo.id} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '10px',
                  borderRadius: '15px',
                  border: '1px solid rgba(255, 107, 53, 0.3)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px'
                  }}>
                    <span style={{
                      color: '#ff6b35',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      Logo {index + 1}
                    </span>
                    <button 
                      onClick={() => removerLogo(logo.id)}
                      style={{
                        background: 'rgba(255, 0, 0, 0.8)',
                        border: 'none',
                        color: 'white',
                        width: '25px',
                        height: '25px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <button 
                      onClick={() => diminuirLogo(index)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '2px solid #ff6b35',
                        color: '#ff6b35',
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      −
                    </button>
                    <span style={{
                      color: '#ff6b35',
                      fontSize: '0.7rem',
                      minWidth: '40px',
                      textAlign: 'center'
                    }}>
                      {logo.size}px
                    </span>
                    <button 
                      onClick={() => aumentarLogo(index)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '2px solid #ff6b35',
                        color: '#ff6b35',
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}

              {/* Dica de uso */}
              {logos.length > 0 && (
                <div style={{
                  color: '#ff6b35',
                  fontSize: '0.7rem',
                  textAlign: 'center',
                  opacity: '0.8'
                }}>
                  🎯 Arraste as logos para posicionar
                </div>
              )}

              {/* Botão para limpar todas as logos */}
              {logos.length > 1 && (
                <button 
                  onClick={removerTodasLogos}
                  style={{
                    background: 'rgba(255, 0, 0, 0.6)',
                    border: 'none',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease'
                  }}
                >
                  🗑️ Limpar Todas ({logos.length})
                </button>
              )}

              <button 
                className="whatsapp-button"
                onClick={() => compartilharWhatsApp(camiseta)}
              >
                <span>📱</span>
                Compartilhar no WhatsApp
              </button>
            </div>
          </div>

        </div>

        {/* Informação da Camiseta Selecionada */}
        <div style={{
          textAlign: 'center',
          color: '#ff6b35',
          fontSize: '0.8rem',
          marginTop: '10px',
          fontWeight: 'bold'
        }}>
          Camiseta {camiseta.corNome} Selecionada
        </div>
      </div>
    </div>
  );
}

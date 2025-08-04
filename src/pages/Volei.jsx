import React, { useState } from "react";

export default function Volei() {
  // Array com as URLs das camisetas do Cloudinary
  const camisetas = [
    {
      id: 1,
      nome: "Modelo Feminino Branco",
      url: "https://res.cloudinary.com/dx8lkbjpl/image/upload/v1754260776/modelo-fem-branco_ipfpti.png"
    },
    {
      id: 2,
      nome: "Modelo Feminino Preto",
      url: "https://res.cloudinary.com/dx8lkbjpl/image/upload/v1754260775/modelo-fem-preto_ypmhpo.png"
    }
    // Você pode adicionar mais camisetas aqui
  ];

  // Estado para controlar qual camiseta está sendo exibida
  const [camisetaAtual, setCamisetaAtual] = useState(0);

  // Função para ir para a próxima camiseta
  const proximaCamiseta = () => {
    setCamisetaAtual((prev) => (prev + 1) % camisetas.length);
  };

  // Função para ir para a camiseta anterior
  const camisetaAnterior = () => {
    setCamisetaAtual((prev) => (prev - 1 + camisetas.length) % camisetas.length);
  };

  // Função para compartilhar no WhatsApp
  const compartilharWhatsApp = async (camiseta) => {
    try {
      // Verifica se está no mobile e tem a API nativa do compartilhamento
      if (navigator.share && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // Baixa a imagem como blob
        const response = await fetch(camiseta.url);
        const blob = await response.blob();
        
        // Cria um arquivo da imagem
        const arquivo = new File([blob], `${camiseta.nome.replace(/\s+/g, '_')}_ThreeBrothers.png`, {
          type: 'image/png'
        });
        
        // Prepara o conteúdo para compartilhar
        const shareData = {
          title: `Three Brothers - ${camiseta.nome}`,
          text: `🔥 Olha essa camiseta incrível: ${camiseta.nome}! 

👕 Modelo exclusivo da Three Brothers
🏐 Categoria: Vôlei

#ThreeBrothers #Volei #Camisetas #Exclusivo`,
          files: [arquivo]
        };
        
        // Usa a API nativa de compartilhamento
        await navigator.share(shareData);
        
      } else {
        // Fallback para desktop ou navegadores que não suportam
        // Baixa a imagem
        const nomeArquivo = `${camiseta.nome.replace(/\s+/g, '_')}_ThreeBrothers.png`;
        const response = await fetch(camiseta.url);
        const blob = await response.blob();
        const urlBlob = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = urlBlob;
        link.download = nomeArquivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(urlBlob);
        
        // Prepara a mensagem para WhatsApp Web
        const mensagem = `🔥 Olha essa camiseta incrível: ${camiseta.nome}! 

👕 Modelo exclusivo da Three Brothers
🏐 Categoria: Vôlei
📱 A imagem foi baixada automaticamente!

#ThreeBrothers #Volei #Camisetas #Exclusivo`;
        
        // Abre o WhatsApp Web
        const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
        
        // Notifica o usuário
        alert(`✅ Imagem "${nomeArquivo}" baixada com sucesso!\n\n📱 No WhatsApp Web, clique no ícone de anexo (📎) e selecione a imagem baixada!`);
      }
      
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      
      // Fallback em caso de erro
      const mensagem = `🔥 Olha essa camiseta incrível: ${camiseta.nome}! 

👕 Modelo exclusivo da Three Brothers
🏐 Categoria: Vôlei
🖼️ Link da imagem: ${camiseta.url}

#ThreeBrothers #Volei #Camisetas #Exclusivo`;
      
      const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
      window.open(url, '_blank');
    }
  };

  const camiseta = camisetas[camisetaAtual];

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="sport-icon" style={{fontSize: '2.5rem', marginBottom: '5px'}}>🏐</div>
        <h1 className="page-title" style={{marginTop: '0px', marginBottom: '5px', fontSize: '1.8rem'}}>Vôlei</h1>
        <p className="page-description" style={{marginTop: '0px', marginBottom: '15px', fontSize: '0.9rem'}}>
          Confira as camisetas de vôlei disponíveis em nossa coleção!
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
            <div style={{
              fontSize: '0.9rem', 
              color: '#ff6b35', 
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
              {camiseta.nome}
            </div>
            
            {/* Indicador de posição */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '15px'
            }}>
              {camisetas.map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: index === camisetaAtual ? '#ff6b35' : 'rgba(255, 255, 255, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <button 
                className="whatsapp-button"
                onClick={() => compartilharWhatsApp(camiseta)}
              >
                <span>📱</span>
                Compartilhar no WhatsApp
              </button>
            </div>
          </div>

          {/* Setas posicionadas para mobile */}
          {/* Seta Esquerda */}
          <button 
            onClick={camisetaAnterior}
            className="carousel-arrow"
            style={{
              position: 'absolute',
              left: '-15px',
              top: '45%',
              transform: 'translateY(-50%)',
              background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
              border: 'none',
              color: 'black',
              width: '35px',
              height: '35px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
              transition: 'all 0.3s ease',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              touchAction: 'manipulation'
            }}
            onTouchStart={(e) => {
              e.target.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onTouchEnd={(e) => {
              e.target.style.transform = 'translateY(-50%) scale(1)';
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            ◀
          </button>

          {/* Seta Direita */}
          <button 
            onClick={proximaCamiseta}
            className="carousel-arrow"
            style={{
              position: 'absolute',
              right: '-15px',
              top: '45%',
              transform: 'translateY(-50%)',
              background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
              border: 'none',
              color: 'black',
              width: '35px',
              height: '35px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
              transition: 'all 0.3s ease',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              touchAction: 'manipulation'
            }}
            onTouchStart={(e) => {
              e.target.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onTouchEnd={(e) => {
              e.target.style.transform = 'translateY(-50%) scale(1)';
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            ▶
          </button>
        </div>

        {/* Contador */}
        <div style={{
          textAlign: 'center',
          color: '#ff6b35',
          fontSize: '0.9rem',
          marginTop: '15px',
          fontWeight: 'bold'
        }}>
          {camisetaAtual + 1} de {camisetas.length}
        </div>
      </div>
    </div>
  );
}

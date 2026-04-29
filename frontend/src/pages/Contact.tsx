import './Contact.css';

export function Contact() {
  const contactMethods = [
    {
      icon: 'W',
      title: 'WhatsApp',
      description: '+34 123 456 789',
      link: 'https://wa.me/34123456789',
      color: '#25D366',
    },
    {
      icon: '@',
      title: 'Email',
      description: 'info@fitmanager.com',
      link: 'mailto:info@fitmanager.com',
      color: '#EA4335',
    },
    {
      icon: '☎',
      title: 'Teléfono',
      description: '+34 912 345 678',
      link: 'tel:+34912345678',
      color: '#f97316',
    },
    {
      icon: 'L',
      title: 'Ubicación',
      description: 'Madrid, España',
      link: 'https://maps.google.com',
      color: '#4285F4',
    },
  ];

  const socialMedia = [
    {
      name: 'Instagram',
      icon: 'IG',
      url: 'https://instagram.com/fitmanager',
      color: '#E4405F',
    },
    {
      name: 'Facebook',
      icon: 'FB',
      url: 'https://facebook.com/fitmanager',
      color: '#1877F2',
    },
    {
      name: 'TikTok',
      icon: 'TK',
      url: 'https://tiktok.com/@fitmanager',
      color: '#000000',
    },
    {
      name: 'YouTube',
      icon: 'YT',
      url: 'https://youtube.com/@fitmanager',
      color: '#FF0000',
    },
    {
      name: 'LinkedIn',
      icon: 'LI',
      url: 'https://linkedin.com/company/fitmanager',
      color: '#0A66C2',
    },
  ];

  return (
    <div className="contact-page">
      {/* Encabezado */}
      <div className="contact-header">
        <h1>Contacta con Nosotros</h1>
        <p>Estamos aquí para ayudarte. Elige tu forma favorita de contacto.</p>
      </div>

      {/* Métodos de contacto principales */}
      <section className="contact-methods">
        <div className="methods-grid">
          {contactMethods.map((method) => (
            <a
              key={method.title}
              href={method.link}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card"
              style={{
                '--accent-color': method.color,
              } as React.CSSProperties}
            >
              <div className="card-icon">{method.icon}</div>
              <h3>{method.title}</h3>
              <p>{method.description}</p>
              <span className="card-arrow">→</span>
            </a>
          ))}
        </div>
      </section>

      {/* Redes sociales */}
      <section className="social-section">
        <h2>Síguenos en Redes Sociales</h2>
        <div className="social-grid">
          {socialMedia.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-card"
              style={{
                '--social-color': social.color,
              } as React.CSSProperties}
              title={social.name}
            >
              <div className="social-icon">{social.icon}</div>
              <span>{social.name}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Información adicional */}
      <section className="contact-info">
        <div className="info-card">
          <h3>Horario de Atención</h3>
          <p>Lunes a Viernes: 9:00 - 21:00</p>
          <p>Sábado: 10:00 - 18:00</p>
          <p>Domingo: Cerrado</p>
        </div>
        <div className="info-card">
          <h3>Tiempo de Respuesta</h3>
          <p>Correo: 24h</p>
          <p>WhatsApp: Inmediato</p>
          <p>Teléfono: Disponible durante horario</p>
        </div>
      </section>
    </div>
  );
}


export default function Home() {
  return (
    <main className="maintenance-shell">
      <div className="maintenance-grid" aria-hidden="true" />
      <section className="maintenance-content" aria-labelledby="maintenance-title">
        <div className="brand-mark" aria-label="Nakliyem Para">
          <span className="brand-mark-icon">₺</span>
          <span>Nakliyem Para</span>
        </div>

        <div className="status-label">
          <span className="status-dot" /> Sistem bakımı
        </div>

        <h1 id="maintenance-title">Daha iyi bir deneyim için kısa bir mola.</h1>
        <p className="maintenance-copy">
          Nakliyem Para&apos;yı daha güvenli ve hızlı hale getiriyoruz. Çalışmamız tamamlandığında
          burada olacağız.
        </p>

        <div className="maintenance-info">
          <div>
            <span className="info-label">Durum</span>
            <strong>Planlı bakım</strong>
          </div>
          <div>
            <span className="info-label">Erişim</span>
            <strong>Yakında tekrar açık</strong>
          </div>
        </div>

        <p className="maintenance-footer">Anlayışınız için teşekkür ederiz.</p>
      </section>
      <div className="maintenance-orbit orbit-one" aria-hidden="true" />
      <div className="maintenance-orbit orbit-two" aria-hidden="true" />
    </div>
  );
}

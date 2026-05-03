function PrivacyPolicy() {
  return (
    <main className="legal-page fade-in">
      <h1>Privacy Policy</h1>
      <p>
        QuickDrop is built for minimal data usage. We do not require account registration for room
        usage and we only process the data needed to run real-time room sharing.
      </p>

      <h2>What We Collect</h2>
      <ul>
        <li>Room codes and temporary room content (messages/files) for active sessions.</li>
        <li>Basic technical metadata needed to keep rooms functional and secure.</li>
      </ul>

      <h2>Cookies and Advertising</h2>
      <p>
        QuickDrop may use cookies and similar technologies, including those required by Google AdSense,
        to measure performance and serve relevant ads.
      </p>

      <h2>Third-Party Services</h2>
      <ul>
        <li>Cloudinary for media file hosting and delivery.</li>
        <li>MongoDB for temporary room and message storage.</li>
        <li>Google AdSense for ad serving.</li>
      </ul>

      <h2>Data Safety</h2>
      <p>
        We use practical safeguards to protect user data in transit and storage. Since rooms are
        temporary by design, content is not intended for permanent archival use.
      </p>
    </main>
  );
}

export default PrivacyPolicy;

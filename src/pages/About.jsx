import AdBanner from "../components/ads/AdBanner";

function About() {
  return (
    <main className="legal-page fade-in">
      <h1>About QuickDrop</h1>
      <p>
        QuickDrop is a real-time room-based sharing app that lets people quickly exchange text, code
        snippets, images, and files using a simple room code.
      </p>
      <p>
        The platform is designed for temporary collaboration. Create a room, share the code, and join
        instantly without account setup. Messages and shared files are synced live to connected users.
      </p>
      <p>
        Rooms expire automatically after their selected duration so sessions stay lightweight, focused,
        and privacy-friendly.
      </p>
      <AdBanner slot="1111111111" className="legal-ad-bottom" />
    </main>
  );
}

export default About;

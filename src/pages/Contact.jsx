function Contact() {
  return (
    <main className="legal-page fade-in">
      <h1>Contact</h1>
      <p>For support or business inquiries, reach us at:</p>
      <a className="legal-email-link" href="mailto:hello@quickdrop.app">
        shlokkatiyar62@gmail.com
      </a>

      <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          rows={5}
          placeholder="Tell us how we can help..."
          aria-label="Message"
        />
        <button className="button" type="submit">
          Send
        </button>
      </form>
    </main>
  );
}

export default Contact;

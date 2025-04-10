import { useState } from "react";

export default function Home() {
  const [lightboxImage, setLightboxImage] = useState(null);

  const images = [
    "nails(2).JPG",
    "nails(3).JPG",
    "nails(4).JPG",
    "nails(5).JPG",
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "2rem" }}>
        Welcome to Natalie's Booking Portal
      </h1>

      {/* About Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "3rem",
          flexWrap: "wrap",
          marginBottom: "4rem",
        }}
      >
        <div style={{ maxWidth: "500px", textAlign: "left", fontSize: "1.1rem", lineHeight: "1.7" }}>
          <h2 style={{ marginBottom: "1rem" }}>About Natalie</h2>
          <p>
            Hi! I’m a beginner nail tech based in the northern Los Angeles area with a passion for all things art,
            beauty, and self-care. I’m inspired by colors, creativity, and the little details that make each set of
            nails unique. I love experimenting with new designs and techniques and always enjoy trying something fresh.
            Whether it’s through bold art or soft elegance, my goal is to help others feel confident and cared for—one
            nail at a time!
          </p>
        </div>

        <img
          src="/nataliepicture.jpeg"
          alt="nail art"
          style={{
            width: "400px",
            borderRadius: "15px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          }}
        />
      </div>

      <hr style={{ width: "90%", margin: "2rem auto", borderTop: "2px solid #ccc" }} />

      {/* Portfolio Section */}
      <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "1rem" }}>Nail Portfolio</h2>
      <p style={{ textAlign: "center", marginBottom: "2rem", fontSize: "1rem", color: "#555" }}>
        A showcase of past designs and styles crafted by Natalie.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          padding: "0 2rem",
          maxWidth: "1000px",
          margin: "0 auto 3rem",
        }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            style={{ cursor: "pointer", transition: "transform 0.3s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onClick={() => setLightboxImage(img)}
          >
            <img
              src={`/${img}`}
              alt={`Nail design ${i + 2}`}
              style={{ width: "100%", borderRadius: "10px" }}
            />
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <img
            src={`/${lightboxImage}`}
            alt="Expanded Nail Art"
            style={{
              maxHeight: "90vh",
              maxWidth: "90vw",
              borderRadius: "10px",
              boxShadow: "0 0 20px rgba(255,255,255,0.2)",
            }}
          />
        </div>
      )}

      <hr style={{ width: "90%", margin: "3rem auto 2rem", borderTop: "1px solid #ccc" }} />

      {/* Contact Info Section */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.8rem", marginBottom: "1.5rem" }}>Contact Info</h2>

        {/* Horizontal Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "2rem",
            flexWrap: "wrap",
            marginBottom: "1rem"
          }}
        >
          <p style={{ fontSize: "1rem", color: "#444", margin: 0 }}>
            📞 (661) 313-3802
          </p>
          <p style={{ fontSize: "1rem", color: "#444", margin: 0 }}>
            📧 <a href="mailto:natalie@example.com">nx3nails@gmail.com</a>
          </p>
          <a
            href="https://www.instagram.com/nx3nails?igsh=NTc4MTIwNjQ2YQ=="
            target="_blank"
            rel="noopener noreferrer"
            title="Visit Instagram"
          >
            <img
              src="/Instagram_icon.png"
              alt="Instagram"
              style={{ width: "30px", height: "30px" }}
            />
          </a>
        </div>

        {/* Underneath Text */}
        <p style={{ fontSize: "0.95rem", color: "#777" }}>
          Reach out to book custom sets or ask questions.
        </p>
      </div>
    </div>
  );
}
import { useState } from "react";

export default function Home() {
  const [lightboxImage, setLightboxImage] = useState(null);

  const images = [
    "nail-art(1).jpg",
    "nail-art(2).jpg",
    "nail-art(3).jpg",
    "nail-art(4).jpg",
    "nail-art(5).jpg",
    // Add more image filenames as needed
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "1rem",
      }}
    >
      <h1>Welcome to Natalie's Booking Portal</h1>
      <p>
        This is where you can learn about her services and book appointments.
      </p>

      <img
        src="/nail-art(1).jpg"
        alt="nail art(1)"
        style={{ width: "500px", borderRadius: "10px", marginTop: "1rem" }}
      />

      <h2>About Natalie</h2>
      <p>
        Natalie is a licensed nail technician who provides personalized nail
        services.
      </p>

      {/* Divider line */}
      <hr
        style={{
          width: "150%",
          margin: "2rem 0 2rem",
          border: "none",
          borderTop: "1px solid #333",
        }}
      />

      <h2 style={{ marginBottom: "2rem", fontSize: "2rem" }}>Nail Portfolio</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          padding: "0 2rem",
          width: "100%",
          maxWidth: "1000px",
        }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            style={{
              cursor: "pointer",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "rotate(3deg) scale(1.05)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "rotate(0deg) scale(1)")
            }
            onClick={() => setLightboxImage(img)}
          >
            <img
              src={`/${img}`}
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
    </div>
  );
}


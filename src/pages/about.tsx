import React from "react";
import NextNProgress from "nextjs-progressbar";
import Topbar from "@/components/UI/Topbar";

const AboutPage = () => {
  return (
    <div style={{ backgroundColor: "#0D1F23" }}>
      <NextNProgress color="#FFB000" />
      <div className="pl-5">
        <Topbar />
      </div>
      <div className="pt-10 text-center">
        <div className="flex justify-center">
          <img
            src="/icons/logo.webp"
            alt=""
            className="object-cover h-48 w-48 rounded-full"
          />
        </div>
        <h1 className="pt-10 px-4 mb-4 text-xl text-white font-extrabold text-gray-900 md:text-xl lg:text-2xl">
          A cutting-edge cloud storage solution built with the latest
          technologies. Our platform is designed to provide users with a
          seamless and secure experience for managing and sharing their digital
          assets.
        </h1>
      </div>

      <div className="max-w-3xl mx-auto mt-8 p-4">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">About</h2>
          <p className="text-white">
            CloudStash is a cutting-edge cloud storage solution designed to
            revolutionize the way you manage and share digital assets.
            CloudStash leverages the power of React Three Fiber, Next.js,
            TypeScript, and AWS S3 to provide users with a seamless and secure
            cloud storage experience.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Our Mission</h2>
          <p className="text-white">
            At CloudStash, we are on a mission to simplify and enhance the way
            individuals and businesses interact with their data. Our goal is to
            empower users with a reliable and feature-rich cloud storage
            service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Key Features</h2>
          <ul className="list-disc pl-6 text-white">
            <li>
              <strong>React Three Fiber Integration:</strong> Leverage the power
              of React Three Fiber for a visually stunning and intuitive user
              interface.
            </li>
            <li>
              <strong>Next.js for Scalability:</strong> Built on Next.js, our
              platform is optimized for performance, scalability, and SEO.
            </li>
            <li>
              <strong>TypeScript for Robust Code:</strong> We believe in clean
              and maintainable code, and TypeScript ensures a robust codebase.
            </li>
            <li>
              <strong>AWS S3 Integration:</strong> Benefit from secure and
              reliable cloud storage with our integration with Amazon S3.
            </li>
            <li>
              <strong>Prisma Accelerate:</strong> Implemented Prisma Accelerate to reduce database query latency
              and significantly decreased the load on the database for improved performance.
            </li>
          </ul>
        </section>

        {/* Credits and Attributions */}
        <section className="mb-8 text-white">
          <h2 className="text-2xl font-bold mb-4 text-white">Model Credits</h2>
          <p>
            <strong>Book Spirit:</strong> <br />
            Source:{" "}
            <a
              className="no-underline hover:underline"
              target="_blank"
              href="https://sketchfab.com/3d-models/book-spirit-b77935c3c789430a95513171cf868054"
            >
              Book Spirit
            </a>{" "}
            <br />
            Author:{" "}
            <a
              className="no-underline hover:underline"
              target="_blank"
              href="https://sketchfab.com/jummydoodles"
            >
              jummydoodles
            </a>{" "}
            <br />
            License:{" "}
            <a
              className="no-underline hover:underline"
              target="_blank"
              href="http://creativecommons.org/licenses/by/4.0/"
            >
              CC-BY-4.0
            </a>{" "}
            (Author must be credited. Commercial use is allowed.)
          </p>
          <br />
          <p>
            <strong>Waste Bin:</strong> <br />
            Source:{" "}
            <a
              className="no-underline hover:underline"
              target="_blank"
              href="https://sketchfab.com/3d-models/waste-bin-a42a735a371e4845a1ae8570e42e50ce"
            >
              Waste Bin
            </a>{" "}
            <br />
            Author:{" "}
            <a
              className="no-underline hover:underline"
              target="_blank"
              href="https://sketchfab.com/GreenLineStudio"
            >
              GreenLineStudio
            </a>{" "}
            <br />
            License:{" "}
            <a
              className="no-underline hover:underline"
              target="_blank"
              href="http://creativecommons.org/licenses/by/4.0/"
            >
              CC-BY-4.0
            </a>{" "}
            (Author must be credited. Commercial use is allowed.)
          </p>
          <br />
          <p>
            <strong>Cardboard Box:</strong> <br />
            Source:{" "}
            <a
              className="no-underline hover:underline"
              target="_blank"
              href="https://sketchfab.com/3d-models/cardboard-box-f43199f19c3142c68cc672db55d9a40d"
            >
              Cardboard Box
            </a>{" "}
            <br />
            Author:{" "}
            <a
              className="no-underline hover:underline"
              target="_blank"
              href="https://sketchfab.com/Andrew.Mischenko"
            >
              Andrew.Mischenko
            </a>{" "}
            <br />
            License:{" "}
            <a
              className="no-underline hover:underline"
              target="_blank"
              href="http://creativecommons.org/licenses/by/4.0/"
            >
              CC-BY-4.0
            </a>{" "}
            (Author must be credited. Commercial use is allowed.)
          </p>
          <br />
          <p>
            <strong>Cloud Test:</strong> <br />
            Source:{" "}
            <a
              className="no-underline hover:underline"
              target="_blank"
              href="https://sketchfab.com/3d-models/cloud-test-6d1fff581b3a424d88ee2125f909f3f3"
            >
              Cloud Test
            </a>{" "}
            <br />
            Author:{" "}
            <a
              className="no-underline hover:underline"
              target="_blank"
              href="https://sketchfab.com/3dartel"
            >
              Andrey Martyanov
            </a>{" "}
            <br />
            License:{" "}
            <a
              className="no-underline hover:underline"
              target="_blank"
              href="http://creativecommons.org/licenses/by/4.0/"
            >
              CC-BY-4.0
            </a>{" "}
            (Author must be credited. Commercial use is allowed.)
          </p>
        </section>

        <section className="mb-8 text-white">
          <h2 className="text-2xl font-bold mb-4 text-white">Get Started</h2>
          <p>
            Ready to experience the future of cloud storage? Sign up for
            CloudStash today and discover a new level of convenience, security,
            and innovation. Thank you for choosing CloudStash for all your
            storage needs. We're excited to have you on board!
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
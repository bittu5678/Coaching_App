import { createFileRoute } from "@tanstack/react-router";
import CoachingApp from "@/components/CoachingApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Coaching App" },
      {
        name: "description",
        content:
          "Manage students, online tests, results, and learning performance with Coaching App.",
      },
      { property: "og:title", content: "Coaching App" },
      {
        property: "og:description",
        content: "A modern workspace for coaching institutes and their students.",
      },
      { property: "og:image", content: "/assets/coaching-app-logo.png" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CoachingApp,
});

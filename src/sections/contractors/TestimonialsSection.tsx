"use client";

const testimonials = [
  {
    stars: 5,
    text: "We needed 10 designs in 2 weeks. No architect could do it. House of Watkins delivered all 10, customized for our lots, in 10 days. We've already sold 8 homes using these plans.",
    author: "Mark T.",
    role: "General Contractor, Colorado",
  },
  {
    stars: 5,
    text: "At $1,200 per plan vs $10,000 for custom design, the ROI was obvious. But what surprised us was the quality. These plans are legitimately better than what we were paying architects.",
    author: "Jennifer M.",
    role: "Home Builder, Texas",
  },
  {
    stars: 5,
    text: "The commercial license was a game-changer. We can now market these as our proprietary designs. Buyers don't know they're licensed, and we save $9,000 per home.",
    author: "David K.",
    role: "Developer, Arizona",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-white px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-gilroy text-3xl md:text-4xl font-bold text-center mb-12 text-black">What Builders Say</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-[#FFEFEB] p-6 rounded-3xl border-l-4 border-neutral-200">
              <div className="text-[#FF5C02] mb-3">{"★".repeat(testimonial.stars)}</div>
              <p className="text-[#8F8E8C] italic mb-4 leading-relaxed">&quot;{testimonial.text}&quot;</p>
              <p className="font-bold text-black">{testimonial.author}</p>
              <p className="text-sm text-[#8F8E8C]">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

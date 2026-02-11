export function FAQSchema() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Hit Refresh Conference?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Hit Refresh Conference is a premier career and wellness event in Nigeria, taking place on February 28, 2026. It brings together industry leaders and wellness experts to help professionals achieve work-life balance and sustainable career growth.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where is Hit Refresh Conference located?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Hit Refresh Conference takes place in Nigeria, with both in-person and virtual attendance options available.',
        },
      },
      {
        '@type': 'Question',
        name: 'What wellness events are happening  in 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Hit Refresh Conference is the leading wellness events in 2026, focusing on career development, mental wellness, work-life balance, and sustainable professional growth. The event includes masterclasses, wellness sessions, and networking opportunities.',
        },
      },
      {
        '@type': 'Question',
        name: 'When is Hit Refresh Conference 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Hit Refresh Conference 2026 takes place on February 28, 2026, from 8:00 AM to 4:00 PM WAT in Lagos, Nigeria.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are the ticket prices for Hit Refresh Conference?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Hit Refresh Conference offers multiple ticket options: General Admission (₦10,000), Refresh+ VIP Experience (₦18,000), Refresh Corporate packages (₦70,000), and Refresh Online Virtual Pass (₦6,500).',
        },
      },
      {
        '@type': 'Question',
        name: 'What makes Hit Refresh different from other events?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Hit Refresh Conference is not a typical motivation rally. It\'s a practical wellness summit focused on actionable strategies for work-life balance, mental wellness, and sustainable career growth. Attendees learn to work smarter, break free from burnout, and build routines that protect their wellbeing.',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}
